// 给vee-validate提供校验规则函数
export default {
  // 用户名
  account (value) {
    if (!value) return '请输入用户名'
    // 规则：字母开头6-20字符之间
    // /^/开头的意思  \w字符的意思
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    return true
  },
  // 密码
  password (value) {
    if (!value) return '请输入密码'
    // 规则：密码是8-20个字符 包含至少一个大写字母 包含所有英文符号（不包括空格）。
    if (/\s/.test(value)) return '密码不允许有空格'
    // if (!/^(?=.*[A-Z])(?!.*\s).{8,20}$/.test(value)) return '密码8-20个字符且必须有大写字母'
    if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
    return true
  },
  // 手机号码
  mobile (value) {
    // 规则：不允许有空格
    if (/\s/.test(value)) return '密码不允许有空格'
    // 规格： 1开头，11个字符
    if (!/^1[3-9]\d{9}$/.test(value)) return '输入的手机号码格式不对'
    return true
  },
  // 验证码
  code (value) {
    if (!value) return '请输入验证码'
    // 规则：６个字符
    if (/^d{6}$/.test(value)) return '请输入6位数的验证码'
    return true
  },
  // 用户协议
  isAgree (value) {
    if (!value) return '请勾选登录协议'
    return true
  }
}
