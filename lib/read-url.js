const {tmpdir} = require('os')
const {join} = require('path')
const {createHash} = require('crypto')
const fse = require('fs-extra')
const debug = require('debug')('dl-vampire:read-url')
const dl = require('./dl')

const md5 = s =>
  createHash('md5')
    .update(s, 'utf8')
    .digest('hex')

module.exports = async function readUrl(opts = {}) {
  const options = {...opts}

  // a consistent temp file
  if (!options.file && options.url) {
    options.file = join(tmpdir(), 'dl-vampire-cache', md5(options.url))
  }
  debug('using file = %s', options.file)

  await dl(options)

  let ret
  if (!options.encoding) {
    ret = await fse.readFile(options.file)
  } else {
    ret = await fse.readFile(options.file, options.encoding)
  }

  return ret
}
