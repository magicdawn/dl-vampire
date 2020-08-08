const path = require('path')
const _ = require('lodash')
const fse = require('fs-extra')
const debug = require('debug')('dl-vampire:vampire')
const got = require('got')
const EventEmitter = require('events')
const {getFileHash} = require('./util')

const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.99 Safari/537.36'

module.exports = class Vampire extends EventEmitter {
  constructor(options) {
    super()

    options = _.defaults(options, {
      useChromeUa: true,
      requestOptions: {},
    })

    // request
    this.request = got.extend({
      mutableDefaults: true,
    })

    // got options
    this.config(options)
  }

  config(options) {
    const instance = this.request
    const {useChromeUa, requestOptions} = options

    const update = (obj) => {
      instance.defaults.options = got.mergeOptions(instance.defaults.options, obj)
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

  async needDownload({
    url,
    file,
    skipExists = true,
    expectSize,
    expectHash,
    expectHashAlgorithm = 'md5',
  }) {
    // 不跳过, 下载
    if (!skipExists) return true

    // if not exists, go to download
    const exists = await fse.exists(file)
    if (!exists) return true

    // hash check
    if (expectHash) {
      const hash = await getFileHash({file, alg: expectHashAlgorithm})
      if (hash !== expectHash) {
        debug('needDownload: true, hash = %s & expectHash = %s', hash, expectHash)
        return true
      }
    }

    // get content-length as expectSize
    if (!expectSize) {
      // if met HTTPError, just throw
      expectSize = await this.getSize(url)

      // no size
      // goto download
      if (!expectSize) return true
    }

    // check localSize & content-length
    const stat = await fse.stat(file)
    const localSize = stat.size
    if (localSize !== expectSize) {
      debug('needDownload: true, localSize = %s & expectSize = %s', localSize, expectSize)
      return true
    }

    // skip it
    return false
  }

  /**
   * 下载一个文件
   */

  async download({url, file, onprogress}, onCancel) {
    // ensure & construct
    file = path.resolve(file)
    await fse.ensureDir(path.dirname(file))
    const fileStream = fse.createWriteStream(file)

    return new Promise((resolve, reject) => {
      const networkStream = this.request.stream(url)
      let req

      // networkStream
      /* eslint no-unused-vars: off */
      networkStream.on('error', (err, body, response) => {
        reject(err)
      })
      networkStream.on('request', (request) => {
        req = request
      })
      if (onprogress) {
        networkStream.on('downloadProgress', (progress) => {
          onprogress(progress)
        })
      }

      // fileStream
      fileStream.on('error', reject)
      fileStream.on('finish', function () {
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
