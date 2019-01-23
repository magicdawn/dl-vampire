const dl = require('..')
const {getSize, needDownload, download} = dl
const fs = require('fs-extra')

const url = 'https://www.baidu.com/img/bd_logo1.png'
const file = __dirname + '/../example-files/bd_logo1.png'
const redo = () => dl({url, file, skipExists: false})

it('download works', async function() {
  const ret = await redo()
  expect(ret).toEqual({skip: false})
  expect(fs.existsSync(file)).toBe(true)

  const ret2 = await dl({url, file, useChromeUa: false})
  expect(ret2).toEqual({skip: true})
  expect(fs.existsSync(file)).toBe(true)
})

it('getSize', async function() {
  await redo()
  const size = await getSize(url)
  const realsize = fs.statSync(file).size
  expect(size).toBe(realsize)
})

describe('needDownload', function() {
  it('when skipExists = false', async function() {
    expect(await needDownload({skipExists: false})).toBe(true)
  })

  it('when file not exists', async () => {
    await fs.unlink(file)
    expect(await needDownload({url, file})).toBe(true)
  })

  it('it works', async function() {
    await redo()
    expect(await needDownload({url, file, skipExists: true})).toBe(false)
  })
})

describe('download', function() {
  it('fail when timeout', async () => {
    return expect(download({url: 'bad-url', file})).rejects.toThrow('bad-url')
  })
})
