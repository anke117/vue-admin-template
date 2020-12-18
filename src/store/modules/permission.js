import { constantRoutes } from "@/router"
// /**
//  * 使用 meta.role 确定当前用户是否具有权限
//  * @param roles
//  * @param route
//  */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routers) {
  const formatRouters = []
  routers.forEach(router => {
    const path = router.uri
    const name = router.name
    const title = router.showName
    const component = router.uri
    const icon = router.showIcon
    let children = router.functionList
 
    if (children && children instanceof Array) {
      children = filterAsyncRoutes(children)
    }
    const formatRouter = {
      path: path,
      component(resolve) {
        if (router.parentId === '0') {
          require(['@/layout'], resolve)
        } else {
          require(['@/views' + component], resolve)
        }
      },
      name: name,
      meta: {
        title: title,
        icon: icon
      },
      children: children
    }
    formatRouters.push(formatRouter)
  })
  return formatRouters
}
const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}
const actions = {
  generateRoutes({ commit }, routers) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(routers)
      commit("SET_ROUTES", accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
