import { dl } from './dl'
import { Vampire } from './vampire'
import { readUrl } from './read-url'

// types
export type { DlOptions } from './dl'
export type { ReadUrlOptions, ReadUrlOptionsWithEncoding } from './read-url'
export type {
  VampireNewOptions,
  ValidateExistingFileOptions,
  OnProgress,
  Progress,
} from './vampire'

export { Vampire, readUrl, dl }
export default dl

// https://github.com/sindresorhus/got/blob/v11.8.3/source/index.ts#L127
module.exports = dl
Object.assign(module.exports, {
  __esModule: true,
  default: dl,
  Vampire,
  readUrl,
})
