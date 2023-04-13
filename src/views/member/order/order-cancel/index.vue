<template>
  <XtxDialog title="取消订单" v-model:visible="visibleDialog">
    <!-- 取消原因列表 -->
    <div class="cancel-info">
      <p>取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
      <p class="tip">请选择取消订单的原因（必选）：</p>
      <div class="btn">
        <a href="javascript:;" v-for="(cause, i) in cancelReason" :key="i" @click="currText = cause"
          :class="{ active: currText === cause }">
          {{ cause }}
        </a>
      </div>
    </div>
    <!-- 按钮操作 -->
    <XtxButton type="gray" @click="visibleDialog=false" style="margin-right:20px">取消</XtxButton>
    <XtxButton type="primary" @click="submit">确认</XtxButton>
  </XtxDialog>
</template>

<script>
// 组合式API
import { ref } from 'vue'
// 常量和后台api
import { cancelReason } from '@/api/constants'
import { cancelOrder } from '@/api/order'
import Message from '@/components/library/Message'
export default {
  name: 'OrderCancel',
  setup () {
    // 控制对话框显示隐藏 默认隐藏
    const visibleDialog = ref(false)
    // 当前选中的原因
    const currText = ref('')
    // 打开对话框
    // 存储当前要取消的订单信息
    const currOrder = ref({})
    const open = (order) => {
      visibleDialog.value = true
      currOrder.value = order
    }
    // 提交取消
    const submit = () => {
      if (!currText.value) return Message({ text: '请选择取消原因' })
      cancelOrder({ orderId: currOrder.value.id, cancelReason: currText.value }).then(data => {
        if (data.code === '1') {
          Message({ type: 'success', text: '已取消该订单' })
          currOrder.value.orderState = 6
          visibleDialog.value = false
        }
      })
    }
    return { visibleDialog, cancelReason, currText, open, submit }
  }
}
</script>

<style scoped lang="less">
 .xtx-dialog :deep(.wrapper) {
  width: 620px;
}
.cancel-info {
  p {
    font-size: 16px;
    line-height: 35px;
    &.tip {
      color: #999;
    }
  }
  .btn {
    padding-top: 21px;
    display: flex;
    flex-wrap: wrap;
    a {
      width: 256px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 20px;
      color: #666;
      &:nth-child(2n){
        margin-right: 0;
      }
      &:hover,&.active {
        background-color: #e3f9f4;
        border-color: @xtxColor;
      }
    }
  }
}
</style>
