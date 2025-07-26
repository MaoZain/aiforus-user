// import './assets/main.css'
import { createApp } from 'vue' // Vue 3 的入口
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // 路由
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import '@/styles/global.css'
// import '@/styles/index.less'
// import {useAuthStore} from './store/auth' // Vuex 状态管理

const pinia = createPinia()

// 创建 Vue 应用实例
const app = createApp(App)
app.use(pinia)
// 挂载插件
app.use(router) // 挂载路由
app.use(Antd) // 挂载 Ant Design Vue
app.use(pinia) // 挂载状态管理

// 挂载应用
app.mount('#app')
