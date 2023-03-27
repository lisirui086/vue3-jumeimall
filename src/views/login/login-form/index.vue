<template>
  <div class="account-box">
    <!-- 账号or短信二选一 -->
    <div class="toggle">
      <a v-if="!isMessage" href="javascript:;" @click="isMessage = true">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a v-else href="javascript:;" @click="isMessage = false">
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form ref="formCom" class="form" :validation-schema="schema" autocomplete="off" v-slot="{ errors }">
      <!-- 账号+密码登录 -->
      <template v-if="!isMessage">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field type="text" placeholder="请输入用户名" name="account" :class="{ error: errors.account }"
              v-model="form.account" />
          </div>
          <!-- 没通过检验时的提示 -->
          <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{ errors.account }}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field type="password" placeholder="请输入密码" name="password" :class="{ error: errors.password }"
              v-model="form.password" />
          </div>
          <!-- 没通过检验时的提示 -->
          <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{ errors.password }}</div>
        </div>
      </template>
      <!-- 短信登录 -->
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field type="text" placeholder="请输入手机号" name="mobile" :class="{ error: errors.mobile }" v-model="form.mobile" />
          </div>
          <!-- 没通过检验时的提示 -->
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{ errors.mobile }}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field type="password" placeholder="请输入验证码" name="code" :class="{ error: errors.code }" v-model="form.code" />
            <span class="code">发送验证码</span>
          </div>
          <!-- 没通过检验时的提示 -->
          <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{ errors.code }}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <!-- <XtxCheckbox v-model="form.isAgree" /> -->
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <!-- 没通过检验时的提示 -->
        <div class="error" v-if="errors.isAgree">
          <i class="iconfont icon-warning" />
          {{ errors.isAgree }}
        </div>
      </div>
      <a href="javascript:; " class="btn" @click="login">登录</a>
    </Form>
    <div class="action">
      <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
// 引入vue组合式API
import { ref, reactive, watch } from 'vue'
// 引入vee-validate Form是容器，Field是字段
import { Form, Field } from 'vee-validate'
// 引入封装好的校验规则函数
import schema from '@/utils/vee-validate-schema'
// 引入Message组件
import Message from '@/components/library/Message'
export default {
  name: 'LoginForm',
  components: { Form, Field },
  setup () {
    // 账号登录or短信登录 默认false 不是短信
    const isMessage = ref(false)
    // 表单数据
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })
    // vee-validate 校验基本步骤
    // 1. 导入 Form Filed组件 将form Input替换，需要加上name用来指定将来的校验规则函数的
    // 2. Filed 需要进行数据绑定， 字段名称最好和后台接口需要的一致
    // 3. 定义Filed的name属性指定的校验规则函数，Form的validation-schema接收定义好的校验规则 是个对象
    // 4. 自定义组件需要校验必须先支持v-model 然后field使用as指定为组件名称
    const mySchema = {
      // 检验函数规则： 返回return就是校验成功，返回一个字符串就是失败，字符串就是错误提示
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }
    // 获取表单的ref 用于清空校验提示
    const formCom = ref(null)
    // 侦听isMessage的变化，切换登录方式时清除输入的内容+校验提示
    watch(isMessage, () => {
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 如果没有效果Filed组件，之前的校验是不会清空的 例如：v-show切换的
      // Form组件提供了一个resetForm函数清除校验结果
      formCom.value.resetForm()
    })
    // 需要在点击登录的时候对整体表单进行校验
    const login = async () => {
      // Form组件提供了一个validate函数作为整体表单校验，当是返回的是一个promise
      const vaild = await formCom.value.validate()
      vaild ? Message({ type: 'success', text: '登录成功' }) : Message({ type: 'error', text: '用户名或密码错误' })
      console.dir(vaild)
    }
    return { isMessage, form, schema: mySchema, formCom, login }
  }
}
</script>
<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;

    a {
      color: @xtxColor;

      i {
        font-size: 14px;
      }
    }
  }

  .form {
    padding: 0 40px;

    &-item {
      margin-bottom: 28px;

      .input {
        position: relative;
        height: 36px;

        >i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }

        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;

          &.error {
            border-color: @priceColor;
          }

          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }

        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }

      >.error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;

      &.disabled {
        background: #cfcdcd;
      }
    }
  }

  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}</style>
