const {createHash} = require('crypto')
const fse = require('fs-extra')

exports.getFileHash = async function({file, alg}) {
  const exists = await fse.exists(file)
  if (!exists) return

  const hash = createHash(alg)
  return new Promise((resolve, reject) => {
    fse
      .createReadStream(file)
      .on('error', reject)
      .on('data', chunk => hash.update(chunk))
      .on('end', () => {
        const val = hash.digest('hex')
        resolve(val)
      })
  })
}
