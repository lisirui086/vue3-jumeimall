<template>
  <Form ref="formCom" class="xtx-form" autocomplete="off" :validation-schema="schema" v-slot="{ errors }">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field class="input" type="text" name="account" placeholder="请输入用户名" v-model="form.account"/>
      </div>
      <div class="error" v-if="errors.account">{{ errors.account }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field class="input" type="text" placeholder="请输入手机号" name="mobile" v-model="form.mobile" />
      </div>
      <div class="error" v-if="errors.mobile">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field class="input" type="text" placeholder="请输入验证码" name="code" v-model="form.code" />
        <span class="code" @click="sendCode">{{timer === 0 ? '发送验证码' : `等${timer}秒后`}}</span>
      </div>
      <div class="error" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field class="input" type="password" placeholder="请输入密码" name="password" v-model="form.password" />
      </div>
      <div class="error" v-if="errors.password">{{ errors.password }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field class="input" type="password" name="rePassword" placeholder="请确认密码" v-model="form.rePasswrod" />
      </div>
      <div class="error" v-if="errors.rePassword">{{ errors.rePassword }}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即提交</a>
  </Form>
</template>

<script>
// 引入校验规则
import schema from '@/utils/vee-validate-schema'
// 引入vee-validate
import { Form, Field } from 'vee-validate'
// 引入vue组合式API
import { reactive, ref, onUnmounted } from 'vue'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import Message from '@/components/library/Message'
import { useIntervalFn } from '@vueuse/core'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
export default {
  name: 'CallbackPatch',
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  components: { Form, Field },
  setup (props) {
    // 校验表单
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    }
    // 收集表单输入数据
    const form = reactive({
      account: '',
      mobile: '14785236987',
      code: '123456',
      password: '123456',
      rePasswrod: '123456'
    })
    // vuex vue-router
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    // 发送验证码的时候定时器
    const timer = ref(0)
    const formCom = ref(null)
    const { pause, resume } = useIntervalFn(() => {
      timer.value--
      if (timer.value <= 0) pause()
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })
    // 发短信
    const sendCode = async () => {
      // 手机号码校验全部通过
      const vaild = mySchema.mobile(form.mobile)
      if (vaild === true) {
        if (timer.value === 0) {
          timer.value = 60
          // 发请求获取验证码
          await userQQPatchCode(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          resume()
        }
      } else {
        // 失败。使用vee的错误函数显示错误显示
        formCom.value.setFieldError('mobile', vaild)
        Message({ type: 'error', text: '失败' })
      }
    }
    // 立即提交
    const submit = async () => {
      // 校验表单是否全部通过
      const vaild = await formCom.value.validate()
      console.dir(vaild)
      // 全部通过
      if (vaild === true) {
        await userQQPatchLogin({ unionId: props.unionId, ...form }).then(data => {
          // 存储用户信息
          const { id, avatar, nickName, account, mobile, token } = data.result
          // 将参数存储到vuex中
          store.commit('user/SETUSER', { id, avatar, nickName, account, mobile, token })
          store.dispatch('cart/mergeCart').then(() => {
            // 进行跳转 跳转到上一页或者首页
            router.push(route.query.redirectUrl || '/')
            // 消息提示
            Message({ type: 'success', text: '绑定成功' })
          })
        }).catch(e => {
          if (e.response.data) {
            // 消息提示
            Message({ type: 'error', text: e.response.data.msg || '绑定失败' })
          }
        })
      }
    }
    return { schema: mySchema, form, sendCode, timer, formCom, submit }
  }
}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
