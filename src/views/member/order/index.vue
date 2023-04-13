<template>
  <div class="member-order">
    <XtxTabs v-model="activeName" @tab-click="tabClick">
      <XtxTabsPanel v-for="tab in orderStatus" :key="tab.name" :name="tab.name" :label="tab.label"></XtxTabsPanel>
    </XtxTabs>
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem v-for="item in orderList" :key="item.id" :order="item" @on-cancel="handlerCancel"
        @on-delete="handlerDelete" @on-confirm="handlerConfirm"
        @on-logistics="handlerLogistics" />
    </div>
    <!-- 分页组件 -->
    <XtxPagination v-if="total > 0" :pageSize=reqParams.pageSize :currentPage=reqParams.page :total="total"
      @current-change="reqParams.page = $event" />
    <!-- 取消原因组件 -->
    <OrderCancel ref="orderCancelCom" />
    <!-- 查看物流组件 -->
    <OrderLogistics ref="orderLogisticsCom" />
  </div>
</template>
<script>
// 引入组合式API
import { ref, reactive, watch } from 'vue'
// 常量
import { orderStatus } from '@/api/constants'
// 引入子组件
import OrderItem from './order-item'
import OrderCancel from './order-cancel'
import OrderLogistics from './order-logistics'
// 后台api
import { findOrderList, deleteOrder, receiptOrder } from '@/api/order'
// 消息提示and删除
import Message from '@/components/library/Message'
import Confirm from '@/components/library/Confirm'
export default {
  name: 'MemberOrder',
  components: { OrderItem, OrderCancel, OrderLogistics },
  setup () {
    // 控制激活哪个选项卡 默认激活第一个
    const activeName = ref('all')
    // 获取数据
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    const orderList = ref([])
    // 控制加载效果显示隐藏 默认不显示
    const loading = ref(false)
    const total = ref(0)
    const getOrderList = () => {
      loading.value = true
      findOrderList(reqParams).then(data => {
        orderList.value = data.result.items
        loading.value = false
        total.value = data.result.counts
      })
    }
    watch(reqParams, () => {
      getOrderList()
    }, { immediate: true })
    // 切换选项卡
    const tabClick = ({ index }) => {
      reqParams.page = 1
      reqParams.orderState = index
    }
    // 删除订单
    const handlerDelete = (order) => {
      Confirm({ text: '亲，您确定要删出该订单吗？' }).then(() => {
        deleteOrder(order.id).then(() =>
          getOrderList(),
        Message({ type: 'success', text: '已删除该订单' }))
      }).catch(e => {
        Message({ text: '已取消' })
      })
    }
    return {
      activeName,
      orderStatus,
      orderList,
      tabClick,
      loading,
      total,
      reqParams,
      ...useCancel(),
      handlerDelete,
      ...useConfirm(),
      ...useLogistics()
    }
  }
}
// 取消订单逻辑
const useCancel = () => {
  // 获取OrderCancel组件实例
  const orderCancelCom = ref(null)
  const handlerCancel = (order) => {
    orderCancelCom.value.open(order)
  }
  return { handlerCancel, orderCancelCom }
}
// 确认收货逻辑
const useConfirm = () => {
  const handlerConfirm = (order) => {
    Confirm({ text: '请确认商品没问题后再确认收货' }).then(() => {
      receiptOrder(order.id).then(() => {
        Message({ type: 'success', text: '已确认收货' })
        // 待收货 变为 待评价
        order.orderState = 4
      })
    }).catch(() => { })
  }
  return { handlerConfirm }
}
// 查看物流逻辑
const useLogistics = () => {
  const orderLogisticsCom = ref(null)
  const handlerLogistics = (order) => {
    orderLogisticsCom.value.open(order)
  }
  return { handlerLogistics, orderLogisticsCom }
}
</script>
<style lang="less" scoped>
.member-order {
  height: 100%;
  background: #fff;

  .order-list {
    padding: 20px;
    position: relative;
    min-height: 400px;
  }

  .loading {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(255, 255, 255, .9) url('@/assets/images/loading.gif') no-repeat center;
  }

  .none {
    height: 400px;
    text-align: center;
    line-height: 400px;
    color: #999;
  }

  .order-item {
    margin-bottom: 20px;
    border: 1px solid #f5f5f5;

    .head {
      height: 50px;
      line-height: 50px;
      background: #f5f5f5;
      padding: 0 20px;
      overflow: hidden;

      span {
        margin-right: 20px;

        &.down-time {
          margin-right: 0;
          float: right;

          i {
            vertical-align: middle;
            margin-right: 3px;
          }

          b {
            vertical-align: middle;
            font-weight: normal;
          }
        }
      }

      .del {
        margin-right: 0;
        float: right;
        color: #999;
      }
    }

    .body {
      display: flex;
      align-items: stretch;

      .column {
        border-left: 1px solid #f5f5f5;
        text-align: center;
        padding: 20px;

        >p {
          padding-top: 10px;
        }

        &:first-child {
          border-left: none;
        }

        &.goods {
          flex: 1;
          padding: 0;
          align-self: center;

          ul {
            li {
              border-bottom: 1px solid #f5f5f5;
              padding: 10px;
              display: flex;

              &:last-child {
                border-bottom: none;
              }

              .image {
                width: 70px;
                height: 70px;
                border: 1px solid #f5f5f5;
              }

              .info {
                width: 220px;
                text-align: left;
                padding: 0 10px;

                p {
                  margin-bottom: 5px;

                  &.name {
                    height: 38px;
                  }

                  &.attr {
                    color: #999;
                    font-size: 12px;

                    span {
                      margin-right: 5px;
                    }
                  }
                }
              }

              .price {
                width: 100px;
              }

              .count {
                width: 80px;
              }
            }
          }
        }

        &.state {
          width: 120px;

          .green {
            color: @xtxColor;
          }
        }

        &.amount {
          width: 200px;

          .red {
            color: @priceColor;
          }
        }

        &.action {
          width: 140px;

          a {
            display: block;

            &:hover {
              color: @xtxColor;
            }
          }
        }
      }
    }
  }
}
</style>
