// 引入二次封装的axios
import request from '@/utils/request'

// 获取首页品牌数据 默认limit是6
export const findBrand = (limit = 6) => request('/home/brand', 'get', { limit })
// 获取轮播图数据
export const findBanner = () => request('/home/banner', 'get')
// 获取新鲜好物
export const findNew = () => request('/home/new', 'get')
// 获取人气推荐
export const findHot = () => request('/home/hot', 'get')
// 获取商品板块
export const findGoods = () => request('/home/goods', 'get')
// 获取最新专题
export const findSpecial = () => request('/home/special', 'get')
