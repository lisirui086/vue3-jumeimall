// 1. 创建一个axios实例
// 2. 请求拦截器，如果有token进行头部携带
// 3. 相应拦截器，1.剥离无效数据，2.处理token失效
// 4. 导出一个函数，调用当前的axios实例发起请求，返回值promise

// 引入axios
import axios from 'axios'
// 引入vuex
import store from '@/store'
// 引入router
import router from '@/router'

// 导出基准地址，原因：其他地方不是通过axios发请求的地方用上基准地址
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  // axios的一些配置，baseURL，timeout
  baseURL,
  timeout: 5000
})

// 添加请求拦截器
instance.interceptors.request.use(config => {
  // 拦截业务逻辑
  // 进行请求配置的修改
  // 如果本地有token就在头部携带
  // 1. 获取用户信息对象
  const { profile } = store.state.user
  // 2. 判断是否有token
  // console.log(profile.token)
  if (profile.token) {
    // 3. 设置token
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 添加响应拦截器
// res => res.data 取出data数据，将来调用接口的时候直接拿到的就是后台返回的数据
instance.interceptors.response.use(res => res.data, err => {
  if (err.response && err.response.status === 401) {
    // 1. 清空无效用户信息
    store.commit('user/SETUSER', {})
    // 2. 跳转到登录页面
    // 组件里面： `/user?a=10` $route.path === /user $route.fullPath === /user?a=10
    // js模块中：router.currentRoute.value.fullPath 就是当前路由地址，router.currentRoute是ref响应式的
    // encodeURIComponent转码，解决 = % $ 特殊字符被转义
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    router.push(`/login?redirectUrl=${fullPath}`)
    // 3. 跳转需要传参（当前路由地址)给登录页码
  }
  return Promise.reject(err)
})

// 请求工具函数
export default (url, method, submitData) => {
  // 负责发请求：请求地址，请求方式，提交的数据
  return instance({
    url,
    method,
    // 1. 如果是get请求，需要使用params传递submitData
    // 2. 如果不是get请求，需要使用data传递submitData
    // []设置一个动态的key，写js表达式，js表达式的执行结果当作key
    // method参数，get、Get、GET，转化成小写再来判断
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
