<template>
  <div class="xtx-numbox">
    <div class="label" v-if="label">{{label}}</div>
    <div class="numbox">
      <a href="javascript:;" @click="changeNum(-1)">-</a>
      <input type="text" readonly :value="modelValue">
      <a href="javascript:;" @click="changeNum(1)">+</a>
    </div>
  </div>
</template>
<script>
// 引入usevue的函数
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxNumbox',
  props: {
    modelValue: {
      type: Number,
      default: 1
    },
    // 最小最大值
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 10
    },
    // 提示
    label: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 2. 使用useVModel做数据绑定，修改count通知父组件更新
    const count = useVModel(props, 'modelValue', emit)
    // 1. 绑定按钮点击事件， +按钮 -按钮 触发同一个事件同一个函数
    const changeNum = (step) => {
      // 3. 得到将要改变的值，如果值不合法终止程序 最大不超过库存
      const newValue = count.value + step
      if (props.min > newValue || props.max < newValue) return
      // 4. 正常情况
      count.value = newValue
      // 5. 提供change事件
      emit('change', newValue)
    }
    return { changeNum }
  }
}
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right:1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left:1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
