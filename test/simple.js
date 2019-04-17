const dl = require('..')
const {getSize, needDownload, download} = dl
const fs = require('fs-extra')
const should = require('should')

const url = 'https://www.baidu.com/img/bd_logo1.png'
const file = __dirname + '/../example-files/bd_logo1.png'
const redo = () => dl({url, file, skipExists: false})

it('download works', async function() {
  const ret = await redo()
  ret.should.eql({skip: false})
  fs.existsSync(file).should.ok()

  const ret2 = await dl({url, file, useChromeUa: false})
  ret2.should.eql({skip: true})
  fs.existsSync(file).should.ok()
})

it('getSize', async function() {
  await redo()
  const size = await getSize(url)
  const realsize = fs.statSync(file).size
  size.should.equal(realsize)
})

describe('needDownload', function() {
  it('when skipExists = false', async function() {
    const ret = await needDownload({skipExists: false})
    ret.should.ok()
  })

  it('when file not exists', async () => {
    await fs.unlink(file)
    ;(await needDownload({url, file})).should.ok()
  })

  it('it works', async function() {
    await redo()
    ;(await needDownload({url, file, skipExists: true})).should.equal(false)
  })
})

describe('download', function() {
  it('fail when timeout', async () => {
    download({url: 'bad-url', file}).should.rejectedWith({message: /bad-url/})
  })
})
