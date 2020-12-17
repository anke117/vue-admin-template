import axios from 'axios'
import { ElMessageBox, ElMessage } from 'element-plus'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // 当跨域请求时发送 cookie
  timeout: 5000 // 请求超时（request timeout）
})

// 请求拦截器 (request interceptor)
service.interceptors.request.use(
  config => {
    // 请求之前

    if (store.getters.token) {
      // 让每个请求携带token，['X-Token']是自定义headers key，请根据实际情况修改
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // 请求报错 
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器 (response interceptor)
service.interceptors.response.use(
  // 如果您想获得http信息，如头或状态，请 return  response => response

  // 通过自定义状态码确定请求状态，这里只是一个例子，你也可以通过HTTP状态码判断状态
  response => {
    const res = response.data

    // 如果自定义状态码不是20000，则判断为错误。
    if (res.code !== 20000) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: 非法token; 50012: 已登录其他客户; 50014: token过期;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // 重新登录
        ElMessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
