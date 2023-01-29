import axios, { AxiosResponse } from 'axios'
import { Toast } from 'vant'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Qs from 'qs'

// create an axios instance
console.log('process.env.VITE_BASE_API_URL', process.env.VITE_PROXY_KEY)

const service = axios.create({
  baseURL: process.env.VITE_PROXY_KEY, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // Toast.message('加载中');
    // do something before request is sent
    const uri =
      window.location.origin + window.location.pathname + window.location.hash
    config.params
      ? (config.params.redirect_uri = uri)
      : (config.params = { redirect_uri: uri })
    const hash = Qs.parse(location.hash.substring(1).split('?')[1])
    const search = Qs.parse(location.search.substring(1))
    const code = search.code
    if (code) {
      config.params.code = code
    }
    if (navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
      config.params.source = 'vx'
    } else {
      config.params.source = 'tfsmy'
    }
    if (store.getters.token && config.headers) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    Toast.fail(error.message)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response: AxiosResponse<ResponseDataType, any>) => {
    if (response.data.code === 401) {
      if (response.data.result) {
        window.location = response.data.result
      } else {
        return response.data
      }
    }
    return response.data
  },
  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = error.response.data.msg || '参数错误'
          break
        case 401:
          error.message = '权限不足'
          break
        case 404:
          error.message = '请求错误，未找到该资源'
          break
        case 500:
          error.message = '服务器端出错'
          break
        default:
          error.message = `未知错误${error.response.status}`
      }
    } else {
      error.message = '连接到服务器失败'
    }

    // for debug
    if (process.env.NODE_ENV !== 'production') {
      console.log('err' + error)
    }

    Toast.fail(error.message)
    return Promise.reject(error)
  }
)

export default service
