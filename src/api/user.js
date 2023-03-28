// 用户相关的接口文档
// 引入二次封装的axios文件
import request from '@/utils/request'
// 账号密码登录
export const userAccountLogin = ({ account, password }) => request('/login', 'post', { account, password })
// 获取短信登录验证码
export const userMobileLoginMsg = (mobile) => request('/login/code', 'get', { mobile })
// 手机号登录
export const userMobileLogin = ({ mobile, code }) => request('/login/code', 'post', { mobile, code })
