import dl, {DlOptions, DownloadResult, DownloadProgressItem, Vampire, readUrl} from './'
import {expectType} from 'tsd'
import pretry from 'promise.retry'

{
  const options: DlOptions = {
    url: '',
    file: '',
  }
}

{
  const options: DlOptions = {
    url: '',
    file: '',
    skipExists: false,
    onprogress(p: DownloadProgressItem) {
      console.log(p.percent)
    },
    retry: {
      times: 10,
      onerror(err, index) {},
      timeout: 1000,
    },
  }
}

expectType<Promise<DownloadResult>>(dl({url: '', file: ''}))

// Vampire#new
const v = new Vampire({useChromeUa: true, requestOptions: {}})

// #needDownload
expectType<Promise<boolean>>(v.needDownload({url: '', file: ''}))
expectType<Promise<boolean>>(v.needDownload({url: '', file: '', skipExists: false}))
expectType<Promise<boolean>>(v.needDownload({url: '', file: '', skipExists: true, expectSize: 10}))
expectType<Promise<boolean>>(
  v.needDownload({url: '', file: '', skipExists: true, expectHash: '1234'})
)
expectType<Promise<boolean>>(
  v.needDownload({
    url: '',
    file: '',
    skipExists: true,
    expectHash: '1234',
    expectHashAlgorithm: 'sha1',
  })
)

// # download
expectType<Promise<void>>(v.download({url: '', file: '', onprogress(p) {}}))

// #tryDownload
const tryDownload = pretry(v.download, {times: 10, timeout: 1000, onerror(err, i) {}})
expectType<Promise<void>>(tryDownload({url: '', file: ''}))

// readUrl
expectType<Promise<Buffer>>(readUrl({url: ''}))
expectType<Promise<string>>(readUrl({url: '', encoding: 'utf8'}))
expectType<Promise<Buffer>>(readUrl({url: '', expectSize: 10}))
expectType<Promise<Buffer>>(readUrl({url: '', expectHash: 'the-hash'}))
