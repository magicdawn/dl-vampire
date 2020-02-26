const {readUrl} = require('..')

describe('readUrl', () => {
  it('readUrl works', async () => {
    let content
    content = await readUrl({url: 'https://www.baidu.com', encoding: 'utf8'})
    content.should.match(/百度/)
  })
})
