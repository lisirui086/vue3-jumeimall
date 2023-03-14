import { createRouter, createWebHashHistory } from 'vue-router'
// 引入路由组件 路由懒加载
import Layout from '@/views/Layout.vue'
import Home from '@/views/home'
import Category from '@/views/category'
import Sub from '@/views/category/sub'

// 路由规则
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Home
      },
      {
        path: '/category/:id',
        component: Category
      },
      {
        path: '/category/sub/:id',
        component: Sub
      }
    ]
  }
]

// vue2.0 new VueRouter({}) 创建路由实例
// vue3.0 createRouter({}) 创建路由实例
const router = createRouter({
  // 路由模式默认hash的路由模式
  history: createWebHashHistory(),
  routes
})

export default router
