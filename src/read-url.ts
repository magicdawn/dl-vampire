import assert from 'assert'
import d from 'debug'
import fse from 'fs-extra'
import { tmpdir } from 'os'
import { join } from 'path'
import { dl, DlOptions } from './dl'
import { md5 } from './util'
const debug = d('dl-vampire:read-url')

export type ReadUrlOptions = Omit<DlOptions, 'file'> & {
  // file is optional in readUrl()
  file?: string
}

export async function readUrl(opts: ReadUrlOptions): Promise<Buffer>
export async function readUrl(opts: ReadUrlOptions & { encoding: string }): Promise<string>
export async function readUrl(
  opts: ReadUrlOptions | (ReadUrlOptions & { encoding: string })
): Promise<string | Buffer> {
  const options = { ...opts }
  assert(options.url, 'options.url is required')

  // a consistent temp file
  options.file = options.file || join(tmpdir(), 'dl-vampire-cache', md5(options.url))
  debug('using file = %s', options.file)

  await dl(options as DlOptions)

  if ('encoding' in options && options.encoding) {
    return fse.readFile(options.file, options.encoding)
  } else {
    return fse.readFile(options.file)
  }
}
