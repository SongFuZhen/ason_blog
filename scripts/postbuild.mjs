import rss from './rss.mjs'
import indexNow from './indexnow.mjs'

async function postbuild() {
  await rss()
  await indexNow()
}

postbuild()
