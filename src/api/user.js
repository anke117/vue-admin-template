import request from '@/utils/request'

// 获取登录信息
export function login(data) {
  return request({
    url: '/users/action/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

// 获取用户相关的菜单权限
export function getPermissionList() {
  return request({
    url: '/users/functions/V2',
    method: 'get'
  })
}

// 登出
export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
