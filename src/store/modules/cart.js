import { getNewCartGoods } from '@/api/cart'

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
    },
    // 修改购物车商品
    UPDATECART (state, payload) {
      // goods 商品信息： nowPrice, stock, isEffective
      // goods 商品对象的字段不固定，对象中有哪些字段就改哪些字段，字段的值合理才改
      const updateGoods = state.list.find(goods => goods.skuId === payload.skuId)
      for (const key in payload) {
        // 判断字段值是否合理
        if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
          updateGoods[key] = payload[key]
        }
      }
    },
    // 删除购物车商品
    DELETECART (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
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
    },
    // 获取商品列表
    findCart ({ rootState, state, commit }) {
      return new Promise((resolve, reject) => {
        // 已登录 or 未登录
        if (rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          // 同时发送请求(有几件商品发几个请求)等所有请求成功，一并去修改本地数据
          // Promise.all(promise数组).then(dataList=>{ 一并去修改本地数据 })
          const promiseArr = state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          Promise.all(promiseArr).then(dataList => {
            // 更新本地购物车
            dataList.forEach((data, i) => {
              commit('UPDATECART', { skuId: state.list[i].skuId, ...data.result })
            })
            resolve()
          })
        }
      })
    },
    // 删除购物车商品
    deleteCart (ctx, payload) {
      // 单条删除， payload现在就是skuId
      return new Promise((resolve, reject) => {
        // 判断是否登录
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          ctx.commit('DELETECART', payload)
          resolve()
        }
      })
    },
    // 修改购物车（选中状态，数量
    updateCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          ctx.commit('UPDATECART', payload)
          resolve()
        }
      })
    },
    // 全选与取消全选
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          // 逐个根据传递过来的selected修改validList所有的selected
          ctx.getters.validList.forEach(item => {
            ctx.commit('UPDATECART', { skuId: item.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 批量删除
    batchDeleteCart (ctx, isClean) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录 isClean为true是删除无效商品 反之删除选中商品
          ctx.getters[isClean ? 'invalidList' : 'selectedList'].forEach(item => {
            ctx.commit('DELETECART', item.skuId)
          })
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
      return getters.validList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(item => item.stock <= 0 || !item.isEffective)
    },
    // 已选商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 已选商品总件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.selectedList.length === getters.validList.length && getters.selectedList.length !== 0
    }
  }
}
