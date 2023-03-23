// 提供商品相关的API函数
import request from '@/utils/request'

// 获取商品详情
export const findGoods = (id) => request('/goods', 'get', { id })
// 商品id：传入就是相关推荐， 不传入就是猜你喜欢， limit:数量
// 获取推荐商品猜你喜欢
export const findRelevantGoods = ({ id, limit = 16 }) => request('/goods/relevant', 'get', { id, limit })
// 获取热销榜数据
export const findGoodsHot = ({ id, type = 1, limit = 3 }) => request('/goods/hot', 'get', { id, type, limit })
