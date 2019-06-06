const fs = require('fs-extra')
const should = require('should')
const dl = require('..')
const {Vampire} = dl

const url = 'https://www.baidu.com/img/bd_logo1.png'
const file = __dirname + '/../example-files/bd_logo1.png'
const redo = () => dl({url, file, skipExists: false})

// const log = require('why-is-node-running')
// setTimeout(function() {
//   // console.log(process._getActiveRequests())
//   // console.log(process._getActiveHandles())
//   log()
// }, 3000)

describe('Vampire', function() {
  it('getSize', async function() {
    await redo()
    const vampire = new Vampire()
    const size = await vampire.getSize(url)
    const realsize = fs.statSync(file).size
    size.should.equal(realsize)
  })

  describe('needDownload', function() {
    it('when skipExists = false', async function() {
      const vampire = new Vampire({skipExists: false})
      const need = await vampire.needDownload({url, file})
      need.should.equal(true)
    })

    it('when file not exists', async () => {
      await fs.unlink(file)
      const vampire = new Vampire()
      const need = await vampire.needDownload({url, file})
      need.should.equal(true)
    })

    it('it works', async function() {
      await redo()
      const vampire = new Vampire()
      const need = await vampire.needDownload({url, file})
      need.should.equal(false)
    })
  })
})
