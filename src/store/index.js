import { createStore } from 'vuex'

// vue2.0 创建vuex仓库 new Vuex.Store({})
// vue3.0 创建vuex仓库 createStore({})

// 引入持久化插件
import createPersistedState from 'vuex-persistedstate'

// 引入模块
import cart from './modules/cart'
import category from './modules/category'
import user from './modules/user'

export default createStore({
  plugins: [
    // 默认存储在loaclStorage
    createPersistedState({
      key: 'erabbit-client-pc-store',
      paths: ['user', 'cart']
    })
  ],
  modules: {
    cart,
    category,
    user
  }
})

/* export default createStore({
  // state 存状态
  state: {
  },
  // getters写计算属性的
  getters: {
  },
  // mutaions 修改方法的
  mutations: {
  },
  // actions 拿数据的
  actions: {
  },
  // modules 模块
  modules: {
  }
})
 */
