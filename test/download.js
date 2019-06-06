const fs = require('fs-extra')
const should = require('should')
const dl = require('..')
const {Vampire} = dl

const url = 'https://www.baidu.com/img/bd_logo1.png'
const file = __dirname + '/../example-files/bd_logo1.png'
const redo = () => dl({url, file, skipExists: false})

describe('dl', function() {
  it('fail when timeout', async () => {
    // dns lookup 时间较长
    return dl({url: 'bad-url', file}).should.rejectedWith({
      message: /getaddrinfo ENOTFOUND bad-url/,
    })
  })

  it('download works', async function() {
    const ret = await redo()
    ret.should.eql({skip: false})
    fs.existsSync(file).should.ok()

    const ret2 = await dl({url, file})
    ret2.should.eql({skip: true})
    fs.existsSync(file).should.ok()
  })
})
