// 分类模块
// 引入api
import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
  // 开启匿名空间
  namespaced: true,
  state () {
    return {
      // 分类信息集合
      // 依赖topCategory重新设置,保证初始化就有数据,不至于白屏
      list: topCategory.map(item => ({ name: item }))
    }
  },
  actions: {
    // 获取后台的分类信息
    async getCategoryList ({ commit }) {
      // 获取分类数据
      const data = await findAllCategory()
      data.result.forEach(top => {
        top.open = false
      })
      // 修改分类数据
      commit('GETCATEGORYLIST', data.result)
    }
  },
  mutations: {
    // 获取后台的分类信息
    GETCATEGORYLIST (state, getCategoryList) {
      state.list = getCategoryList
    },
    // 定义show和hide函数，控制当前分类的二级分类显示和隐藏
    show (state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = true
    },
    hide (state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = false
    }
  }
}
