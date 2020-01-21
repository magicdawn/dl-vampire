import dl, {DownloadOptions, DownloadResult, DownloadProgressItem} from './'
import {expectType} from 'tsd'

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
