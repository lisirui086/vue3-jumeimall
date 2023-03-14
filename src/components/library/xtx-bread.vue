<!-- 面包屑组件-初级 -->

<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  render () {
    // 用法
    // 1. template标签去除 ，单文件组件
    // 返回值就是组件内容
    // vue2.0 的h是函数传参进来的，vue3.0的h函数导入进来额
    // h的第一个参数是标签名字， 第二个参数标签属性对象 第三个参数是子节点
    // 需求
    // 1. 创建xtx-bread父容器
    // 2. 获取默认插槽内容
    // 3. 去除xtx-bread-item组件的i标签，应该由render函数来组织
    // 4. 遍历插槽中的item得到动态创建的节点，最后一个item不加i标签
    // 5. 把动态创建的节点渲染在xtx-bread标签中
    const items = this.$slots.default()
    const completeItems = []
    items.forEach((item, i) => {
      completeItems.push(item)
      // 最后一个不加i标签
      if (i < (items.length - 1)) {
        completeItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    return h('div', { class: 'xtx-bread' }, completeItems)
  }
}
</script>

<style lang='less'>
// 去除scoped属性，目的是为了让样式作用到xtx-bread-item组件
.xtx-bread{
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all .4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
    // 隐藏最后一个 i的样式
    // &: :last-child { display: none ;}
  }
}
</style>
