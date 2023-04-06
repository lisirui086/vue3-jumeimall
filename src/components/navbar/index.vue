<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li><a href="javascript:;"><i class="iconfont icon-user"></i>{{ profile.account }}</a></li>
          <li><a href="javascript:;" @click="logout">退出登录</a></li>
        </template>
        <template v-else>
          <li><router-link to="/login">请先登录</router-link></li>
          <li><a href="javascript:;">免费注册</a></li>
        </template>
        <li><a href="javascript:;">我的订单</a></li>
        <li><a href="javascript:;">会员中心</a></li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li><a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a></li>
      </ul>
    </div>
  </nav>
</template>
<script>
// 引入vuex
import { useStore } from 'vuex'
// 引入组合式API
import { computed } from 'vue'
// 引入vue-router
import { useRouter } from 'vue-router'
// 引入消息组件
import Message from '@/components/library/Message'
export default {
  name: 'AppTopnav',
  setup () {
    const store = useStore()
    // 不是响应式的
    // const { profile } = store.state.user
    // 使用computed变成响应式的
    const profile = computed(() => {
      return store.state.user.profile
    })
    const router = useRouter()
    // 退出登录
    const logout = () => {
      // 清空vuex的用户信息和本地存储的信息
      store.commit('user/SETUSER', {})
      // 清空购物车数据
      store.commit('cart/SETCART', [])
      // 跳转登录
      router.push('/login')
      Message({ type: 'success', text: '账号已退出' })
    }
    return { profile, logout }
  }
}
</script>
<style scoped lang="less">
.app-topnav {
  background: #333;

  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;

    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;

        i {
          font-size: 14px;
          margin-right: 2px;
        }

        &:hover {
          color: @xtxColor;
        }
      }

      ~li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
