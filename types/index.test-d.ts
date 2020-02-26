import dl, {DownloadOptions, DownloadResult, DownloadProgressItem, Vampire, readUrl} from './'
import {expectType} from 'tsd'
import pretry from 'promise.retry'

{
  const options: DownloadOptions = {
    url: '',
    file: '',
  }
}

{
  const options: DownloadOptions = {
    url: '',
    file: '',
    skipExists: false,
    onprogress(p) {
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
const v = new Vampire({skipExists: true, useChromeUa: true, requestOptions: {}})

// #needDownload
expectType<Promise<boolean>>(v.needDownload({url: '', file: ''}))

// # download
expectType<Promise<void>>(v.download({url: '', file: '', onprogress(p) {}}))

// #tryDownload
const tryDownload = pretry(v.download, {times: 10, timeout: 1000, onerror(err, i) {}})
expectType<Promise<void>>(tryDownload({url: '', file: ''}))

// readUrl
expectType<Promise<Buffer>>(readUrl({url: ''}))
expectType<Promise<string>>(readUrl({url: '', encoding: 'utf8'}))
