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
    expect(ret).toEqual({ skip: false })
    expect(fs.existsSync(file)).toBeTruthy()

    const ret2 = await dl({ url, file })
    expect(ret2).toEqual({ skip: true })
    expect(fs.existsSync(file)).toBeTruthy()
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
    expect(ret).toEqual({ skip: false })
    expect(fs.existsSync(file)).toBeTruthy()

    // ps
    expect(ps.length).toBeGreaterThan(0)
    expect(_.last(ps)!.percent).toEqual(1)
  })
})
