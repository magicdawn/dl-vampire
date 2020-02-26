import {RetryOptions, OnCancel} from 'promise.retry'
import {strict} from 'assert'

// https://github.com/sindresorhus/got/blob/v9.6.0/source/progress.js#L16
export interface DownloadProgressItem {
  percent: number
  transferred: number
  total: number
}

export interface VampireNewOptions {
  skipExists?: boolean
  useChromeUa?: boolean
  requestOptions?: Object
}

export interface VampireDownloadOptions {
  url: string
  file: string
  onprogress?: (p: DownloadProgressItem) => any
}

export interface DownloadOptions extends VampireNewOptions, VampireDownloadOptions {
  retry?: RetryOptions
}

export interface DownloadResult {
  skip: boolean
}

export default function dl(options: DownloadOptions): Promise<DownloadResult>

export class Vampire {
  constructor(options: VampireNewOptions)
  needDownload(options: {url: string; file: string}): Promise<boolean>
  download(options: VampireDownloadOptions, onCancel?: OnCancel): Promise<void>
}

export interface ReadUrlOptions extends VampireNewOptions {
  url: string
  file?: string
  onprogress?: (p: DownloadProgressItem) => any
  retry?: RetryOptions

  // extra
  encoding?: string
}

export function readUrl<T extends ReadUrlOptions>(
  options: T
): T extends {encoding: string} ? Promise<string> : Promise<Buffer>
