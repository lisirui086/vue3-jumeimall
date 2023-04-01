// 购物车模块
export default {
  // 开启匿名空间
  namespaced: true,
  state () {
    return {
      // 购物车商品列表
      list: []
    }
  },
  mutations: {
    // 加入购物车
    INSERTCART (state, payload) {
      // 约定加入购物车字段必须和后端保持一致 payload字段
      // 他们是：id, skuId, name, attrsText, picture, price, nowPrice, selected, stock, count, isEffective
      // 插入数据规则：
      // 1. 先找下是否有相同商品
      // 2. 如果有相同的商品，查询它的数量，累加到payload上，再保存最新位置，原来的商品需要删除
      // 3. 如果没有相同商品，保存在最新位置即可
      // 找有相同的商品
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex > -1) {
        // 如果有数量累加
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原来的
        state.list.splice(sameIndex, 1)
      }
      // z追加新的
      state.list.unshift(payload)
    }
  },
  actions: {
    // 加入购物车
    insertCart ({ rootState, commit }, payload) {
      return new Promise((resolve, reject) => {
        if (rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          commit('INSERTCART', payload)
          resolve()
        }
      })
    }
  },
  // vuex计算属性
  getters: {
    // 有效商品列表
    validList (state) {
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效商品件数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
    }
  }
}
