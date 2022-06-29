import _debug from 'debug'
import EventEmitter from 'events'
import fse from 'fs-extra'
import got, { Got, Options, Progress } from 'got'
import _ from 'lodash'
import path from 'path'
import ProxyAgent from 'proxy-agent'
import { pipeline } from 'stream/promises'
import { getFileHash } from './util'

const debug = _debug('dl-vampire:vampire')

const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.99 Safari/537.36'

export interface VampireNewOptions {
  useChromeUa?: boolean
  useProxyEnv?: boolean
  requestOptions?: Options
}

// for validating existing files
export interface ValidateExistingFileOptions {
  skipExists?: boolean
  expectSize?: number
  expectHash?: string
  expectHashAlgorithm?: string
}

export interface DownloadInput {
  url: string
  file: string
}

export type { Progress }
export type OnProgress = (progress: Progress) => void

export class Vampire extends EventEmitter {
  constructor(options?: VampireNewOptions) {
    super()

    options = _.defaults(options, {
      useChromeUa: true,
      useProxyEnv: true,
      requestOptions: {},
    })

    // request
    this.request = got.extend({
      mutableDefaults: true,
    })

    // got options
    this.config(options)
  }

  request: Got

  config(options: VampireNewOptions) {
    const instance = this.request
    const { useChromeUa, useProxyEnv, requestOptions } = options

    const update = (obj: Options) => {
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

    // use http_proxy / https_proxy / all_proxy env
    if (useProxyEnv) {
      const agent = new ProxyAgent()
      update({
        agent: {
          http: agent,
          https: agent,
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
  async getSize(url: string) {
    const res = await this.request.head(url)
    const len = res.headers['content-length']
    if (!len) return
    debug('content-length = %s for %s', len, url)

    const lenNum = Number(len)
    return lenNum
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
  }: DownloadInput & ValidateExistingFileOptions) {
    // 不跳过, 下载
    if (!skipExists) return true

    // if not exists, go to download
    const exists = await fse.pathExists(file)
    if (!exists) return true

    // hash check
    if (expectHash) {
      const hash = await getFileHash({ file, alg: expectHashAlgorithm })
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
  async download(
    { url, file, onprogress }: { url: string; file: string; onprogress?: OnProgress },
    onCancel?: (cb: () => void) => void
  ) {
    // file
    file = path.resolve(file)
    await fse.ensureDir(path.dirname(file))
    const fileStream = fse.createWriteStream(file)

    // network
    const networkStream = this.request.stream(url)
    if (onprogress) {
      networkStream.on('downloadProgress', onprogress)
    }

    // clean when cancel
    onCancel?.(() => {
      fileStream.close()
      networkStream.destroy()
    })

    return pipeline(networkStream, fileStream)
  }
}
