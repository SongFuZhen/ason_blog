import siteMetadata from '../data/siteMetadata.js'
import { allBlogs } from '../.contentlayer/generated/index.mjs'

/**
 * IndexNow 协议：构建完成后把站点 URL 推送给 Bing 等搜索引擎，
 * 加快新内容收录。详见 https://www.indexnow.org/ 。
 * 需要先在站点根路径提供 `/<key>.txt` 文件（已放在 public/）。
 */
const indexNow = async () => {
  // 构建验证（如 CI）不应把站点 URL 推送给搜索引擎。
  if (process.env.CI) {
    console.log('IndexNow skipped: CI environment')
    return
  }
  const config = siteMetadata.indexNow
  if (!config?.key) {
    console.log('IndexNow skipped: no key configured in siteMetadata.js')
    return
  }
  const siteUrl = siteMetadata.siteUrl
  const key = config.key

  const urlList = [
    `${siteUrl}/`,
    `${siteUrl}/blog`,
    `${siteUrl}/tags`,
    `${siteUrl}/projects`,
    ...allBlogs.filter((post) => post.draft !== true).map((post) => `${siteUrl}/${post.path}`),
  ]

  const payload = {
    host: siteUrl.replace(/^https?:\/\//, ''),
    key,
    keyLocation: `${siteUrl}/${key}.txt`,
    urlList,
  }

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })
    if (response.ok) {
      console.log(`IndexNow submitted ${urlList.length} URLs (HTTP ${response.status})`)
    } else {
      console.log(`IndexNow submit failed: HTTP ${response.status} ${await response.text()}`)
    }
  } catch (err) {
    console.log(`IndexNow submit error: ${err.message}`)
  }
}

export default indexNow
