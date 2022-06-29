# dl-vampire

> download file like a vampire

[![Build Status](https://img.shields.io/travis/magicdawn/dl-vampire.svg?style=flat-square)](https://travis-ci.org/magicdawn/dl-vampire)
[![Coverage Status](https://img.shields.io/codecov/c/github/magicdawn/dl-vampire.svg?style=flat-square)](https://codecov.io/gh/magicdawn/dl-vampire)
[![npm version](https://img.shields.io/npm/v/dl-vampire.svg?style=flat-square)](https://www.npmjs.com/package/dl-vampire)
[![npm downloads](https://img.shields.io/npm/dm/dl-vampire.svg?style=flat-square)](https://www.npmjs.com/package/dl-vampire)
[![npm license](https://img.shields.io/npm/l/dl-vampire.svg?style=flat-square)](http://magicdawn.mit-license.org)

![vampire](https://cdn.jsdelivr.net/gh/magicdawn/dl-vampire/vampire.jpeg)

## Highlight

- [x] skip mechanism, local file & content-length
- [x] retry / timeout support
- [x] stream to file, not ate memory like the [download](https://github.com/kevva/download/issues?utf8=%E2%9C%93&q=memory+) module
- [x] download progress support, via awesome [got](https://github.com/sindresorhus/got) module

## Install

```sh
$ npm i dl-vampire --save
```

## API

```js
const dl = require('dl-vampire')
const { Vamipre, readUrl } = dl
```

### `dl(options: DlOptions) => Promise<{skip: boolean}>`

| name                          | type                 | required | default value                | description                                                                                                           |
| ----------------------------- | -------------------- | -------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `options.url`                 | `String`             | `true`   |                              | the download url                                                                                                      |
| `options.file`                | `String`             | `true`   |                              | the local target file path                                                                                            |
| `options.onprogress`          | `function(progress)` |          |                              | [got `downloadProgress` event listener](https://github.com/sindresorhus/got#ondownloadprogress-progress)              |
| `options.retry`               | `Object`             |          | `{times: 5, timeout: false}` | retry options, will pass to [promise.retry](https://github.com/magicdawn/promise.retry#pretry)                        |
| `options.skipExists`          | `boolean`            |          | `true`                       | if local file already exists _AND_ file stat size match response `content-length` size, the download will be skiped   |
| `options.expectSize`          | `number`             |          |                              | validate local file `stat.size === expectSize`, if check pass the download will be skiped                             |
| `options.expectHash`          | `string`             |          |                              | validate local file `file.hash === expectHash`, using `expectHashAlgorithm` if check pass the download will be skiped |
| `options.expectHashAlgorithm` | `string`             |          | `'md5'`                      | the expect hash algorithm, default `md5`                                                                              |
| `options.useChromeUa`         | `Boolean`            |          | `true`                       | use `user-agent` of the Chrome Browser                                                                                |
| `options.useProxyEnv`         | `Boolean`            |          | `true`                       | use `proxy-agent` module, will use `http_proxy` / `https_proxy` / `all_proxy` env variable                            |
| `options.requestOptions`      | `Object`             |          |                              | custom request options, see [request options](https://github.com/request/request#requestoptions-callback)             |

- if finally the download is skiped, the return promise will resolve to `{skip: true}`
- else it will resolve to `{skip: false}`

#### `options.retry.*`

| name                    | type                   | description                                                                                                 |
| ----------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| `options.retry.times`   | `Number`               | max retry times                                                                                             |
| `options.retry.timeout` | `Number` / `false`     | `false` disables timeout check, `Number`: max wait in ms                                                    |
| `options.retry.onerror` | `function(err, index)` | when retry happens, this hook will be called, whether a normal error or a timeout error, index is `0` based |

more see https://github.com/magicdawn/promise.retry

#### `ts types`

```ts
// options for dl() / readUrl()
import type { DlOptions, ReadUrlOptions, ReadUrlOptionsWithEncoding } from 'dl-vampire'

// onpregress type, and progress arg type
import type { OnProgress, Progress } from 'dl-vampire'
```

## Changelog

[CHANGELOG.md](CHANGELOG.md)

## License

the MIT License http://magicdawn.mit-license.org
