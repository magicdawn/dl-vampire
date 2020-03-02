const should = require('should')
const fse = require('fs-extra')
const dl = require('../lib/dl')
const Vampire = require('../lib/vampire')
const {getFileHash} = require('../lib/util')

const url = 'https://www.baidu.com/img/bd_logo1.png'
const file = __dirname + '/../example-files/bd_logo1.png'
const redo = () => dl({url, file, skipExists: false})

describe('Vampire', function() {
  it('getSize', async function() {
    await redo()
    const vampire = new Vampire()
    const size = await vampire.getSize(url)
    const realsize = fse.statSync(file).size
    size.should.equal(realsize)
  })

  describe('needDownload', function() {
    it('when skipExists = false', async function() {
      const vampire = new Vampire()
      return vampire.needDownload({url, file, skipExists: false}).should.resolvedWith(true)
    })

    it('when file not exists', async () => {
      await fse.remove(file)
      const vampire = new Vampire()
      return vampire.needDownload({url, file}).should.resolvedWith(true)
    })

    it('when expectSize provided', async () => {
      await redo()
      const size = (await fse.stat(file)).size

      const vampire = new Vampire()
      await vampire.needDownload({url, file, expectSize: size}).should.resolvedWith(false)
      await vampire.needDownload({url, file, expectSize: size + 1}).should.resolvedWith(true)
      await vampire.needDownload({url, file, expectSize: size - 1}).should.resolvedWith(true)
    })

    it('when expectHash provided', async () => {
      await redo()
      const vampire = new Vampire()

      const sha1 = await getFileHash({file, alg: 'sha1'})
      const md5 = await getFileHash({file, alg: 'md5'})

      // correct
      await vampire
        .needDownload({url, file, expectHash: md5, expectHashAlgorithm: 'md5'})
        .should.resolvedWith(false)
      await vampire
        .needDownload({url, file, expectHash: sha1, expectHashAlgorithm: 'sha1'})
        .should.resolvedWith(false)

      // incorrect
      await vampire
        .needDownload({url, file, expectHash: md5 + '1', expectHashAlgorithm: 'md5'})
        .should.resolvedWith(true)
      await vampire
        .needDownload({url, file, expectHash: sha1 + '2', expectHashAlgorithm: 'sha1'})
        .should.resolvedWith(true)
    })

    it('it works', async function() {
      await redo()
      const vampire = new Vampire()
      const need = await vampire.needDownload({url, file})
      need.should.equal(false)
    })

    it('bad url', async () => {
      // download first
      await redo()

      // head content-length logic
      const vampire = new Vampire()
      return vampire.needDownload({url: 'bad-url', file}).should.rejectedWith({
        message: /getaddrinfo ENOTFOUND bad-url/,
      })
    })
  })
})
