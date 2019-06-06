# dl-vampire

> download file like a vampire

[![Build Status](https://img.shields.io/travis/magicdawn/dl-vampire.svg?style=flat-square)](https://travis-ci.org/magicdawn/dl-vampire)
[![Coverage Status](https://img.shields.io/codecov/c/github/magicdawn/dl-vampire.svg?style=flat-square)](https://codecov.io/gh/magicdawn/dl-vampire)
[![npm version](https://img.shields.io/npm/v/dl-vampire.svg?style=flat-square)](https://www.npmjs.com/package/dl-vampire)
[![npm downloads](https://img.shields.io/npm/dm/dl-vampire.svg?style=flat-square)](https://www.npmjs.com/package/dl-vampire)
[![npm license](https://img.shields.io/npm/l/dl-vampire.svg?style=flat-square)](http://magicdawn.mit-license.org)

![vampire](https://cdn.jsdelivr.net/gh/magicdawn/dl-vampire/vampire.jpeg)

## Install

```sh
$ npm i dl-vampire --save
```

## API

```js
const dl = require('dl-vampire')
```

### `Promise<{skip: Boolean}> dl(options)`

| name                     | type                 | required | default value                | description                                                                                                         |
| ------------------------ | -------------------- | -------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `options.url`            | `String`             | `true`   |                              | the download url                                                                                                    |
| `options.file`           | `String`             | `true`   |                              | the local target file path                                                                                          |
| `options.retry`          | `Object`             |          | `{times: 5, timeout: false}` | retry options, will pass to [promise.retry](https://github.com/magicdawn/promise.retry#pretry)                      |
| `options.skipExists`     | `Boolean`            |          | `true`                       | if local file already exists _AND_ file stat size match response `content-length` size, the download will be skiped |
| `options.useChromeUa`    | `Boolean`            |          | `true`                       | use `user-agent` of the Chrome Browser                                                                              |
| `options.requestOptions` | `Object`             |          |                              | custom request options, see [request options](https://github.com/request/request#requestoptions-callback)           |
| `options.onprogress`     | `function(progress)` |          |                              | [got `downloadProgress` event listener](https://github.com/sindresorhus/got#ondownloadprogress-progress)            |

#### `options.retry.*`

| name                    | type                   | description                                                                                                 |
| ----------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| `options.retry.times`   | `Number`               | max retry times                                                                                             |
| `options.retry.timeout` | `Number` / `false`     | `false` disables timeout check, `Number`: max wait in ms                                                    |
| `options.retry.onerror` | `function(err, index)` | when retry happens, this hook will be called, whether a normal error or a timeout error, index is `0` based |

more see https://github.com/magicdawn/promise.retry

### return type

- if finally the download is skiped, the return promise will resolve to `{skip: true}`
- else it will resolve to `{skip: false}`

## Changelog

[CHANGELOG.md](CHANGELOG.md)

## License

the MIT License http://magicdawn.mit-license.org
