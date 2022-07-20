import assert from 'assert'
import debugFactory from 'debug'
import fse from 'fs-extra'
import ms from 'ms'
import { tmpdir } from 'os'
import { join } from 'path'
import { dl, DlOptions } from './dl'
import { md5 } from './util'

const debug = debugFactory('dl-vampire:read-url')

export type ReadUrlOptions = Omit<DlOptions, 'file'> & {
  // file is optional in readUrl()
  file?: string

  // cache dir
  cacheDir?: string

  /** maxAge for cache, when string like (1d / 10min) provided, will pass to ms(string) => number */
  maxAge?: number | string
}

export type ReadUrlOptionsWithEncoding = ReadUrlOptions & {
  encoding: string
}

export async function readUrl(opts: ReadUrlOptions): Promise<Buffer>
export async function readUrl(opts: ReadUrlOptionsWithEncoding): Promise<string>
export async function readUrl(
  opts: ReadUrlOptions | ReadUrlOptionsWithEncoding
): Promise<string | Buffer> {
  const options = { ...opts }
  assert(options.url, 'options.url is required')

  // a consistent temp file
  options.file =
    options.file || getReadUrlCacheFile({ url: options.url, cacheDir: options.cacheDir })
  debug('using file = %s', options.file)

  const isCacheValid = async () => {
    if (!options.maxAge) return false
    if (!(await fse.pathExists(file))) return false

    const stat = await fse.stat(file)
    const age = Date.now() - stat.mtimeMs

    const maxAgeMs = typeof options.maxAge === 'number' ? options.maxAge : ms(options.maxAge)
    return age <= maxAgeMs
  }

  const file = options.file
  if (await isCacheValid()) {
    // console.log('readUrl download skip for %s', options.url)
    debug('skip download due to maxAge config, maxAge = %s', options.maxAge)
  } else {
    await dl(options as DlOptions)
  }

  if ('encoding' in options && options.encoding) {
    return fse.readFile(options.file, options.encoding)
  } else {
    return fse.readFile(options.file)
  }
}

export function getReadUrlCacheFile(options: Pick<ReadUrlOptions, 'cacheDir' | 'url'>) {
  const cacheDir = options.cacheDir || tmpdir()
  const file = join(cacheDir, 'dl-vampire-cache', md5(options.url))
  return file
}
