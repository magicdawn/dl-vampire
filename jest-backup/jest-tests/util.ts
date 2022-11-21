import { getFileHash } from '../src/util'

describe('util', () => {
  it('getFileHash', async () => {
    const hash = await getFileHash({ file: __dirname + '/../vampire.jpeg', alg: 'md5' })
    expect(hash!).toEqual('d2718c4c2557162bfe2fda1605caa596')
  })
})
