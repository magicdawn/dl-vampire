# CHANGELOG

## v2.1.1 2024-03-20

- use named export of `EventEmitter` to fix [#6](https://github.com/magicdawn/dl-vampire/issues/6)

## v2.1.0 2024-01-29

- add `.inspectError` method export
- report `HTTPError.statusCode` too
- fix code coverage

## v2.0.0 2023-10-17

- ESM only, and bundled with tsup, and move back to proxy-agent

## v1.4.1 2023-05-21

- cd33ea5 fix fs types
- 03ad88a chore: update deps

## v1.4.0 2022-12-12

- fix: update got & revert previous `got.retry = 0` change, since new got fix this
- fix: pretry for needDownload too

## v1.3.3 2022-12-12

- fix: disable got internal retry logic to prevent error like https://github.com/sindresorhus/got/issues/1489#issuecomment-1318617918

## v1.3.2 2022-12-12

- fix: `module.exports.dl` usage

## v1.3.1 2022-07-29

- fix `useProxyEnv` option not working

## v1.3.0 2022-07-29

- use hpagent instead of proxy-agent. for a `ECONNRESET` bug caused by proxy-agent. and I can't dig into this, so replace this.

## v1.2.3 2022-07-21

- remove vampire.jpeg from publish

## v1.2.2 2022-07-21

- typescript comment improvement
- inspectError improvement

## v1.2.1 2022-07-21

- fix: `export TimeoutError = promise.retry.TimeoutError` & `export RequestTimeoutError = got.TimeoutError`

## v1.2.0 2022-07-21

- feat: readUrl, add `options.cacheDir` & `options.maxAge` support

## v1.1.0 2022-07-20

- use promise.retry v1.0.0, use AbortSignal for clean up
- export `pretry.RetryError`

## v1.0.1 2022-07-20

- remove file when 404 error
- add `dl({ inspectError: true })` option to print `url` & `file` before throw `RetryError`
- export util `is404Error`, got `RequestError` / `HTTPError` etc

## v1.0.0 2022-06-29

- upgrade got v11
- move to TypeScript
- add proxy-agent support

## v0.5.0 2020-08-08

- revert got to v9.x for its bad proxy support, and create a `new-got` branch.

## v0.4.0 2020-04-27

- update `got` to latest v11.x, use `stream.pipeline` insteadof `stream.pipe`

## v0.3.0 2020-03-02

- add `expectSize` / `expectHash` / `expectHashAlgorithm` to `dl` options
- refactor Vampire, move `skipExists` & new add validate options to `Vampire#needDownload`

Since AWS request has signatures, so HEAD request that url would fail
So U should provide the `expectSize` to avoid the HEAD request

## v0.2.1 2020-02-26

- add API doc to readme.md

## v0.2.0 2020-02-26

- add `readUrl`
- add `readUrl` & `Vampire` to types/index.d.ts

## v0.1.0 2020-01-21

- add types/index.d.ts

## v0.0.4 2019-06-17

- remove unused dep `log-symbols`

## v0.0.3 2019-06-06

- use `got` instead of `request` / `request-promise`, for `downloadProgress` event

## v0.0.2 2019-04-17

- use mocha, fix error caused by `request` / `request-promise`

## v0.0.1 2019-01-23

- first release
