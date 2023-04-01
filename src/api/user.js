// 用户相关的接口文档
// 引入二次封装的axios文件
import request from '@/utils/request'
// 账号密码登录
export const userAccountLogin = ({ account, password }) => request('/login', 'post', { account, password })
// 获取短信登录验证码
export const userMobileLoginMsg = (mobile) => request('/login/code', 'get', { mobile })
// 手机号登录
export const userMobileLogin = ({ mobile, code }) => request('/login/code', 'post', { mobile, code })
// QQ登录
export const userQQLogin = (unionId, source = 1) => request('/login/social', 'post', { unionId, source })
// 获取QQ绑定时短信验证码
export const userQQBindCode = (mobile) => request('/login/social/code', 'get', { mobile })
// qq登录立即绑定
export const userQQBindLogin = ({ unionId, mobile, code }) => request('/login/social/bind', 'post', { unionId, mobile, code })
// 校验用户名是否已存在
export const userAccountCheck = (account) => request('/register/check', 'get', { account })
// 完善信息发送验证码
export const userQQPatchCode = (mobile) => request('/register/code', 'get', { mobile })
// QQ登录-绑定账号
export const userQQPatchLogin = ({ unionId, mobile, code, account, password }) => request(`/login/social/${unionId}/complement`, 'post', { unionId, mobile, code, account, password })
