<template>
  <Form ref="formCom" :validation-schema="schema" autocomplete="off" v-slot="{ errors }" class="xtx-form">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{ nickname }}欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field class="input" :class="{ err: errors.mobile }" type="text" name="mobile" v-model="form.mobile"
          placeholder="绑定的手机号" />
      </div>
      <div class="error" v-if="errors.mobile">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field class="input" :class="{ err: errors.code }" type="text" name="code" v-model="form.code"
          placeholder="短信验证码" />
        <span class="code" @click="sendCode">{{timer === 0 ? '发送验证码' : `请等${timer}秒后`}}</span>
      </div>
      <div class="error" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即绑定</a>
  </Form>
</template>

<script>
// 引入QQAPI
import QC from 'qc'
import { reactive, toRefs, ref, onUnmounted } from 'vue'
// 引入vee-validate Form是容器，Field是字段
import { Form, Field } from 'vee-validate'
// 引入封装好的校验规则函数
import schema from '@/utils/vee-validate-schema'
// 引入vueuse的api
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    // 1. 准备信息：unionId(openId), qq头像，昵称
    const qqInfo = reactive({
      nickname: '',
      avatar: ''
    })
    if (QC.Login.check()) {
      QC.api('get_user_info').success(({ data }) => {
        qqInfo.nickname = data.nickname
        qqInfo.avatar = data.figureurl_1
      })
    }
    // 2. 完成表单验证
    // 输入框内的数据手机号验证码
    const form = reactive({
      mobile: '13241051259',
      code: ''
    })
    // 校验数据
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
    }
    // 3. 发送验证码（校验，定义api，调用，完成倒计时
    // 定义倒计时
    const formCom = ref(null)
    const timer = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      // 开始倒计时
      timer.value--
      // 时间到停止计时器
      if (timer.value <= 0) pause()
    }, 1000, false)
    // 组件卸载时停止计时器
    onUnmounted(() => {
      pause()
    })
    // 触发sendCode 函数
    const sendCode = async () => {
      // 手机号码是否通过校验
      const vaild = mySchema.mobile(form.mobile)
      if (vaild === true) {
        // 上一次定时器是否完成
        if (timer.value === 0) {
          // 发请求获取验证码
          await userQQBindCode(form.mobile)
          // 设定60s
          timer.value = 60
          // 开启计时器
          resume()
          // 提示发送验证码成功
          Message({ type: 'success', text: '发送成功' })
        }
      } else {
        // 失败，使用vee的错误提示
        formCom.value.setFieldError('mobile', vaild)
        Message({ type: 'error', text: '失败' })
      }
    }
    // 4. 进行绑定（绑定成功就是登录成功
    const submit = async () => {
      // 整体校验是否通过
      const vaild = await formCom.value.validate()
      // 全部通过
      if (vaild === true) {
        // 发请求绑定
        await userQQBindLogin({
          unionId: props.unionId,
          /* mobile: form.mobile,
          code: form.code */
          ...form
        }).then(data => {
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
          if (e.response.data) Message({ type: 'error', text: e.response.data.msg || '绑定失败' })
        })
      }
    }
    return { ...toRefs(qqInfo), form, schema: mySchema, sendCode, formCom, timer, submit }
  }
}
</script>

<style scoped lang='less'>
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;

  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }

  p {
    padding-left: 10px;
  }
}

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
}</style>
