<template>
  <div class="page-login">
    <LoginHeader>欢迎登录</LoginHeader>
    <!-- 主体部分 -->
    <section class="login-section">
      <div class="wrapper">
        <nav>
          <a @click="activeName = 'LoginForm'" :class="{ active: activeName === 'LoginForm' }"
            href="javascript:;">账户登录</a>
          <a @click="activeName = 'LoginQrcode'" :class="{ active: activeName === 'LoginQrcode' }"
            href="javascript:;">扫码登录</a>
        </nav>
        <!-- 账户登录和扫码登录的切换 -->
        <component :is="activeName"></component>
      </div>
    </section>
    <LoginFooter />
  </div>
</template>
<script>
// 引入子组件
import LoginHeader from '@/views/login/login-header'
import LoginFooter from '@/views/login/login-footer'
import LoginForm from '@/views/login/login-form'
import LoginQrcode from '@/views/login/login-qrcode'
// 引入vue组合式API、vue-router
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  name: 'Login',
  components: { LoginHeader, LoginFooter, LoginForm, LoginQrcode },
  setup () {
    // vuex和vue-router
    const store = useStore()
    const route = useRoute()
    // 存储回跳地址
    store.commit('user/SETREDIRECT', route.query.redirectUrl || '/')
    // 控制账户登录和扫码登录的切换，默认激活的是账号登录
    const activeName = ref('LoginForm')
    return { activeName }
  }
}
</script>
<style scoped lang='less'>
.login-section {
  background: url('@/assets/images/login-bg.png') no-repeat center / cover;
  height: 488px;
  position: relative;

  .wrapper {
    width: 380px;
    background: #fff;
    min-height: 400px;
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translate3d(100px, 0, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, .15);

    nav {
      height: 55px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;

      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;

        &:first-child {
          border-right: 1px solid #f5f5f5;
          text-align: left;
        }

        &.active {
          color: @xtxColor;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
