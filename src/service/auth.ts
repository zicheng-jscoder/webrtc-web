import { AxiosResponse } from 'axios'
import request from './request'

export const auth = (): Promise<AxiosResponse<any, any>> =>
  request.get('/oauth2/auth')

// export function wxConfig() {
//   return request({
//     baseURL: 'https://cdpre.tfsmy.com',
//     url: '/wx-auth-api/wx/mp/jsapi/wxc59f78e75ed43f09/getJsapiTicket',
//     params: '',
//     method: 'get',
//   })
// }0.21
