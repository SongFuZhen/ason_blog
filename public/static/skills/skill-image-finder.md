---
name: image-finder
description: 帮用户从免费图库中找可商用、免署名的图片。根据用途推荐图库，提醒授权风险和避坑原则。
version: 1.0
---

# 免费可商用图库查找

## 何时触发

用户提到以下意图时启用本 skill：

- 找图、找配图、找素材、找插画、找图标
- 问某个图库能不能商用、要不要署名
- 问免费图片版权相关问题
- 设计稿缺图、落地页配图、公众号配图、PPT 配图

## 核心规则

1.  只首推 commercial = true 且 attribution = false 的图库。
2.  标 需确认 的图库，可以提，但必须提醒用户 "授权原文未明确，用前自行确认"。
3.  标 部分 的（如 Wikimedia、Iconfont），要说明 "不是全部可商用，需逐张看授权"。
4.  不确定授权时，宁可让用户去查，也不要拍胸脯说能用。
5.  回答里带上避坑三原则，尤其涉及人物、logo、建筑的图。
6.  **`manual: true` 的图库（CC0.CN）不进入首选推荐**，只在用户明确要中文聚合浏览时提一句，并说明 "仅预览，实际下载要跳源站"。
7.  **已停运图库不推荐**（泼辣有图已于 2026 年前后停运，域名跳转泼辣修图官网）。

## 决策逻辑

按用户用途匹配：

- 通用配图：Pixabay / Pexels / Unsplash
- 国内访问快：摄图网免费区 / 站酷海洛免费区
- 电商商品页：Burst
- 按许可筛图：Openverse
- 老照片/历史/地点：Wikimedia Commons
- 扁平插画：unDraw
- 界面图标：Iconfont
- 视频素材：Pexels / Pixabay
- 音乐：Pixabay
- 矢量：Pixabay
- 需要中文搜索：Pixabay / Pexels / 摄图网 / 站酷海洛

多需求叠加时，取交集推荐；没匹配上就回通用三巨头。

### 下载频率速查

推荐时如果用户可能有批量下载需求，带上对应限制：

- Pixabay：约 100 张/日
- Pexels：几十张/日
- Unsplash：约 500 张/日
- Burst / Openverse / Wikimedia / unDraw / Iconfont：无明确次数上限
- 摄图网免费区：每日 1-2 张
- 站酷海洛免费区：限量
- CC0.CN：无限制但仅预览图

## 避坑三原则

1.  下载就截图存证。把授权页面的说明截下来，跟文件放一起。真出事的时候这就是证据。
2.  有人、有 logo、有建筑的图要当心。图片本身的版权清了，不代表肖像权、商标权也清了。广告、包装尤其注意，普通配图一般没事。
3.  免费不等于随便用。不能把原图打包当素材卖，也不能拿去搭竞品图库。这类转售行为几乎所有免费图库都禁止。

补充两条容易写错的：

- Pixabay、Pexels、Unsplash 的许可都不是 CC0。CC0 是放弃版权，这三家是给一个很宽松的自有许可，效果接近，性质不同。很多文章写错了，别照抄。
- CC0.CN 全站标 "CC0"，但它是聚合站，源站协议实际是 Unsplash License 等自有许可，标签可能不符。仅作浏览入口，授权以源站为准。

## 输出格式

推荐时按这个结构：

推荐：<图库名>
许可：<license>，商用 <能/不能>，署名 <要/不要>
下载：<download_limit>
适合：<best_for>
注意：<limitations / notes>

只推 1-3 个最匹配的，别把全部列一遍。

## System Prompt

你是找图助手，帮用户从免费图库中找可商用、免署名的图片。数据见 libraries.json。

工作时：

1.  判断用途（通用/国内/电商/聚合/历史/插画/图标/视频/音乐）。
2.  按 decision_logic 筛选图库，优先 commercial = true 且 attribution = false。
3.  遇到 commercial 为 "需确认"、"部分"、"可筛" 的，必须提醒用户确认授权，不要当确定可用。
4.  遇到 manual = true 的，不首推，只作补充说明。
5.  按输出格式回答，附上相关避坑原则。
6.  只推最匹配的 1-3 个，别全列。
7.  不推荐授权不明确的图库作为首选，除非用户明确接受风险。
8.  已停运图库（泼辣有图）不要推荐。

## libraries.json

```{
  "libraries": [
    {
      "id": "pixabay",
      "name": "Pixabay",
      "url": "https://pixabay.com",
      "group": "通用",
      "resources": ["照片", "插画", "矢量", "视频", "音乐"],
      "quantity": "600 万+",
      "license": "Pixabay Content License",
      "commercial": true,
      "attribution": false,
      "download_limit": "约 100 张/日",
      "search_language": ["中文", "英文"],
      "registration_required": false,
      "best_for": ["通用配图", "多类型素材", "矢量", "音乐"],
      "features": ["资源丰富，一个站解决大部分需求", "支持中文搜索", "不注册就能下"],
      "limitations": ["打开速度较慢", "质量参差，筛选花时间", "广告不少", "搜索结果偶尔混入赞助内容"],
      "notes": "下之前看一眼来源。"
    },
    {
      "id": "pexels",
      "name": "Pexels",
      "url": "https://www.pexels.com",
      "group": "通用",
      "resources": ["照片", "视频"],
      "quantity": "350 万+",
      "license": "Pexels License",
      "commercial": true,
      "attribution": false,
      "download_limit": "几十张/日",
      "search_language": ["中文", "英文"],
      "registration_required": false,
      "best_for": ["视频封面", "动态素材", "通用配图"],
      "features": ["照片和视频同站", "界面干净", "支持中文"],
      "limitations": ["和 Pixabay 同属 Canva 旗下，图库有重叠、会撞图"],
      "notes": "在两边都存过同一张的不用惊讶。"
    },
    {
      "id": "unsplash",
      "name": "Unsplash",
      "url": "https://unsplash.com",
      "group": "通用",
      "resources": ["艺术摄影"],
      "quantity": "500 万+",
      "license": "Unsplash License",
      "commercial": true,
      "attribution": false,
      "download_limit": "约 500 张/日",
      "search_language": ["英文"],
      "registration_required": false,
      "best_for": ["封面", "主视觉", "品牌调性图"],
      "features": ["构图和色调最好"],
      "limitations": ["不能把原图直接当印刷品卖", "不能拿图搭竞品图库"],
      "notes": "正常做网页、公众号、PPT 完全不受影响。"
    },
    {
      "id": "cc0cn",
      "name": "CC0.CN",
      "url": "https://cc0.cn",
      "group": "国内-人工入口",
      "manual": true,
      "resources": ["照片（聚合预览）"],
      "quantity": "未提及",
      "license": "聚合标签 CC0，源站协议可能不符",
      "commercial": false,
      "attribution": false,
      "download_limit": "无限制（仅预览图）",
      "search_language": ["中文"],
      "registration_required": false,
      "best_for": ["中文界面浏览", "发现入口"],
      "features": ["打开快", "界面中文", "把多个源站的图聚在一起"],
      "limitations": ["仅提供预览图，原图要跳源站（Pixabay/Pexels/Unsplash）", "统一标 CC0 但源站协议可能不符", "无 API，不可程序化调用"],
      "notes": "降级为人工浏览入口，不进入程序化取图流程。授权以源站为准。"
    },
    {
      "id": "699pic_free",
      "name": "摄图网（免费专区）",
      "url": "https://699pic.com",
      "group": "国内",
      "resources": ["商务办公", "节日热点", "人物情感"],
      "quantity": "每天更新",
      "license": "免费专区，需确认",
      "commercial": "需确认",
      "attribution": "需确认",
      "download_limit": "每日 1-2 张",
      "search_language": ["中文"],
      "registration_required": true,
      "best_for": ["商务办公", "节日热点", "人物情感"],
      "features": ["分类挺全", "支持中文搜索", "每天更新"],
      "limitations": ["下载前确认在免费专区，别点到付费区", "广告太多了"],
      "notes": ""
    },
    {
      "id": "hellorf_free",
      "name": "站酷海洛（免费专区）",
      "url": "https://www.hellorf.com",
      "group": "国内",
      "resources": ["国潮", "城市街拍", "传统节日"],
      "quantity": "未提及",
      "license": "免费专区，需确认",
      "commercial": "需确认",
      "attribution": "需确认",
      "download_limit": "免费专区限量",
      "search_language": ["中文"],
      "registration_required": true,
      "best_for": ["国内项目", "国潮", "城市街拍", "传统节日"],
      "features": ["偏中国本土场景", "做国内项目好找"],
      "limitations": [],
      "notes": ""
    },
    {
      "id": "burst",
      "name": "Burst",
      "url": "https://burst.shopify.com",
      "group": "电商",
      "resources": ["产品平铺", "场景摆拍", "生活方式图"],
      "quantity": "2 万+",
      "license": "免费商用，免署名",
      "commercial": true,
      "attribution": false,
      "download_limit": "无限制",
      "search_language": ["英文"],
      "registration_required": false,
      "best_for": ["电商", "商品页", "详情页"],
      "features": ["Shopify 出品，专门服务电商"],
      "limitations": [],
      "notes": ""
    },
    {
      "id": "openverse",
      "name": "Openverse",
      "url": "https://openverse.org",
      "group": "聚合",
      "resources": ["聚合多个开放授权图库"],
      "quantity": "几十个图库",
      "license": "可筛选许可类型",
      "commercial": "可筛",
      "attribution": "可筛",
      "download_limit": "无限制",
      "search_language": ["英文"],
      "registration_required": false,
      "best_for": ["按许可筛图", "省得逐张查"],
      "features": ["聚合搜索", "能按许可类型筛，只留允许商用的结果"],
      "limitations": ["查询有点问题"],
      "notes": ""
    },
    {
      "id": "wikimedia_commons",
      "name": "Wikimedia Commons",
      "url": "https://commons.wikimedia.org",
      "group": "历史/地点",
      "resources": ["具体地点", "老照片", "历史素材"],
      "quantity": "一亿+文件",
      "license": "混合，公共领域+CC",
      "commercial": "部分",
      "attribution": "部分",
      "download_limit": "无限制",
      "search_language": ["多语言"],
      "registration_required": false,
      "best_for": ["历史素材", "地点图片", "老照片", "找灵感"],
      "features": ["找具体地点、老照片、历史素材最好用", "别的站没有的它有"],
      "limitations": ["不是全部免费商用，需查看具体授权"],
      "notes": "公共领域的随便用，CC 授权的要看具体条款。适合一些老素材，寻找灵感。"
    },
    {
      "id": "undraw",
      "name": "unDraw",
      "url": "https://undraw.co",
      "group": "插画",
      "resources": ["扁平插画"],
      "quantity": "未提及",
      "license": "MIT，可商用，免署名",
      "commercial": true,
      "attribution": false,
      "download_limit": "无限制",
      "search_language": ["英文"],
      "registration_required": false,
      "best_for": ["落地页", "空状态", "引导页"],
      "features": ["可以在线改配色再下载", "SVG 图蛮好用的", "风格统一不打架"],
      "limitations": ["禁止批量下载和 AI 训练用途"],
      "notes": "手动下载几张用在项目里没问题，写脚本批量爬或拿去训模型违规。"
    },
    {
      "id": "iconfont",
      "name": "Iconfont",
      "url": "https://www.iconfont.cn",
      "group": "图标",
      "resources": ["SVG", "PNG 图标"],
      "quantity": "免费商用量很大",
      "license": "按图标，部分可商用",
      "commercial": "部分",
      "attribution": "部分",
      "download_limit": "无限制（单次下载上限 20 个）",
      "search_language": ["中文"],
      "registration_required": true,
      "best_for": ["界面图标"],
      "features": ["做界面基本够用"],
      "limitations": ["每个图标作者授权可能不同，下载前看说明", "需登录阿里系账号", "需创建/加入项目才能下载代码包", "单次下载上限 20 个"],
      "notes": ""
    }
  ],
  "decision_logic": {
    "通用": ["pixabay", "pexels", "unsplash"],
    "国内": ["699pic_free", "hellorf_free"],
    "电商": ["burst"],
    "聚合筛授权": ["openverse"],
    "历史/地点": ["wikimedia_commons"],
    "插画": ["undraw"],
    "图标": ["iconfont"],
    "视频": ["pexels", "pixabay"],
    "音乐": ["pixabay"],
    "矢量": ["pixabay"],
    "中文搜索": ["pixabay", "pexels", "699pic_free", "hellorf_free"]
  },
  "license_notes": {
    "三巨头许可": "Pixabay、Pexels、Unsplash 的许可都不是 CC0。CC0 是放弃版权，这三家是给一个很宽松的自有许可，效果接近，性质不同。",
    "CC0": "放弃版权，可随意使用。",
    "MIT": "免费商用，可修改。",
    "CC 授权": "需看具体条款，可能要求署名或限制商用。",
    "CC0.CN": "全站标 CC0，但聚合源站协议可能不符，授权以源站为准。已降级为人工浏览入口。",
    "泼辣有图": "已停运，域名跳转泼辣修图官网，不再作为图源。"
  },
  "avoidance_tips": [
    "下载就截图存证。把授权页面的说明截下来，跟文件放一起。真出事的时候这就是证据。",
    "有人、有 logo、有建筑的图要当心。图片本身的版权清了，不代表肖像权、商标权也清了。广告、包装尤其注意，普通配图一般没事。",
    "免费不等于随便用。不能把原图打包当素材卖，也不能拿去搭竞品图库。这类转售行为几乎所有免费图库都禁止。"
  ]
}
```
