import { dl } from './dl'
import { Vampire } from './vampire'
import { readUrl } from './read-url'
import { is404Error } from './util'

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
  TimeoutError,
  ReadError,
  CacheError,
  ParseError,
  CancelError,
  UploadError,
} from 'got'

export {
  Vampire,
  readUrl,
  dl,
  is404Error,

  // got
  RequestError,
  HTTPError,
  MaxRedirectsError,
  UnsupportedProtocolError,
  TimeoutError,
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
  Vampire,
  readUrl,
  is404Error,

  // errors
  RequestError,
  HTTPError,
  MaxRedirectsError,
  UnsupportedProtocolError,
  TimeoutError,
  ReadError,
  CacheError,
  ParseError,
  CancelError,
  UploadError,
})
