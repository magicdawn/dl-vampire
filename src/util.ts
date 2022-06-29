import { createHash } from 'crypto'
import fse from 'fs-extra'

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
