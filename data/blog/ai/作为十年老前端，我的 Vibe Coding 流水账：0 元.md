---
key: 'vibe-coding-0-yuan'
title: 作为十年老前端，我的 Vibe Coding 流水账：0 元
date: 2026-09-06
tags: [AI, 前端, Vibe Coding, 账单, 免费]
categories: [AI]
authors: [default]
summary: 干了十年前端，从搭站到上线，全程没充一分钱：Vercel 免费部署，Neon 免费数据库，AI 补 logo 和文案，Next.js 从 14 升到 16，内存从 2G 降到几百 M。全部投入只有一个 14 块的域名。这篇是流水账，也是白嫖攻略。
typora-root-url: ..\..\..\public
---

我，一个干了十年前端的人，从今年 5 月份开始，折腾 Vibe Coding 直到今天，一毛钱没充过。

全部投入就 14 块，还是买域名花的，一杯奶茶钱。

看过我之前帖子的人可能也知道，我 5 月份开始申请到了 MiMo Pro 套餐，免费了一个月，从此踏入了 Vibe Coding 卷王模式。

可以查看我的另一篇文章：[11 亿 Tokens，547 次提交、花费 0 元：一个上班族的 AI 编程“免费午餐”账单](https://ason.top/blog/ai/ai-aug-summary)

![image-20260906111701460](/static/blog/image-20260906111701460.png)

<div style="font-size:0.8em; color:#606060; text-align: center;"> 图 1 WorkBuddy 卷王模式 </div>

钱这事倒不是重点。更让我感慨的是另一个感受：一个写了十年前端的人，现在居然能一个人把一个产品从头到尾跑通。搭站、数据库、部署、logo、设计稿、宣传文案，每个环节都有免费的 AI 工具一揽子帮你扛了。

这你让我在去年，我是不敢有自信说可以自己做个网站，然后推荐给朋友看看的。

毕竟，都说全栈，但作为前端，除了网页端审美，对客户友好一些之外，剩下来的东西可都是很耗费时间的，尤其是运维和 SEO 等后续一系列重复性工作。

这篇我就按顺序把我实际在用的这些白嫖方案过一遍，坑也随手标出来。

<span style="font-weight:bold;"> 你想学吗？我教你啊，哈哈！</span>

## 零、先把丑话说前头：<span style="color:#FF0000;"> 备案过不去 </span>

这条路有个硬伤。

Vercel 在国内没法备案，你要做的是面向国内用户的正经产品，尤其是带支付的那种，备案这一关就卡死了，后面的活儿全起不来。

拿来做个人项目、练手，或者主要给海外用户看的东西，随便跑，一点问题没有。

## 一、搭站：Vercel Hobby + Neon，白嫖也能跑生产

Vercel 最实在的一个便利就是，运维这事根本不用学。

Vercel 的 Hobby 计划对个人免费，连上 GitHub，push 一次自动构建上线，域名、HTTPS、<span style="color:#FF0000; font-weight:bold;"> 全球 CDN </span> 全给你安排得明明白白。数据库用的 Neon，免费档的 Postgres。在 Vercel / Storage 点一下就接进来，环境变量自动注入，省掉自己开库、配连接串的一堆破事。

个人项目那点量，免费额度绰绰有余。

有个坑得提一嘴：代码里别把数据库连接一直攥着不放，用完该还就还，不然额度掉得跟流水一样。

我有一次快到月底 Compute 超了 <span style="font-weight:bold; color:#FF0000;"> 100CU-hrs </span>，好在 Neon 次月自动重置，没整出啥幺蛾子。剩下的 <span style="font-weight:bold;"> Storage 0.5GB，Network transfer 5GB，</span> 正常小站根本摸不到这个边，放心用。

前端出身这时候就占便宜了：Node 熟，Next.js 一套代码把页面和 API 全写了，前后端不用切技术栈，一个人就是一个全栈。

## 二、Next.js 直接上 <span style="color:#FF0000;"> 16 </span>，别在 14 上耗着

版本这块我踩过一个实打实的坑。

项目最早用 Next.js 14，dev server 一启动，内存直接飙到 2G，笔记本风扇转得跟要起飞似的。后来升到 16，同一个项目，启动占用就几百 M，编译速度也快了一截。

所以建议很直接：新项目无脑上 16，老项目也值得抽半天升一下。升级本身没想象中费劲，Next.js 自带的 codemod 能处理大部分破坏性变更。

昨天我把手头四个网站一口气全升到 16，整个过程丢给 AI Coding，一遍过，没出啥幺蛾子。

## 三、设计短板，让 AI 补

前端写页面没问题，但要我自己画个 logo，画出来能把用户吓跑。

这块我用 ChatGPT 网页版补的。项目 logo、favicon、空状态插图、分享卡片，把需求描述清楚让它出几版，挑一版微调就能用。现在整个项目的配色和布局稿也是它出的，我照着还原成组件，比自己在设计工具里磨快多了。

不是说 AI 出的稿子能到专业设计师的水准，但对个人项目来说，“能用且不难看”和“一个像素都憋不出来”之间，差的就是这一步。

该说不说，模型得挑对。免费的 mimo-v2.5、deepseek-v4-flash、hy3 这些，压根不是干画图这行的，只会拿 SVG 或者 HTML 硬凑，凑出来的图一个比一个辣眼睛。

要出图，还是得找专门的 <span style="font-weight:bold; color:#FF0000;"> 图片模型 </span>。

<img src="/static/blog/ason_blog.jpg" alt="ason_blog" style="zoom:50%;" />

<div style="font-size:0.8em; color:#606060; text-align: center; "> 图 2 Ason Blog 首页设计（未采纳） </div>

## 四、文案外包给 <span style="font-weight:bold; color:#FF0000;">“专家”</span>

东西做出来了，总得让人知道吧。写推广文案、发公众号、发小红书，这活儿真不是前端擅长的。

我现在的做法是在 WorkBuddy 中，选个公众号内容创作师专家：给它主题和要点，初稿出来我自己过一遍，把瞎编的地方改掉，换换语言，通读一遍，去掉 AI 味。

工具干初稿，人管终稿，这个分工目前跑得很顺。

## 五、最终账单

最后盘一下账，到今天为止的花费：

- Vercel Hobby：0 元
- Neon 免费档：0 元
- Next.js：开源，0 元
- AI 画图、文案：全走免费额度，0 元
- 域名：14 元，第一年促销价，之后 34 一年。连这个都不想花，就用 Vercel 送的默认域名，那是真 0 元

合计：14 元，唯一一笔支出是域名。充值记录：0 笔，一毛没充。

## 六、前端已死，<span style="color:#FF0000;"> 编码永生 </span>

Vibe Coding 这事儿被吹得神乎其神，落到我这儿就三句话：技术底子在，AI 补短板，免费额度够用。咱不用等谁批准，也不用先掏钱，想做的东西今天就能开工。

站做起来之后的事，比如 <span style="color:#FF0000;"> SEO、Google AdSense </span> 这些变现路子，展开又是一篇的量，这回先不聊。坑我已经踩了一部分，下篇单独拎出来讲，感兴趣的可以先蹲着。
