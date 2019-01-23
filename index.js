const assert = require('assert')
const pretry = require('promise.retry')
const {needDownload, download} = require('./lib/index.js')
const {CHROME_UA} = require('./lib/constants.js')

module.exports = async function vampire({
  url,
  file,
  retry = {times: 5, timeout: false},
  skipExists = true,
  useChromeUa = true,
  requestOptions = {},
}) {
  assert(url, 'options.url can not be empty')
  assert(file, 'options.file can not be empty')

  // no need
  const need = needDownload({url, file, skipExists})
  if (!need) return {skip: true}

  // use chrome user agent
  if (useChromeUa) {
    Object.assign(requestOptions, {
      headers: {
        'user-agent': CHROME_UA,
      },
    })
  }

  // const retry
  const tryDownload = pretry(download, retry)
  await tryDownload({url, file, requestOptions})
  return {skip: false}
}
