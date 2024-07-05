import { EventEmitter } from 'events'
import fse from 'fs-extra'
import got, { Got, OptionsInit, Progress } from 'got'
import path from 'path'
import { ProxyAgent } from 'proxy-agent'
import { pipeline } from 'stream/promises'
import { baseDebug } from './common'
import { getFileHash, is404Error } from './util'

const debug = baseDebug.extend('vampire')

const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'

export interface VampireNewOptions {
  /**
   * use chrome's user-agent
   * @defaultValue `true`
   */
  useChromeUa?: boolean

  /**
   * use http_proxy / https_proxy environment variables, see {@link https://npm.im/proxy-agent}
   * @defaultValue `true`
   */
  useProxyEnv?: boolean

  /**
   * more got options
   */
  requestOptions?: OptionsInit
}

// for validating existing files
export interface ValidateExistingFileOptions {
  /** to skip existing valid cache file ? */
  skipExists?: boolean

  /**
   * the expected file size, if none provied, a HEAD request
   * will be sent to get the `content-length` header as a fallback.
   * if expectSize matchs existing local file's stat size, then consider existing file is valid
   */
  expectSize?: number

  /** the expected file hash for validating existing local file */
  expectHash?: string

  /** the hash algorithm that the expectHash use */
  expectHashAlgorithm?: string

  /**
   * if expectSize not provided, a HEAD request will be sent to get the `content-length` as expectSize
   * @defaultValue `true`
   */
  useHeadRequestToFetchExpectSize?: boolean
}

export interface DownloadInput {
  /** request url */
  url: string
  /** local file to save */
  file: string
}

export type { Progress }

/**
 * onprogress handler type
 */
export type OnProgress = (progress: Progress) => void

export class Vampire extends EventEmitter {
  constructor(options?: VampireNewOptions) {
    super()

    options = {
      useChromeUa: true,
      useProxyEnv: true,
      requestOptions: {},
      ...options,
    }

    // request
    this.request = got.extend({
      mutableDefaults: true,

      // Error: The `onCancel` handler was attached after the promise settled.
      // https://github.com/sindresorhus/got/issues/1489#issuecomment-1318617918
      // consider disable got retry options
      // new ver v11.8.6 fix this
      // retry: 0,
    })

    // got options
    this.config(options)
  }

  request: Got
  proxyAgent: ProxyAgent | undefined

  config(options: VampireNewOptions) {
    const instance = this.request
    const { useChromeUa, useProxyEnv, requestOptions } = options

    const update = (obj: OptionsInit) => {
      instance.defaults.options.merge(obj)
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
      const agent = (this.proxyAgent = new ProxyAgent())
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
    try {
      const res = await this.request.head(url)
      const len = res.headers['content-length']
      if (!len) return
      debug('content-length = %s for %s', len, url)
      const lenNum = Number(len)
      return lenNum
    } catch (e) {
      if (is404Error(e)) {
        return undefined
      } else {
        throw e
      }
    }
  }

  /**
   * 是否有需要下载一个文件
   */
  needDownload = async ({
    url,
    file,
    skipExists = true,
    expectSize,
    expectHash,
    expectHashAlgorithm = 'md5',
    useHeadRequestToFetchExpectSize = true,
  }: DownloadInput & ValidateExistingFileOptions) => {
    // 不跳过, 下载
    if (!skipExists) return true

    // if not exists, go to download
    if (!(await fse.exists(file))) return true

    // hash check
    if (expectHash && expectHashAlgorithm) {
      const hash = await getFileHash({ file, alg: expectHashAlgorithm })
      if (hash !== expectHash) {
        debug(
          'needDownload for hash mismatch: alg=%s actual(%s) != expect(%s)',
          expectHashAlgorithm,
          hash,
          expectHash,
        )
        return true
      }
    }

    // size check
    const stat = await fse.stat(file)
    const localSize = stat.size
    if (localSize === 0) {
      debug('needDownload for local file invalid, stat.size = 0')
      return true
    }

    // get content-length as expectSize
    if (!expectSize && useHeadRequestToFetchExpectSize) {
      // if met HTTPError, just throw
      expectSize = await this.getSize(url)
    }

    // no size, goto download
    if (!expectSize) {
      return true
    }

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
  download = async (
    { url, file, onprogress }: { url: string; file: string; onprogress?: OnProgress },
    signal?: AbortSignal,
  ) => {
    // network
    const networkStream = this.request.stream(url)
    if (onprogress) {
      networkStream.on('downloadProgress', onprogress)
    }

    // file
    file = path.resolve(file)
    await fse.ensureDir(path.dirname(file))
    const fileStream = fse.createWriteStream(file)

    // clean when cancel
    signal?.addEventListener('abort', () => {
      fileStream.close()
      networkStream.destroy()
    })

    try {
      await pipeline(networkStream, fileStream)
    } catch (e) {
      if (is404Error(e)) {
        await fse.remove(file)
      }

      throw e
    }
  }
}
