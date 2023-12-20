import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'
import router from '@/router/index'
import * as TS from '../api/defind'
import { Cookies } from './auth'
import { ElMessageBox } from 'element-plus'
//配置axios的请求
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
const URL: string = '/'
const config = {
  // 默认地址
  baseURL: URL as string,
  // 设置超时时间
  timeout: 3000 * 10,
  // 跨域时候允许携带凭证
  withCredentials: true
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**用类名注释类的对象 */
class RequestHttp {
  // 定义成员变量并指定类型
  service: AxiosInstance
  // 设置公共的类名放置传参
  public constructor(config: AxiosRequestConfig) {
    /**实例化axios */
    this.service = axios.create(config)
    /**
     * 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到vuex本地储存当中
     */
    this.service.interceptors.request.use(
      (config) => {
        // 添加token
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        config.headers['Authorization'] = Cookies() // 请求头带上token
        return config
      },
      (error: AxiosError) => {
        // 请求报错
        Promise.reject(error)
      }
    )
    /**
     * 响应拦截器
     * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */

    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(response, 'response')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data, config, status } = response // 解构
        if (status === TS.RequestEnums.UNAUTHORIZED) {
          // 登录信息失效，应跳转到登录页面，并清空本地的token
          sessionStorage.clear()
          router.replace({ path: '/login' })
          return Promise.reject(data)
        } // 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
        return data
      },
      (error: AxiosError) => {
        const { response } = error
        let title = ''
        let message = ''

        if (error && response) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          message = response.statusText
          // 401, token失效
          if (response.status === 401) {
            router.push({
              name: 'login'
            })
          }
          switch (
            response.status // 跨域存在获取不到状态码的情况
          ) {
            case TS.RequestEnums.BADREQUEST:
              title = '错误请求'
              break
            case TS.RequestEnums.UNAUTHORIZED:
              title = '资源未授权'
              break
            case TS.RequestEnums.NOTFOUND:
              title = '未找到所请求的资源'
              break
            case TS.RequestEnums.ERROR:
              title = '内部服务器错误'
              break
            default:
              title = response.status.toString()
          }
          return ElMessageBox.alert(title, '提示', {
            confirmButtonText: 'OK',
            type: 'warning'
          })
        } else {
          // 跨域获取不到状态码或者其他状态进行的处理
          return ElMessageBox.alert('未知错误,请联系管理员', '提示', {
            confirmButtonText: 'OK',
            type: 'error'
          })
        }
      }
    )
  }

  public adUrl(url: string) {
    console.log(process.env.VUE_APP_BASE_API, 'process')
    return !process.env.VUE_APP_BASE_API
      ? url
      : process.env.VUE_APP_BASE_API + url
  }

  // 常用方法封装
  get<T>(url: string, params?: object): Promise<TS.ResultData<T>> {
    return this.service.get(this.adUrl(url), { params })
  }
  post<T>(url: string, params?: object): Promise<TS.ResultData<T>> {
    return this.service.post(this.adUrl(url), params)
  }
  put<T>(url: string, params?: object): Promise<TS.ResultData<T>> {
    return this.service.put(this.adUrl(url), params)
  }
  delete<T>(url: string, params?: object): Promise<TS.ResultData<T>> {
    return this.service.delete(this.adUrl(url), { params })
  }
}
//实例对象
const http = new RequestHttp(config)

export default http
