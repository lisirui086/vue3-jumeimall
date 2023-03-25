<template>
  <div class="xtx-pagination">
    <!-- 上一页 是否禁用：需要知道当前页码是否是 1 -->
    <a @click="changePage(myCurrentPage-1)" v-if="myCurrentPage>1" href="javascript:;">上一页</a>
    <!-- 禁用的上一页 -->
    <a v-else href="javascript:;" class="disabled">上一页</a>
    <!-- ... 是否显示： 需要知道第一个按钮页码是否是1 -->
    <span v-if="pager.start>1">...</span>
    <a @click="changePage(i)" href="javascript:;" :class="{active: i === myCurrentPage}" v-for="i in pager.btnArr" :key="i">{{i}}</a>
    <!-- ... 是否显示：需要知道最后一个按钮页码是否等于总页数 -->
    <span v-if="pager.end<pager.pageCount">...</span>
    <!-- 下一页： 是否禁用： 需要知道当前页码是否等于总页数 -->
    <a @click="changePage(myCurrentPage+1)" v-if="myCurrentPage<pager.pageCount" href="javascript:;">下一页</a>
    <a v-else href="javascript:;" class="disabled">下一页</a>
  </div>
</template>
<script>
import { ref, computed, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    total: {
      type: Number,
      default: 100
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  setup (props, { emit }) {
    // 总条数
    const myTotal = ref(100)
    // 每页条数
    const myPageSize = ref(10)
    // 当前第几页
    const myCurrentPage = ref(1)
    // 按钮个数
    const btnCount = 5

    // 重点：根据上述数据得到（总页数，起始页码，结束页码，按钮数组）
    const pager = computed(() => {
      // 计算总页数
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 计算起始页码和结束页码
      // 1. 理想情况根据当前页码，和按钮个数可得到
      let start = myCurrentPage.value - Math.floor(btnCount / 2)
      let end = start + btnCount - 1
      // 2.1 如果起始页码小于1了，需要重新计算
      if (start < 1) {
        start = 1
        end = (start + btnCount - 1) > pageCount ? pageCount : (start + btnCount - 1)
      }
      // 2.2 如果结束页码大于总页数，需要重新计算
      if (end > pageCount) {
        end = pageCount
        start = (end - btnCount + 1) < 1 ? 1 : (end - btnCount + 1)
      }
      // 处理完毕start和end得到按钮数组
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return { pageCount, start, end, btnArr }
    })
    // 侦听props的变化，更新组件内部数据
    watch(props, () => {
      myTotal.value = props.total
      myPageSize.value = props.pageSize
      myCurrentPage.value = props.currentPage
    }, { immediate: true })
    // 自定义事件
    const changePage = (newPage) => {
      // 改变当前页
      myCurrentPage.value = newPage
      // 给父组件发请求
      emit('change-page', newPage)
    }
    return { pager, myCurrentPage, changePage }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;

  >a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;

    &:hover {
      color: @xtxColor;
    }

    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;

      &:hover {
        color: #333
      }
    }
  }

  >span {
    margin-right: 10px;
  }
}
</style>
