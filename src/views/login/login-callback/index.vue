<template>
  <LoginHeader>联合登录</LoginHeader>
  <!-- qq绑定了 -->
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <!-- qq没有绑定 -->
  <section class="container" v-else>
    <nav class="tab">
      <a href="javascript:;" @click="hasAccount = true" :class="{active: hasAccount}">
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a href="javascript:;" @click="hasAccount = false" :class="{active: !hasAccount}">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <component class="tab-content" :unionId="unionId" :is="hasAccount===true ? 'CallbackBind' : 'CallbackPatch'"></component>
  </section>
  <LoginFooter />
</template>

<script>
// 引入子组件
import LoginHeader from '@/views/login/login-header'
import LoginFooter from '@/views/login/login-footer'
import CallbackBind from '@/views/login/callback-bind'
import CallbackPatch from '@/views/login/callback-patch'
// 引入VUE组合式API
import { ref } from 'vue'
// 引入QQ提供的API
import QC from 'qc'
// 引入api
import { userQQLogin } from '@/api/user'
// 引入vuex、vue-router
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// 引入消息提示组件
import Message from '@/components/library/Message'
export default {
  name: 'LoginCallback',
  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
  setup () {
    // 控制切换有无账号显示对应组件
    const hasAccount = ref(true)
    const store = useStore()
    const router = useRouter()
    // 首页： 默认已经注册且已经绑定
    // 通过QQ的API获取openId就是后台需要的unionId然后进行登录
    // 如果成功：登录成功
    // 如果失败：改QQ未进行绑定（有账号未绑定qq，没有账号未绑定qq
    // 显示绑定qq或完善资料 || 登录成功 默认是qq已经绑定过账号
    const isBind = ref(true)
    // 存储unionId
    const unionId = ref(null)
    // 先判断qq是否登录,确保qq已经登录
    if (QC.Login.check()) {
      // 第三方唯一标识
      QC.Login.getMe((openId) => {
        // 保存openId(即unionId)
        unionId.value = openId
        // 请求后台，做qq登录
        userQQLogin(openId).then(data => {
          // 登录成功:data.result
          // 1. 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/SETUSER', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeCart').then(() => {
            // 2. 跳转到来源页或者首页
            router.push(store.state.user.redirectUrl)
            // 3. 登录成功
            Message({ type: 'success', text: `欢迎${store.state.user.profile.nickname}` })
          })
        }).catch(e => {
          // 登录失败：没有绑定和后台绑定
          isBind.value = false
        })
      })
    }
    return { hasAccount, isBind, unionId }
  }
}
</script>

<style lang='less' scoped>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url('@/assets/images/load.gif') no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
