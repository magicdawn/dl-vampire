const dl = require('..')
const {getSize, needDownload} = dl
const fs = require('fs-extra')

const url = 'https://www.baidu.com/img/bd_logo1.png'
const file = __dirname + '/../example-files/bd_logo1.png'

it('download works', async function() {
  await dl({url, file})
  expect(fs.existsSync(file)).toBe(true)
})

it('getSize', async function() {
  await dl({url, file})
  const size = await getSize(url)
  const realsize = fs.statSync(file).size
  expect(size).toBe(realsize)
})

describe('needDownload', function() {
  it('when skipExists = false', async function() {
    expect(await needDownload({skipExists: false})).toBe(true)
  })

  it('it works', async function() {
    await dl({url, file})
    expect(await needDownload({url, file, skipExists: true})).toBe(false)
  })
})
