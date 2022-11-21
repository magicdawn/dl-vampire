import { readUrl } from '../src'

describe('readUrl', () => {
  it('readUrl works', async () => {
    {
      const str = await readUrl({ url: 'https://www.baidu.com', encoding: 'utf8' })
      expect(str).toMatch(/百度/)
    }

    {
      const buf = await readUrl({ url: 'https://www.baidu.com' })
      expect(buf).toBeInstanceOf(Buffer)
      expect(buf.toString()).toMatch(/百度/)
    }
  })
})
