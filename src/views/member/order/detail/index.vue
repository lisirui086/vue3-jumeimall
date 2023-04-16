<template>
  <div class="member-order" v-if="orderInfo">
    <!-- 头部 -->
    <OrderDetailAction :order="orderInfo" />
    <!-- 进度 -->
    <DetailSteps :order="orderInfo" />
    <!-- 物流 -->
    <Suspense>
      <!-- 默认显示，兜底 -->
      <template #fallback>
        <div class="loading">loading...</div>
      </template>
      <template #default>
        <DetailLogistics :order="orderInfo" v-if="[3,4,5].includes(orderInfo.orderState)" />
      </template>
    </Suspense>
    <!-- 信息 -->
    <DetailOrderInfo :order="orderInfo" />
  </div>
</template>
<script>
// 引入子组件
import OrderDetailAction from './detail-action'
import DetailSteps from './detail-steps'
import DetailLogistics from './detail-logistics'
import DetailOrderInfo from './detail-info'
// 引入组合式API
import { ref } from 'vue'
// 引入后台接口
import { findOrderDetail } from '@/api/order'
// 引入路由
import { useRoute } from 'vue-router'
export default {
  name: 'MemberOrderDetail',
  components: { OrderDetailAction, DetailSteps, DetailLogistics, DetailOrderInfo },
  setup () {
    const route = useRoute()
    // 存储当前订单信息
    const orderInfo = ref(null)
    // 获取当前订单信息
    findOrderDetail(route.params.id).then(data => {
      if (data.code === '1') {
        orderInfo.value = data.result
      }
    })
    return { orderInfo }
  }
}
</script>
<style lang="less" scoped>
.member-order{
  background-color: #fff;
  height: 100%;
  .loading {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 30px;
    background-color: #f5f5f5;
    margin: 30px 50px 0;
  }
}
</style>
