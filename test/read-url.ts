import { readUrl } from '../src'

describe('readUrl', () => {
  it('readUrl works', async () => {
    {
      const str = await readUrl({ url: 'https://www.baidu.com', encoding: 'utf8' })
      str.should.match(/百度/)
    }

    {
      const buf = await readUrl({ url: 'https://www.baidu.com' })
      buf.should.instanceOf(Buffer)
      buf.toString().should.match(/百度/)
    }
  })
})
