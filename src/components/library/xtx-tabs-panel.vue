<template>
  <div class="xtx-tabs-panel" v-show="name===activeName">
    <slot />
  </div>
</template>
<script>
// 引入组合式API
import { inject } from 'vue'
export default {
  name: 'XtxTabsPanel',
  // label 是选项卡文字，name选项卡唯一标识，$slot.default()默认插槽内容
  props: {
    label: {
      type: String,
      default: ''
    },
    name: {
      type: [String, Number],
      default: ''
    }
  },
  setup () {
    const activeName = inject('activeName')
    return { activeName }
  }
}
</script>

<style lang='less' scoped>
</style>
