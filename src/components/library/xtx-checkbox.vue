<template>
  <div class="xtx-checkbox" @click="changeCheck">
    <i v-if="isCheck === true" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>
<script>
// import { ref } from 'vue'
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // 显示 选中和未选中， 默认显示选中
    /* const isCheck = ref(true)
    // 侦听modelValue的值
    // 原生写法
    watch(() => props.modelValue, () => {
      isCheck.value = props.modelValue
    }, { immediate: true })
    // 更改 显示 选中和未选中
    const changeCheck = () => {
      isCheck.value = !isCheck.value
      // 用emit传递给父组件
      emit('update:modelValue', isCheck.value)
    } */
    // vue3.0 依赖@vueuse/core实现数据双向绑定
    // 1. 使用props接收modelValue
    // 2. 使用useVMdeol来包装props中的modelValue属性数据
    // 3. 在使用isCheck.value就是使用父组件数据
    // 4. 在使用isChech.value = '数据' 赋值，触发emit('update:modelValue', '数据')
    const isCheck = useVModel(props, 'modelValue', emit)
    const changeCheck = () => {
      // 通知父组件
      isCheck.value = !isCheck.value
      emit('change', isCheck)
    }
    return { isCheck, changeCheck }
  }
}
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
