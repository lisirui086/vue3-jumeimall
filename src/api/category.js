// 定义分类相关的API接口函数
// 引入二次封装的axios
import request from '@/utils/request'

// 获取所有分类（顶级，二级，对应所有商品）
export const findAllCategory = () => request('/home/category/head', 'get')
