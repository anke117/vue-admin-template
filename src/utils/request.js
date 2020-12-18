import axios from "axios"
import { ElMessageBox, ElMessage } from "element-plus"
import md5 from "js-md5"
import store from "@/store"

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000, // 请求超时（request timeout）
  responseType: "json",
  withCredentials: true, // 当跨域请求时发送 cookie
  crossDomain: true,
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  }
})

// 请求拦截器 (request interceptor)
service.interceptors.request.use(
  config => {
    // 请求之前

    if (store.getters.token) {
      // 让每个请求携带token，['X-Token']是自定义headers key，请根据实际情况修改
      config.headers["Authorization"] = "Bearer " + store.getters.token
      // config.headers['X-Token'] = getToken()
    }
    if (config.data && config.data.body) {
      const stringBody = JSON.stringify(config.data.body)
      Object.assign(config.data, {
        id: md5(stringBody),
        sign: md5(stringBody + new Date().getTime()),
        timestamp: new Date().getTime()
      })
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

    // 200 状态码 -1 code码 返回错误信息
    if (response.status == 200 && response.data.code == "-1" ){
      ElMessage({
        message: response.data.msg || "错误",
        type: "error",
        duration: 5 * 1000
      })
      return Promise.reject(response.data.msg || "错误")
    }
    // 204 状态码 返回操作成功
    if (response.status == 204) {
      return Promise.resolve("操作成功")
    } 
    if (response.data && response.data.code == "-2") {
        // 重新登录
        ElMessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload()
          })
        })
    } else if (response.data && response.data.code == 0) {
      if (response.data.body) {
        return response.data.body
      }
      return response.data
    } if (response.data && response.data.code == "530") {
      if (response.data.body) {
        return response.data.body
      }
      return response.data
    }
  },
  error => {
    ElMessage({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
