<template>
  <div class="detail-logistics" v-if="logisticsInfo">
    <!-- 显示最新的物流信息 -->
    <p>
      <span>{{logisticsInfo[0].time}}</span>
      <span>{{logisticsInfo[0].text}}</span>
    </p>
    <a href="javascript:;" @click="handlerLogistics(order)">查看物流</a>
    <!-- 查看物流 -->
    <Teleport to="#model">
      <OrderLogistics ref="orderLogisticsCom" />
    </Teleport>
  </div>
</template>
<script>
// 后台接口
import { logisticsOrder } from '@/api/order'
// 组合式API
import { ref } from 'vue'
// 引入子组件 查看物流
import OrderLogistics from '@/views/member/order/order-logistics'
// 引入查看物流函数
import { useLogistics } from '@/views/member/order'
export default {
  name: 'DetailLogistics',
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  components: { OrderLogistics },
  async setup (props) {
    // 存储物流信息
    const logisticsInfo = ref(null)
    await logisticsOrder(props.order.id).then(({ result }) => {
      logisticsInfo.value = result.list
    })
    return { logisticsInfo, ...useLogistics() }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;

  >p {
    flex: 1;

    span {
      color: #999;

      &:first-child {
        margin-right: 30px;
      }
    }
  }

  >a {
    color: @xtxColor;
    text-align: center;
  }
}</style>
