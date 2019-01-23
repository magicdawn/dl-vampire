const path = require('path')
const _ = require('lodash')
const fs = require('fs-extra')
const symbols = require('log-symbols')
const debug = require('debug')('dl-vampire:index')
const pretry = require('promise.retry')
const r = require('request').defaults()
const rp = require('request-promise').defaults()

/**
 * 取得 content-length
 */

exports.getSize = async url => {
  const res = await rp.head(url, {
    resolveWithFullResponse: true,
  })
  let len = res.headers['content-length']
  if (!len) return

  len = parseInt(len, 10)
  debug('content-length %s for %s', len, url)
  return len
}

/**
 * 是否有需要下载一个文件
 */

exports.needDownload = async function({url, file, skipExists}) {
  // 不跳过, 下载
  if (!skipExists) return true

  // if not exists, go to download
  const exists = await fs.exists(file)
  if (!exists) return true

  // get content-length
  let size
  try {
    size = await exports.getSize(url)
  } catch (e) {
    return true
  }
  if (!size) return true

  // check localSize & content-length
  const stat = await fs.stat(file)
  const localSize = stat.size
  if (localSize < size) return true

  // skip it
  return false
}

/**
 * 下载一个文件
 */

exports.download = async function download(
  {url, file, requestOptions},
  onCancel
) {
  // ensure & construct
  file = path.resolve(file)
  await fs.ensureDir(path.dirname(file))
  const s = fs.createWriteStream(file)

  return new Promise((resolve, reject) => {
    const req = r.get(url, requestOptions)
    req.on('error', reject)
    req.catch(reject)

    // pipe
    req.pipe(s)

    // fs
    s.on('error', reject).on('finish', function() {
      this.close(() => {
        resolve()
      })
    })

    // clean
    onCancel &&
      onCancel(() => {
        req && req.abort()
        s && s.close()
      })
  })
}
