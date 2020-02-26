const assert = require('assert')
const pretry = require('promise.retry')
const _ = require('lodash')
const Vampire = require('./vampire.js')

module.exports = async function dl(options) {
  options = _.defaultsDeep(options, {
    retry: {times: 5, timeout: false},
  })
  const {url, file, retry, skipExists, useChromeUa, requestOptions, onprogress} = options
  assert(url, 'options.url can not be empty')
  assert(file, 'options.file can not be empty')

  const vampire = new Vampire({
    skipExists,
    useChromeUa,
    requestOptions,
  })

  // no need
  const need = await vampire.needDownload({url, file})
  if (!need) return {skip: true}

  // add tryDownload
  vampire.tryDownload = pretry(vampire.download, retry)
  await vampire.tryDownload({url, file, onprogress})
  return {skip: false}
}
