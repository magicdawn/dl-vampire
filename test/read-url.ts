import { stat, statSync } from 'fs-extra'
import path from 'path'
import { readUrl } from '../src'
import { getReadUrlCacheFile } from '../src/read-url'
import { md5 } from '../src/util'

const BAIDU_URL = 'https://www.baidu.com'
const cacheDir = __dirname + '/read-url-cache'

describe('readUrl', () => {
  it('getReadUrlCacheFile works', () => {
    const file = getReadUrlCacheFile({ url: BAIDU_URL, cacheDir })
    file.should.equal(
      path.join(__dirname, './read-url-cache/dl-vampire-cache/f9751de431104b125f48dd79cc55822a')
    )
  })

  it('readUrl => string', async () => {
    const str = await readUrl({ url: BAIDU_URL, encoding: 'utf8' })
    str.should.match(/百度/)
  })

  it('readUrl => Buffer', async () => {
    const buf = await readUrl({ url: BAIDU_URL })
    buf.should.instanceOf(Buffer)
    buf.toString().should.match(/百度/)
  })

  it('options.cacheDir & optios.maxAge works', async () => {
    // cacheDir
    const str = await readUrl({
      url: BAIDU_URL,
      encoding: 'utf8',
      cacheDir: __dirname + '/read-url-cache',
    })
    str.should.match(/百度/)

    // maxAge
    {
      const test = async (maxAge: string | number) => {
        // mtime before readUrl
        const file = getReadUrlCacheFile({ url: BAIDU_URL, cacheDir })
        const fileMtime = (await stat(file)).mtimeMs

        // readUrl
        const str = await readUrl({
          url: 'https://www.baidu.com',
          encoding: 'utf8',
          cacheDir: __dirname + '/read-url-cache',
          maxAge,
        })
        str.should.match(/百度/)

        // mtime after readUrl
        const fileNewMtime = (await stat(file)).mtimeMs
        fileNewMtime.should.eql(fileMtime)
      }

      await test(1000 * 60 * 60)
      await test('1h')
    }
  })
})
