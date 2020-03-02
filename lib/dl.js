const assert = require('assert')
const pretry = require('promise.retry')
const _ = require('lodash')
const Vampire = require('./vampire.js')

module.exports = async function dl(options) {
  options = _.defaultsDeep(options, {
    retry: {times: 5, timeout: false},
    skipExists: true,
    expectHashAlgorithm: 'md5',
  })
  const {
    // config
    useChromeUa,
    requestOptions,

    // download need
    url,
    file,

    // download extra
    retry,
    onprogress,

    // skip validate
    skipExists,
    expectSize,
    expectHash,
    expectHashAlgorithm,
  } = options
  assert(url, 'options.url can not be empty')
  assert(file, 'options.file can not be empty')

  const vampire = new Vampire({
    useChromeUa,
    requestOptions,
  })

  // no need
  const need = await vampire.needDownload({
    url,
    file,
    skipExists,
    expectSize,
    expectHash,
    expectHashAlgorithm,
  })
  if (!need) return {skip: true}

  // add tryDownload
  vampire.tryDownload = pretry(vampire.download, retry)
  await vampire.tryDownload({url, file, onprogress})
  return {skip: false}
}
