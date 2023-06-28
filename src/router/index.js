import { createRouter, createWebHashHistory } from 'vue-router'
import { h } from 'vue'
import store from '@/store'
// 引入路由组件 路由懒加载
const Layout = () => import('@/views/Layout.vue')
const Home = () => import('@/views/home')
const Category = () => import('@/views/category')
const Sub = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods')
const Login = () => import('@/views/login')
const LoginCallback = () => import('@/views/login/login-callback')
const Cart = () => import('@/views/cart')
const PayCheckout = () => import('@/views/member/pay/checkout.vue')
const Pay = () => import('@/views/member/pay')
const PayResult = () => import('@/views/member/pay/checkout-result')
const MemberLayout = () => import('@/views/member/Layout')
const MemberHome = () => import('@/views/member/home')
const MemberOrder = () => import('@/views/member/order')
const MemberOrderDetail = () => import('@/views/member/order/detail')

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
      },
      {
        path: '/cart',
        component: Cart
      },
      {
        path: '/member/checkout',
        component: PayCheckout
      },
      {
        path: '/member/pay',
        component: Pay
      },
      {
        path: '/pay/callback',
        component: PayResult
      },
      {
        path: '/member',
        component: MemberLayout,
        children: [
          {
            path: '/member',
            component: MemberHome
          },
          {
            path: '/member/order',
            component: { render: () => h(<RouterView />) },
            children: [
              {
                path: '',
                component: MemberOrder
              },
              {
                path: ':id',
                component: MemberOrderDetail
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/login/callback',
    component: LoginCallback
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
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 判断用户是否登录
  const { token } = store.state.user.profile
  if (!token && to.path.startsWith('/member')) {
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  next()
})

export default router
