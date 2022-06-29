import fs from 'fs-extra'
import _ from 'lodash'
import dl, { Progress } from '../src'

const url = 'https://www.baidu.com/img/bd_logo1.png'
const file = __dirname + '/../example-files/bd_logo1.png'

describe('download', function () {
  it('download works', async function () {
    const ret = await dl({
      url,
      file,
      skipExists: false,
      retry: {
        times: 1,
        onerror(err) {
          console.error(err)
        },
      },
    })
    ret.should.eql({ skip: false })
    fs.existsSync(file).should.ok()

    const ret2 = await dl({ url, file })
    ret2.should.eql({ skip: true })
    fs.existsSync(file).should.ok()
  })

  it('progress works', async function () {
    const ps: Progress[] = []

    // download
    const ret = await dl({
      url,
      file,
      skipExists: false,
      onprogress(p) {
        ps.push(p)
      },
    })
    ret.should.eql({ skip: false })
    fs.existsSync(file).should.ok()

    // ps
    ps.length.should.above(0)
    _.last(ps)!.percent.should.equal(1)
  })
})
