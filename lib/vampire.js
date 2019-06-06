const path = require('path')
const _ = require('lodash')
const fs = require('fs-extra')
const symbols = require('log-symbols')
const debug = require('debug')('dl-vampire:index')
const pretry = require('promise.retry')
const got = require('got')
const EventEmitter = require('events')

const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.99 Safari/537.36'

module.exports = class Vampire extends EventEmitter {
  constructor(options) {
    super()

    options = _.defaults(options, {
      skipExists: true,
      useChromeUa: true,
      requestOptions: {},
    })

    // request
    this.request = got.extend({
      mutableDefaults: true,
    })

    // skipExists
    this.skipExists = !!options.skipExists

    // got options
    this.config(options)
  }

  config(options) {
    const instance = this.request
    const {useChromeUa, requestOptions} = options

    const update = obj => {
      instance.defaults.options = got.mergeOptions(
        instance.defaults.options,
        obj
      )
    }

    // use chrome user agent
    if (useChromeUa) {
      update({
        headers: {
          'user-agent': CHROME_UA,
        },
      })
    }

    // extra options
    if (requestOptions) {
      update(requestOptions)
    }
  }

  /**
   * get content-length
   */
  async getSize(url) {
    const res = await this.request.head(url)
    let len = res.headers['content-length']
    if (!len) return

    len = Number(len)
    debug('content-length = %s for %s', len, url)
    return len
  }

  /**
   * 是否有需要下载一个文件
   */

  async needDownload({url, file}) {
    // 不跳过, 下载
    if (!this.skipExists) return true

    // if not exists, go to download
    const exists = await fs.exists(file)
    if (!exists) return true

    // get content-length
    // if met HTTPError, just throw
    const size = await this.getSize(url)

    // no size
    // goto download
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

  async download({url, file}, onCancel) {
    // ensure & construct
    file = path.resolve(file)
    await fs.ensureDir(path.dirname(file))
    const fileStream = fs.createWriteStream(file)

    return new Promise((resolve, reject) => {
      const networkStream = this.request.stream(url)
      let req

      // networkStream
      networkStream.on('error', (err, body, response) => {
        reject(err)
      })
      networkStream.on('request', request => {
        req = request
      })
      networkStream.on('downloadProgress', progress => {
        this.emit('progress', progress)
      })

      // fileStream
      fileStream.on('error', reject)
      fileStream.on('finish', function() {
        this.close(() => {
          resolve()
        })
      })

      // pipe
      networkStream.pipe(fileStream)

      // clean
      onCancel &&
        onCancel(() => {
          req && req.abort()
          fileStream && fileStream.close()
        })
    })
  }
}
