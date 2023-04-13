<script>
// 引入VueUse
import { useVModel } from '@vueuse/core'
// 引入组合式API
import { provide } from 'vue'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    // 接收v-model的值
    const activeName = useVModel(props, 'modelValue', emit)
    // 点击选项卡触发函数切换activeName的值
    const tabClick = (name, index) => {
      activeName.value = name
      // 提供一个自定义事件
      emit('tab-click', { name, index })
    }
    provide('activeName', activeName)
    return { activeName, tabClick }
  },
  render () {
    // 接收插槽
    const panels = this.$slots.default()
    const dynamicPanels = []
    panels.forEach(item => {
      // 静态
      if (item.type.name === 'XtxTabsPanel') {
        dynamicPanels.push(item)
      } else {
        item.children.forEach(com => {
          dynamicPanels.push(com)
        })
      }
    })
    const nav = <nav>{
      dynamicPanels.map((item, i) => {
        return <a href='javascript:;' class={{ active: item.props.name === this.activeName }} onClick={() => this.tabClick(item.props.name, i)}>{item.props.label}</a>
      })
    }</nav>
    // 返回的内容会进行渲染
    // 1. 在babel的帮助下，可以在vue中写jsx语法
    return <div class="xtx-tabs">{ [nav, dynamicPanels] }</div>
  }
}
</script>
<style lang="less" scoped>
.xtx-tabs {
  background: #fff;

  >nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    >a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;

      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}</style>
