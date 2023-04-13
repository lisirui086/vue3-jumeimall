// 引入二次封装axios
import request from '@/utils/request'

// 生成订单(即填写订单或结算页)
export const createdOrder = () => request('/member/order/pre', 'get')
// 添加收货地址
export const addAddress = (form) => request('/member/address', 'POST', form)
// 修改收货地址
export const editAddress = (form) => request(`/member/address/${form.id}`, 'put', form)
// 提交订单
export const submitOrderApi = (params) => request('/member/order', 'POST', params)
// 获取我的订单详情
export const findOrderDetail = (orderId) => request(`/member/order/${orderId}`, 'get')
// 获取订单列表
export const findOrderList = ({ page = 1, pageSize = 10, orderState = 0 }) => request('/member/order', 'get', { page, pageSize, orderState })
// 取消订单
export const cancelOrder = ({ orderId, cancelReason }) => request(`/member/order/${orderId}/cancel`, 'put', { cancelReason })
// 删除订单
export const deleteOrder = (orderId) => request('/member/order', 'delete', { ids: [orderId] })
// 确认收货
export const receiptOrder = (orderId) => request(`/member/order/${orderId}/receipt`, 'put')
// 查询物流
export const logisticsOrder = (orderId) => request(`/member/order/${orderId}/logistics`, 'get')
