// 用户模块
export default {
  // 开启匿名空间
  namespaced: true,
  // 准备state 用于存储数据
  state () {
    return {
      // 用户信息
      profile: {
        id: '',
        // 头像
        avatar: '',
        // 昵称
        nickName: '',
        // 账号
        account: '',
        // 手机号
        mobile: '',
        token: ''
      },
      // 登录后的回跳地址
      redirectUrl: '/'
    }
  },
  // 准备mutations 用于操作数据(state)
  // 你可以向 store.commit 传入额外的参数，即 mutation 的载荷（payload）
  mutations: {
    // 修改用户信息 payload就是用户信息对象
    SETUSER (state, payload) {
      state.profile = payload
    },
    // 修改回跳地址
    SETREDIRECT (state, url) {
      state.redirectUrl = url
    }
  },
  // 2 准备actions 用于响应组件中的动作
  actions () { },
  // 准备getter
  getters () { }
}
