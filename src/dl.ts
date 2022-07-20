import assert from 'assert'
import { HTTPError } from 'got'
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
    /**
     * Print detail before error thrown
     * @defaultValue `true`
     */
    inspectError?: boolean
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
    inspectError = true,
  } = options

  assert(url, 'options.url can not be empty')
  assert(file, 'options.file can not be empty')

  const vampire = new Vampire({
    useChromeUa,
    requestOptions,
  })

  const tryInspectError = (e?: Error) => {
    if (!inspectError || !e) return

    if (e instanceof HTTPError) {
      console.error(
        '[dl-vampire]: HTTPError happens for url=%s file=%s statusCode=%s',
        url,
        file,
        e.response.statusCode
      )
    } else {
      console.error('[dl-vampire]: error happens for url=%s file=%s', url, file)
    }
  }

  // no need
  try {
    const need = await vampire.needDownload({
      url,
      file,
      skipExists,
      expectSize,
      expectHash,
      expectHashAlgorithm,
    })
    if (!need) return { skip: true }
  } catch (e) {
    tryInspectError(e)
    throw e
  }

  // tryDownload
  const tryDownload = pretry(vampire.download, retry)

  try {
    await tryDownload.call(vampire, { url, file, onprogress })
    return { skip: false }
  } catch (e) {
    tryInspectError(e)
    throw e
  }
}
