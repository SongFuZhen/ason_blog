# 跳板机转发内网 PostgreSQL：iptables / firewalld / nginx 三方案

## 拓扑

```
客户端(公网)
   │ 53.32.211.193:25432
   ▼
跳板机 53.32.211.193 (双网卡：公网 + 内网)
   │ 内网口 192.1.1.x → 192.1.1.23:5432
   ▼
内网机 192.1.1.23:5432 (PostgreSQL)
```

目标：公网客户端访问 `53.32.211.193:25432`，经跳板机四层转发，落到内网 `192.1.1.23:5432`。

## 前提

- 跳板机与内网机三层互通（同 VLAN、内网网卡或 VPN），跳板机有到 `192.1.1.23` 的路由。
- NAT 方案需要跳板机内核开启转发。
- 内网机 `postgresql.conf` 监听 `0.0.0.0` 或 `192.1.1.23`；`pg_hba.conf` 放行跳板机**内网 IP**。DNAT / 代理会改写源地址，DB 看到的客户端是跳板机内网口，不是真实公网客户端。

## 方案一：iptables DNAT

纯内核转发，零用户态开销，延迟最低。

```bash
# 1. 开启转发
sysctl -w net.ipv4.ip_forward=1
grep -q '^net.ipv4.ip_forward=1' /etc/sysctl.conf || echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf

# 2. 入向改目标地址（只处理公网网卡 eth0 收来的 25432）
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 25432 \
  -j DNAT --to-destination 192.1.1.23:5432

# 3. 出向做源地址伪装，保证回包原路返回
iptables -t nat -A POSTROUTING -p tcp -d 192.1.1.23 --dport 5432 -j MASQUERADE

# 4. 放行转发链
iptables -A FORWARD -p tcp -d 192.1.1.23 --dport 5432 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
iptables -A FORWARD -p tcp -s 192.1.1.23 --sport 5432 -m conntrack --ctstate ESTABLISHED -j ACCEPT
```

持久化：`iptables-save > /etc/iptables/rules.v4`，配合 `iptables-persistent` / `netfilter-persistent` 开机回灌。

## 方案二：firewalld

RHEL / CentOS 系的封装，底层仍是 NAT，等价于方案一，语法更短。

```bash
# 开启 IP 伪装（= MASQUERADE + 放行 forward 链）
firewall-cmd --permanent --add-masquerade

# 端口转发
firewall-cmd --permanent --add-forward-port=port=25432:proto=tcp:toaddr=192.1.1.23:toport=5432

firewall-cmd --reload
```

只想绑公网网卡时，把 `masquerade` 与 `forward-port` 加在对应 zone（默认 public）即可。

## 方案三：nginx stream（四层 TCP 代理）

nginx 不止反代 HTTP，`stream` 模块在传输层转发任意 TCP，PostgreSQL 协议透传无碍。

```nginx
# /etc/nginx/nginx.conf 顶层，与 http 平级，不能写进 http 块
stream {
    server {
        listen 53.32.211.193:25432;   # 只绑公网 IP
        proxy_pass 192.1.1.23:5432;
        proxy_connect_timeout 5s;
        proxy_timeout 1h;

        # 可选：仅放行特定来源
        allow 203.0.113.0/24;
        deny  all;
    }
}
```

```bash
nginx -t && systemctl reload nginx
```

确认带 stream 模块：`nginx -V 2>&1 | grep -o with-stream`（发行版包默认内置）。DB 看到的客户端是 nginx 所在机（跳板机）的内网 IP，`pg_hba.conf` 放行该 IP。

## 三方案对比

| 维度     | iptables           | firewalld                    | nginx stream                      |
| -------- | ------------------ | ---------------------------- | --------------------------------- |
| 转发位置 | 内核 netfilter     | 内核 netfilter               | 用户态                            |
| 延迟     | 最低               | 最低                         | 略高，可忽略                      |
| 可观测性 | 弱（看 conntrack） | 弱                           | 强（access_log、stub_status）     |
| 访问控制 | `-s` 源 IP         | rich rule                    | `allow/deny`、geo                 |
| TLS      | 不支持             | 不支持                       | 可 `proxy_ssl` 加密回程           |
| 多后端   | 否                 | 否                           | 可 `upstream` 负载均衡            |
| 适用场景 | 纯转发、求极简     | RHEL 系、不想碰 raw iptables | 已在跑 nginx、要 TLS / 日志 / ACL |

## 安全注意

- 非标准端口 25432 不是安全手段，扫描器照扫。公网侧务必用 `allow/deny` 或 iptables `-s` 限制来源 IP。
- PostgreSQL 本身：强制 `scram-sha-256`、禁用超级用户远程登录、`pg_hba.conf` 收窄库 / 用户 / 网段。
- 更稳的做法是 SSH 隧道或 VPN，把 25432 只监听在跳板机回环，彻底不暴露公网。用 nginx 时可 `listen 127.0.0.1:25432`，再叠 `ssh -L 25432:127.0.0.1:25432 user@53.32.211.193`。
- 跳板机只做转发、不装业务，减小攻击面。

## 验证

```bash
# 跳板机确认监听
ss -tlnp | grep 25432

# 客户端连通性
nc -vz 53.32.211.193 25432
psql "host=53.32.211.193 port=25432 user=xxx dbname=xxx"

# 连接数 / NAT 表项
conntrack -L | grep 5432
```
