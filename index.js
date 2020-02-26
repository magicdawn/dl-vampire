const Vampire = require('./lib/vampire.js')
const dl = require('./lib/dl.js')
const readUrl = require('./lib/read-url.js')

// dl = download
module.exports = dl

// extra exports
Object.assign(module.exports, {
  Vampire,
  readUrl,
})
