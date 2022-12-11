import { dl } from './dl'
import { Vampire } from './vampire'
import { readUrl, getReadUrlCacheFile } from './read-url'
import { is404Error, isGot404Error } from './util'

// types
export type { DlOptions } from './dl'
export type { ReadUrlOptions, ReadUrlOptionsWithEncoding } from './read-url'
export type {
  VampireNewOptions,
  ValidateExistingFileOptions,
  OnProgress,
  Progress,
} from './vampire'

import {
  // all got.*Error
  RequestError,
  HTTPError,
  MaxRedirectsError,
  UnsupportedProtocolError,
  TimeoutError as RequestTimeoutError,
  ReadError,
  CacheError,
  ParseError,
  CancelError,
  UploadError,
} from 'got'
import { RetryError, TimeoutError } from 'promise.retry'

export {
  Vampire,
  readUrl,
  getReadUrlCacheFile,
  dl,
  is404Error,
  isGot404Error,

  // promise.retry errors
  /**
   * RetryError from promise.retry
   */
  RetryError,
  /**
   * TimeoutError from promise.retry
   */
  TimeoutError,

  // got errors
  RequestError,
  HTTPError,
  MaxRedirectsError,
  UnsupportedProtocolError,

  /**
   * got.TimeoutError re-exported as RequestTimeoutError
   */
  RequestTimeoutError,
  ReadError,
  CacheError,
  ParseError,
  CancelError,
  UploadError,
}
export default dl

// https://github.com/sindresorhus/got/blob/v11.8.3/source/index.ts#L127
module.exports = dl
Object.assign(module.exports, {
  __esModule: true,
  default: dl,
  dl,
  Vampire,
  readUrl,
  getReadUrlCacheFile,
  is404Error,
  isGot404Error,

  // promise.retry errors
  RetryError,
  TimeoutError,

  // got errors
  RequestError,
  HTTPError,
  MaxRedirectsError,
  UnsupportedProtocolError,
  RequestTimeoutError,
  ReadError,
  CacheError,
  ParseError,
  CancelError,
  UploadError,
})
