require('should')
const {getFileHash} = require('../lib/util')

describe('util', () => {
  it('getFileHash', async () => {
    const hash = await getFileHash({file: __dirname + '/../vampire.jpeg', alg: 'md5'})
    hash.should.equal('d2718c4c2557162bfe2fda1605caa596')
  })
})
