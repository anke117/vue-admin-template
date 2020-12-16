import { createApp } from 'vue'
import App from './App.vue'
import installElementPlus from './plugins/element.js'
import store from './store'
import router from './router'
import '@/assets/styles/index.scss' // 全局样式
import '@/configs/permission' // 路由层面权限的控制代码
const app = createApp(App).use(router).use(store)
installElementPlus(app)
app.mount('#app')