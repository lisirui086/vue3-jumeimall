// 定义分类相关的API接口函数
// 引入二次封装的axios
import request from '@/utils/request'

// 获取所有分类（顶级，二级，对应所有商品）
export const findAllCategory = () => request('/home/category/head', 'get')
// 获取顶级类目信息
export const findTopCategory = (id) => request('/category', 'get', { id })
// 获取二级类目下的筛选条件数据
export const findSubCategoryFilter = (id) => request('/category/sub/filter', 'get', { id })
// 获取分类下的商品（带筛选条件
export const findSubCategoryGoods = (params) => request('/category/goods/temporary', 'post', params)
