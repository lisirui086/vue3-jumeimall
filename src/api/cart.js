// 引入二次封装的axios
import request from '@/utils/request'
// 获取商品的最新价格 库存 是否有效
export const getNewCartGoods = (skuId) => request(`/goods/stock/${skuId}`, 'get')
