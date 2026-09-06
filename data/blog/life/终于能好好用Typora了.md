---
key: 'typora-plugin-usage'
title: 我的 Typora 配置：插件与图片路径统一
date: 2026-09-06
tags: [Typora, 工具, 写作]
categories: [生活]
authors: [default]
summary: 装了 typora_plugin 之后，Typora 才好用起来；再配合 typora-root-url，本地和网站上的图片能对上。
typora-root-url: ..\..\..\public
---

用 Typora 写东西有些年头了，尤其是最近又开始写 blog 了。

但说实话，裸装的 Typora 我一直没觉得好用。直到最近装了 <span style="font-weight:bold; color:#FF0000;">typora_plugin</span>，才算是真正的用好了。

## 裸装的 Typora

默认软件能写、能预览，但写长文的时候总觉得缺点东西。

不是没有颜色，就是没有字体大小，反正用起来是各种不舒服。

没有命令面板，想插个表格、切个主题、折叠段落都得靠鼠标翻菜单；目录只能看自带的侧边大纲，层级一多就乱；

图片全靠手动往里拖，路径也不归拢，写的时候是一个相对路径，发到网站上又是一套路径，两边对不上就得来回改。

主题是够用，但想折腾点自己的样式，扩展性基本等于零。

一句话，裸装版是个干净的编辑器，不是个顺手的写作环境。

## 安装 typora_plugin

[typora_plugin](https://github.com/obgnail/typora_plugin/blob/master/README-cn.md) 是一套给 Typora 用的插件系统，仓库在 `obgnail/typora_plugin`。它本身是个插件加载器，装好之后往指定目录丢插件就能启用，等于给 Typora 开了个口子。

直达[安装教程](https://github.com/obgnail/typora_plugin/issues/847)，也可以看下面的图片，都是一样的。[Release 包](/static/files/typora-plugin@v1.19.5.zip) 我也放在这了。

![image-20260906181459040](/static/blog/image-20260906181459040.png)

<div style="font-size:0.8em; color:#606060; text-align: center;"> 图 1 安装教程 </div>

我实际用下来，明显提升体验的有这么几样：

- **文字化风格**: 打开后，就一直悬浮在页面上，可以修改颜色、上下标、行间距和字体大小等。
- **混排优化**：写文章的时候，是不是会有中英文掺杂的，这个功能一键处理，贼好用。
- **图片处理**：插入图片后能批量处理、重命名、转相对路径，不用手动整理。
- **表格、大纲增强**：长文的结构整理轻松不少。

装上这个插件，Typora 才从「能写」变成「好写」。咱平时写博客、写读书笔记，这套组合基本够用。

![image-20260906180111479](/static/blog/image-20260906180111479.png)

<div style="font-size:0.8em; color:#606060; text-align: center;"> 图 2 文字风格化悬浮 </div>

## 解决图片问题：配置 + typora-root-url

图片路径的问题，靠 Typora 的一个变量就解决了：`typora-root-url`。

首先，配置本地图片直接复制到指定目录，比如我这样，每次截完图后，直接粘贴进来它就自动在 `public/static/blog` 目录下了。

菜单操作路径： `文件 -> 偏好设置 -> 图像`

![image-20260906180501868](/static/blog/image-20260906180501868.png)

<div style="font-size:0.8em; color:#606060; text-align: center;"> 图 3  配置自动复制图片 </div>

接着，在文章 frontmatter 里写上它，等于告诉 Typora：下面所有相对路径的图片，都以这个目录为根去解析。比如本站的写法：

```yaml
typora-root-url: ..\..\..\public
```

![image-20260906180303606](/static/blog/image-20260906180303606.png)

<div style="font-size:0.8em; color:#606060; text-align: center;"> 图 4 加上 typora-root-url </div>

本篇文章在 `data/blog/life/` 下，往上三层是项目根目录，`public` 就在根目录里。

所以本地预览时，文章里写 `![配图](images/foo.png)`，Typora 会去 `public/images/foo.png` 找图，当场就能看到。

最后，发布到网站时（本站是 Next.js + Contentlayer），`public` 本来就是静态资源的根，`/images/foo.png` 指向的也是同一个文件。

本地和线上的图片路径，到这就统一了——写的时候用一份相对路径，预览和发布都不用改。

这下咋整都顺手了：编辑器里看到的是啥，发到网站上就是啥。

## 自动编号

这个功能非常实用了，经常写着写着，图片的序号、表格的序号忘了。

首先开启自动编号功能，打勾了就是开启了。

菜单路径：`鼠标右键 -> 视觉插件 -> 自动编号 -> 图片打勾  `

![image-20260906181315141](/static/blog/image-20260906181315141.png)

<div style="font-size:0.8em; color:#606060; text-align: center;"> 图 5 自动编号开关 </div>

图片编号效果，它不会自动给你填充图片序号，只是在图片下面增加个类似提示的东西，当然，也不可以编辑。

但是你自己加脚注的时候，就完全可以参考它这个序号了。

![image-20260906182032169](/static/blog/image-20260906182032169.png)

<div style="font-size:0.8em; color:#606060; text-align: center;"> 图 6 图片编号效果预览 </div>

## 组件插件

虽然我还没开始用，但是它提供的缺失挺全乎的，希望后面写 `PRD` 的时候可以用到。

![image-20260906181109245](/static/blog/image-20260906181109245.png)

<div style="font-size:0.8em; color:#606060; text-align: center;"> 图 7 组件插件 </div>

好的，今天的 Typora 先就用到这里，后续有其他好玩的再补充进来。
