import { createRouter, createWebHashHistory } from 'vue-router'
// 引入路由组件 路由懒加载
const Layout = () => import('@/views/Layout.vue')
const Home = () => import('@/views/home')
const Category = () => import('@/views/category')
const Sub = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods')

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
      },
      {
        path: '/product/:id',
        component: Goods
      }
    ]
  }
]

// vue2.0 new VueRouter({}) 创建路由实例
// vue3.0 createRouter({}) 创建路由实例
const router = createRouter({
  // 路由模式默认hash的路由模式
  history: createWebHashHistory(),
  routes,
  // 滚动行为 每次切换路由的时候跳转到页面顶部
  scrollBehavior () {
    /*
      VUE2.0是通过x,y控制
      vue3.0是通过top，left控制
    */
    // 始终滚动到顶部
    return { top: 0 }
  }
})

export default router
