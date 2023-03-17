<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem :key="category.top.id" v-if="category.top" :to="`/category/${category.top.id}`">{{category.top.name}}</XtxBreadItem>
    <Transition name="fade-right" mode="out-in">
      <XtxBreadItem :key="category.sub.id" v-if="category.sub" :to="`/category/sub/${category.sub.id}`">{{category.sub.name}}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>
<script>
// 引入vuex、vuerouter、组合式API
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
export default {
  name: 'SubBread',
  setup () {
    const store = useStore()
    const route = useRoute()
    // 获取顶级类目和二级类目的id和name
    // { top: {id, name}, sub: {id,name} }
    const category = computed(() => {
      // 声明一个空cate
      const cate = {}
      store.state.category.list.forEach(top => {
        // 如果顶级类目中有二级类目
        if (top.children) {
          const sub = top.children.find(sub => sub.id === route.params.id)
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      return cate
    })
    return { category }
  }
}
</script>
<style scoped lang="less"></style>
