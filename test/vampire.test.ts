import fse from 'fs-extra'
import { expect } from 'vitest'
import dl, { Vampire } from '../src'
import { getFileHash } from '../src/util'

const url = 'https://www.baidu.com/img/bd_logo1.png'
const file = `${__dirname}/../example-files/bd_logo1.vampire.png`
const redo = () => dl({ url, file, skipExists: false })

describe('Vampire', function () {
  it('getSize', async function () {
    await redo()
    const vampire = new Vampire()
    const size = await vampire.getSize(url)
    const realsize = fse.statSync(file).size
    size!.should.equal(realsize)
  })

  describe('needDownload', function () {
    it('when skipExists = false', async function () {
      const vampire = new Vampire()
      ;(await vampire.needDownload({ url, file, skipExists: false })).should.equal(true)
    })

    it('when file not exists', async () => {
      await fse.remove(file)
      const vampire = new Vampire()
      return expect(vampire.needDownload({ url, file })).resolves.toEqual(true)
    })

    it('when expectSize provided', async () => {
      await redo()
      const size = (await fse.stat(file)).size

      const vampire = new Vampire()
      ;(await vampire.needDownload({ url, file, expectSize: size })).should.equal(false)
      ;(await vampire.needDownload({ url, file, expectSize: size + 1 })).should.equal(true)
      ;(await vampire.needDownload({ url, file, expectSize: size - 1 })).should.equal(true)
    })

    it('when expectHash provided', async () => {
      await redo()
      const vampire = new Vampire()

      const sha1 = await getFileHash({ file, alg: 'sha1' })
      const md5 = await getFileHash({ file, alg: 'md5' })

      // correct
      ;(await vampire.needDownload({ url, file, expectHash: md5, expectHashAlgorithm: 'md5' })).should.equal(false)
      ;(await vampire.needDownload({ url, file, expectHash: sha1, expectHashAlgorithm: 'sha1' })).should.equal(false)

      // incorrect
      ;(await vampire.needDownload({ url, file, expectHash: `${md5}1`, expectHashAlgorithm: 'md5' })).should.equal(true)
      ;(
        await vampire.needDownload({
          url,
          file,
          expectHash: `${sha1}2`,
          expectHashAlgorithm: 'sha1',
        })
      ).should.equal(true)
    })

    it('it works', async function () {
      await redo()
      const vampire = new Vampire()
      const need = await vampire.needDownload({ url, file })
      need.should.equal(false)
    })

    it('bad url', async () => {
      // download first
      await redo()

      // head content-length logic
      const vampire = new Vampire()
      return expect(vampire.needDownload({ url: 'bad-url', file })).rejects.toMatchObject({
        code: 'ERR_INVALID_URL',
        message: /invalid url/i,
      })
    })
  })
})
