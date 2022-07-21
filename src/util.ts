import { createHash } from 'crypto'
import fse from 'fs-extra'
import { HTTPError } from 'got'
import { RetryError } from 'promise.retry'

export async function getFileHash({
  file,
  alg,
}: {
  file: string
  alg: string
}): Promise<string | undefined> {
  const exists = await fse.pathExists(file)
  if (!exists) return

  const hash = createHash(alg)
  return new Promise((resolve, reject) => {
    fse
      .createReadStream(file)
      .on('error', reject)
      .on('data', (chunk) => hash.update(chunk))
      .on('end', () => {
        const val = hash.digest('hex')
        resolve(val)
      })
  })
}

export const md5 = (s: string) => createHash('md5').update(s, 'utf8').digest('hex')

export const isGot404Error = (e?: Error) => e instanceof HTTPError && e.response.statusCode === 404

/**
 * test given e is a got.{@link HTTPError} with statusCode = 404
 * or e is a pretry.{@link RetryError} with all member of e.errors is a got.{@link HTTPError}
 */
export const is404Error = (e?: Error) =>
  isGot404Error(e) ||
  (e instanceof RetryError && e.errors.every((childError) => isGot404Error(childError)))
