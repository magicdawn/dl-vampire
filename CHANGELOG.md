# CHANGELOG

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
