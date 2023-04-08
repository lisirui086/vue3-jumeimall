// 引入二次封装axios
import request from '@/utils/request'

// 生成订单(即填写订单或结算页)
export const createdOrder = () => request('/member/order/pre', 'get')
// 添加收货地址
export const addAddress = (form) => request('/member/address', 'POST', form)
