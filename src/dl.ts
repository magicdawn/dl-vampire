import assert from 'node:assert'
import { HTTPError, RequestError } from 'got'
import pretry, { RetryError, type RetryOptions } from 'promise.retry'
import { Vampire, type DownloadInput, type OnProgress, type ValidateExistingFileOptions, type VampireNewOptions } from './vampire'

export type DlOptions = VampireNewOptions & // new Vampire()
  DownloadInput & // file & url
  ValidateExistingFileOptions & {
    /** retry options, will pass to promise.retry {@link pretry} */
    retry?: RetryOptions

    /** on download progress */
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
    useProxyEnv,

    // DownloadInput
    url,
    file,

    // ValidateExistingFileOptions
    skipExists = true,
    expectSize,
    expectHash,
    expectHashAlgorithm = 'md5',
    useHeadRequestToFetchExpectSize = true,

    // download extra
    retry = { times: 5 } as RetryOptions,
    onprogress,
    inspectError: inspectErrorFlag = true,
  } = options

  assert(url, 'options.url can not be empty')
  assert(file, 'options.file can not be empty')

  const vampire = new Vampire({
    useChromeUa,
    requestOptions,
    useProxyEnv,
  })

  const callInspectError = (e?: Error) => {
    if (!inspectErrorFlag || !e) return
    inspectError(e, { url, file })
  }

  // check need download
  const tryNeedDownload = pretry(vampire.needDownload, retry)
  try {
    const need = await tryNeedDownload({
      url,
      file,
      skipExists,
      expectSize,
      expectHash,
      expectHashAlgorithm,
      useHeadRequestToFetchExpectSize,
    })
    if (!need) return { skip: true }
  } catch (e) {
    callInspectError(e)
    throw e
  }

  // tryDownload
  const tryDownload = pretry(vampire.download, retry)
  try {
    await tryDownload({ url, file, onprogress })
    return { skip: false }
  } catch (e) {
    callInspectError(e)
    throw e
  }
}

export function inspectError(e: Error | undefined, { url, file }: Pick<DlOptions, 'url' | 'file'>) {
  if (e instanceof RequestError) {
    return console.error('[dl-vampire]: RequestError happens for url=%s file=%s code=%s', url, file, e.code)
  }
  if (e instanceof HTTPError) {
    return console.error('[dl-vampire]: HTTPError happens for url=%s file=%s statusCode=%s', url, file, e.response.statusCode)
  }
  if (e instanceof RetryError) {
    const innerErrorTypes = new Set(e.errors.map((e) => e.constructor.name))
    const statusCodes = new Set(e.errors.map((e) => (e instanceof HTTPError ? e.response.statusCode : undefined)).filter(Boolean))
    const errorCodes = new Set(
      e.errors.map((e) => (e instanceof RequestError && !(e instanceof HTTPError) ? e.code : undefined)).filter(Boolean),
    )
    return console.error(
      `[dl-vampire]: RetryError(inner errorType:%o  HTTPError.statusCode:%o  RequestError.code:%o) happens for url=%s file=%s`,
      innerErrorTypes,
      statusCodes,
      errorCodes,
      url,
      file,
    )
  }

  console.error('[dl-vampire]: error happens for url=%s file=%s', url, file)
}
