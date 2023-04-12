import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 重置样式的库
import 'normalize.css'
// 子弟项目的重置样式和工用样式
import '@/assets/styles/common.less'
// 引入自定义UI
import UI from '@/components/library'
// 引入mock
import '@/mock'

createApp(App).use(store).use(router).use(UI).mount('#app')
