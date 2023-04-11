<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddress">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i />货<i />人：</span>{{ showAddress.receiver }}</li>
        <li><span>联系方式：</span>{{ showAddress.contact }}</li>
        <li><span>收货地址：</span>{{ showAddress.fullLocation.replace(/ /g, '') + showAddress.countyCode + showAddress.address }}</li>
      </ul>
      <a href="javascript:;" @click="openAddressEdit(showAddress)">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn" @click="openvisibleDialog">切换地址</XtxButton>
      <XtxButton class="btn" @click="openAddressEdit({})">添加地址</XtxButton>
    </div>
    <XtxDialog title="切换收货地址" v-model:visible="visibleDialog">
      <div class="text item" :class="{ active: selectedAddress && selectedAddress.id === item.id }"
        @click="selectedAddress = item" v-for="item in list" :key="item.id">
        <ul>
          <li><span>收<i />货<i />人：</span>{{ item.receiver }}</li>
          <li><span>联系方式：</span>{{ item.contact }}</li>
          <li><span>收货地址：</span>{{ item.fullLocation.replace(/ /g, '') + item.address }}</li>
        </ul>
      </div>
      <template #footer>
        <XtxButton type="gray" style="margin-right: 20px" @click="visibleDialog = false">取消</XtxButton>
        <XtxButton type="primary" @click="confirmAddressFn">确认</XtxButton>
      </template>
    </XtxDialog>
    <!-- 添加收货地址 -->
    <AddressEdit ref="addressEditComp" @on-success="successHandler" />
  </div>
</template>
<script>
import { ref } from 'vue'
// 引入子组件
import AddressEdit from '@/views/member/pay/address-edit'
export default {
  name: 'CheckoutAddress',
  components: { AddressEdit },
  props: {
    // 收货地址列表
    list: {
      type: Array,
      default: () => []
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    // 1. 找到默认地址 默认地址字段： isDefault 0为默认，1不是
    // 2. 没有默认地址，使用第一条收货地址
    // 3. 如果没有收货地址，提示添加收货地址
    const showAddress = ref(null)
    // 遍历所有地址信息，将收货人手机号码中间4位改成****  13666666666
    props.list.forEach(item => {
      // 转化格式
      item.contact = item.contact.replace(/^(\d{3})\d{4}(\d{4})/, '$1****$2')
      // item.contact = item.contact.substring(0, 3) + item.contact.slice(3, 7).replace(/./g, '*') + item.contact.substring(7, 11)
    })
    const defaultAddress = props.list.find(item => item.default === 0)
    if (defaultAddress) {
      showAddress.value = defaultAddress
    } else {
      showAddress.value = props.list.length && props.list[0]
    }
    // 控制对话框组件显示隐藏
    const visibleDialog = ref(false)
    // 自定义事件 通知父组件
    emit('change', showAddress.value && showAddress.value.id)
    // 存储切换地址中选择的收货地址对象
    const selectedAddress = ref(null)
    // 切换地址确定按钮
    const confirmAddressFn = () => {
      // 判断用户是否切换选了收货地址
      if (selectedAddress.value) {
        // 将切换选中的收货地址信息保存，将id给父组件
        showAddress.value = selectedAddress.value
        emit('change', selectedAddress.value.id)
      }
      /* showAddress.value = selectedAddress.value
      emit('change', selectedAddress.value?.id) */
      // 关闭对话框
      visibleDialog.value = false
    }
    // 打开对话框并清空selectedAddress
    const openvisibleDialog = () => {
      selectedAddress.value = null
      visibleDialog.value = true
    }
    // 获取添加收货地址实例
    const addressEditComp = ref(null)
    const openAddressEdit = (address) => {
      addressEditComp.value.openvisibleDialog(address)
    }
    // 新增收货地址
    const successHandler = (FormData) => {
      // 根据已有的id寻找，有则是修改，无则是添加
      const address = props.list.find(item => item.id === FormData.id)
      if (address) {
        for (const key in address) {
          address[key] = FormData[key]
        }
      } else {
        const ob = props.list
        const jsonStr = JSON.stringify(FormData)
        ob.unshift(JSON.parse(jsonStr))
      }
    }
    return {
      showAddress,
      visibleDialog,
      selectedAddress,
      confirmAddressFn,
      openvisibleDialog,
      addressEditComp,
      openAddressEdit,
      successHandler
    }
  }
}
</script>
<style scoped lang="less">
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    >ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          >i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    >a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;

      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }

      >ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}</style>
