import router from '../router' // 引入路由
import store from '../store' // 引入vuex
import { ElMessage } from 'element-plus' // 引入element-plus提示组件
import NProgress from 'nprogress' // 过渡动画
import 'nprogress/nprogress.css' // 过度动画样式
import { getToken } from '@/utils/auth' // 从cookie中获取token
import getPageTitle from '@/utils/get-page-title' // 获取网页标签名称

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 没有重定向白名单

router.beforeEach(async(to, from, next) => {
  // 开启过度动画
  NProgress.start()

  // 设置网页标签名称
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
      NProgress.done() // 关闭过度动画
    } else {
      // 确定用户是否通过getInfo获得了他的权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          // 注意:角色必须是对象数组!例如:['admin']或，['developer'，'editor']
          const { roles } = await store.dispatch('user/getInfo')

          // 根据角色生成可访问的路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 动态添加可访问路由
          router.addRoutes(accessRoutes)

          // hack方法以确保addRoutes是完整的
          // 设置replace: true，这样导航就不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 删除token，进入登录页面重新登录
          await store.dispatch('user/resetToken')
          ElMessage.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done() // 关闭过度动画
        }
      }
    }
  } else {
    // 没有token

    if (whiteList.indexOf(to.path) !== -1) {
      // 在登录白名单中，直接进入
      next()
    } else {
      // 没有访问权限的其他页面被重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done() // 关闭过度动画
    }
  }
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
