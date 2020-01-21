import {RetryOptions} from 'promise.retry'

// https://github.com/sindresorhus/got/blob/v9.6.0/source/progress.js#L16
export interface DownloadProgressItem {
  percent: number
  transferred: number
  total: number
}

export interface DownloadOptions {
  url: string
  file: string
  skipExists?: boolean
  onprogress?: (p: DownloadProgressItem) => any
  retry?: RetryOptions
}

export interface DownloadResult {
  skip: boolean
}

export default function dl(options: DownloadOptions): Promise<DownloadResult>
