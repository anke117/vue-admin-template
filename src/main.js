import { createApp } from 'vue'
import App from './App.vue'
import installElementPlus from './plugins/element.js'
import installSvg from '@/assets/icons/index.js'
import store from './store'
import router from './router'
import '@/assets/styles/index.scss' // 全局样式
import '@/assets/icons' // svg图标
import '@/configs/permission' // 路由层面权限的控制代码
const app = createApp(App).use(router).use(store)
installElementPlus(app)
installSvg(app)
app.mount('#app')