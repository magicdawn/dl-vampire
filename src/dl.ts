import assert from 'assert'
import _ from 'lodash'
import pretry, { RetryOptions } from 'promise.retry'
import {
  DownloadInput,
  OnProgress,
  ValidateExistingFileOptions,
  Vampire,
  VampireNewOptions,
} from './vampire'

export type DlOptions = VampireNewOptions & // new Vampire()
  DownloadInput & // file & url
  ValidateExistingFileOptions & {
    // download extra
    retry?: RetryOptions
    onprogress?: OnProgress
  }

export async function dl(options: DlOptions) {
  const {
    // VampireNewOptions
    useChromeUa,
    requestOptions,

    // DownloadInput
    url,
    file,

    // ValidateExistingFileOptions
    skipExists = true,
    expectSize,
    expectHash,
    expectHashAlgorithm = 'md5',

    // download extra
    retry = { times: 5 } as RetryOptions,
    onprogress,
  } = options

  assert(url, 'options.url can not be empty')
  assert(file, 'options.file can not be empty')

  const vampire = new Vampire({
    useChromeUa,
    requestOptions,
  })

  // no need
  const need = await vampire.needDownload({
    url,
    file,
    skipExists,
    expectSize,
    expectHash,
    expectHashAlgorithm,
  })
  if (!need) return { skip: true }

  // tryDownload
  const tryDownload = pretry(vampire.download, retry)
  await tryDownload.call(this, { url, file, onprogress })
  return { skip: false }
}
