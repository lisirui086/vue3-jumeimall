// 引入mockjs
import Mock from 'mockjs'
// 引入node api
import qs from 'qs'
// 基本配置
Mock.setup({
  // 随机延迟
  timeout: '500-2000'
})
// 拦截接口
// 1. 接口地址路径规则 需要匹配到它
// 2. 请求方式
// 3. 返回数据（函数返回数据）
// 模拟拦截 我的收藏
Mock.mock(/\/member\/collect/, 'get', config => {
  const queryString = config.url.split('?')[1]
  const queryObject = qs.parse(queryString)
  const items = []
  for (let i = 0; i < +queryObject.pageSize; i++) {
    items.push(
      Mock.mock({
        id: '@id',
        name: '@ctitle(10, 20)',
        desc: '@ctitle(4,10)',
        price: '@float(100,200,2,2)',
        picture: `https://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
      })
    )
  }
  return {
    msg: '获取收藏商品成功',
    result: {
      counts: 35,
      pageSize: +queryObject.pageSize,
      page: +queryObject.page,
      items
    }
  }
})
// 模拟拦截 我的足迹
Mock.mock(/\/member\/browseHistory/, 'get', config => {
  const queryString = config.url.split('?')[1]
  const queryObject = qs.parse(queryString)
  const items = []
  for (let i = 0; i < 4; i++) {
    items.push(
      Mock.mock({
        id: '@id',
        name: '@ctitle(10, 20)',
        desc: '@ctitle(4,10)',
        price: '@float(100,200,2,2)',
        // discount: '@float(100,200,2,2)',
        // browserTime: Mock.mock('@now()'),
        picture: `https://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
      })
    )
  }
  return {
    msg: '获取足迹商品成功',
    result: {
      counts: 35,
      pageSize: +queryObject.pageSize,
      page: +queryObject.page,
      items
    }
  }
})
