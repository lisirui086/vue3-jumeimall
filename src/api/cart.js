// 引入二次封装的axios
import request from '@/utils/request'
// 获取商品的最新价格 库存 是否有效
export const getNewCartGoods = (skuId) => request(`/goods/stock/${skuId}`, 'get')
// 获取商品对应的sku数据
export const getGoodsSku = (skuId) => request(`/goods/sku/${skuId}`, 'get')
// 合并购物车信息
export const mergeCart = (cartList) => request('/member/cart/merge', 'post', cartList)
// 获取购物车列表
export const findCart = () => request('/member/cart', 'get')
// 加入购物车
export const insertCart = ({ skuId, count }) => request('/member/cart', 'post', { skuId, count })
// 删除购物车商品
export const deleteCart = (ids) => request('/member/cart', 'delete', { ids })
// 修改购物车商品: 状态\数量
export const updateGoods = ({ skuId, selected, count }) => request(`/member/cart/${skuId}`, 'put', { selected, count })
// 购物车全选/取消全选
export const checkAllCart = ({ selected, ids }) => request('/member/cart/selected', 'put', { selected, ids })
