<template>
  <div class='sub-sort'>
    <div class="sort">
      <a :class="{ active: sortField === null }" @click="changeSort(null)" href="javascript:;">默认排序</a>
      <a :class="{ active: sortField === 'publishTime' }" @click="changeSort('publishTime')" href="javascript:;">最新商品</a>
      <a :class="{ active: sortField === 'orderNum' }" @click="changeSort('orderNum')" href="javascript:;">最高人气</a>
      <a :class="{ active: sortField === 'evaluateNum' }" @click="changeSort('evaluateNum')" href="javascript:;">评论最多</a>
      <a href="javascript:;" @click="changeSort('price')">
        价格排序
        <i :class="{ active: sortField === 'price' && sortMethod === 'asc' }" class="arrow up" />
        <i :class="{ active: sortField === 'price' && sortMethod === 'desc' }" class="arrow down" />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox @change="changeCheck" v-model="inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox @change="changeCheck" v-model="onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
export default {
  name: 'SubSort',
  setup (props, { emit }) {
    // 实现交互（实现交换的数据和后台保持一致）
    // 1. 明确交互数据
    const sortParams = reactive({
      // 仅显示有货商品
      inventory: false,
      // 仅显示特惠商品
      onlyDiscount: false,
      // 默认排序
      sortField: null,
      // 价格排序 默认 desc
      sortMethod: null
    })
    // 2. 提供给模板使用
    // 3. 需要提供绑定事件修改排序字段和排序方式
    const changeSort = (sortField) => {
      if (sortField === 'price') {
        // 先选中按价格排序
        sortParams.sortField = sortField
        // 再判断是不是头一次选
        if (sortParams.sortMethod === null) {
          sortParams.sortMethod = 'desc'
        } else {
          // 其他情况取反
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        // 如果选择重复的排序直接return
        if (sortParams.sortField === sortField) return
        // 除了价格排序其他的按传入的 sortField 赋值然后价格排序置空
        sortParams.sortField = sortField
        sortParams.sortMethod = null
      }
      // 触发自定义事件
      emit('sort-change', sortParams)
    }
    const changeCheck = () => {
      // 触发自定义事件
      emit('sort-change', sortParams)
    }
    return { ...toRefs(sortParams), changeSort, changeCheck }
  }
}
</script>
<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .sort {
    display: flex;

    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all .3s;

      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }

      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;

        &.up {
          top: 3px;
          border-bottom-color: #bbb;

          &.active {
            border-bottom-color: @xtxColor;
          }
        }

        &.down {
          top: 15px;
          border-top-color: #bbb;

          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }

  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
