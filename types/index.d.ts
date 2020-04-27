import {RetryOptions, OnCancel} from 'promise.retry'
import {Progress as DownloadProgressItem} from 'got'

// https://github.com/sindresorhus/got/blob/v9.6.0/source/progress.js#L16
// got@v10 use TypeScript
// export interface DownloadProgressItem {
//   percent: number
//   transferred: number
//   total: number
// }
export {DownloadProgressItem}

export interface VampireNewOptions {
  useChromeUa?: boolean
  requestOptions?: Object
}

export interface VampireNeedDownloadOptions {
  url: string
  file: string

  // validate
  skipExists?: boolean
  expectSize?: number
  expectHash?: string
  expectHashAlgorithm?: string
}

export interface VampireDownloadOptions {
  url: string
  file: string
  onprogress?: (p: DownloadProgressItem) => any
}

export interface DlOptions
  extends VampireNewOptions,
    VampireNeedDownloadOptions,
    VampireDownloadOptions {
  retry?: RetryOptions
}

export interface DownloadResult {
  skip: boolean
}

export default function dl(options: DlOptions): Promise<DownloadResult>

export class Vampire {
  constructor(options: VampireNewOptions)
  needDownload(options: VampireNeedDownloadOptions): Promise<boolean>
  download(options: VampireDownloadOptions, onCancel?: OnCancel): Promise<void>
}

export interface ReadUrlOptions extends VampireNewOptions {
  url: string
  file?: string

  // download extra
  onprogress?: (p: DownloadProgressItem) => any
  retry?: RetryOptions

  // validate
  skipExists?: boolean
  expectSize?: number
  expectHash?: string
  expectHashAlgorithm?: string

  // extra
  encoding?: string
}

export function readUrl<T extends ReadUrlOptions>(
  options: T
): T extends {encoding: string} ? Promise<string> : Promise<Buffer>
