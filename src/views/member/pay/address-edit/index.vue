<template>
  <XtxDialog title="添加收货地址" v-model:visible="visibleDialog">
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input v-model="FormData.receiver" class="input" placeholder="请输入收货人" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input v-model="FormData.contact" class="input" placeholder="请输入手机号" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity :fullLocation="FormData.fullLocation" @change="saveCode" placeholder="请选择所在地区" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input v-model="FormData.address" class="input" placeholder="请输入详细地址" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input v-model="FormData.postalCode" class="input" placeholder="请输入邮政编码" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input v-model="FormData.addressTags" class="input" placeholder="请输入地址标签，逗号分隔" />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <XtxButton type="gray" style="margin-right: 20px" @click="visibleDialog = false">取消</XtxButton>
      <XtxButton type="primary" @click="submit">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
// 引入组合式api
import { ref, reactive } from 'vue'
// 引入后台api
import { addAddress } from '@/api/order'
import Message from '@/components/library/Message'
export default {
  name: 'AddressEdit',
  setup (props, { emit }) {
    const visibleDialog = ref(false)
    // 打开对话框
    const openvisibleDialog = () => {
      visibleDialog.value = true
      // 清空FormData内的数据
      for (const i in FormData) {
        if (i === 'isDefault') {
          FormData[i] = 1
        } else {
          FormData[i] = null
        }
      }
    }
    // 存储新增的收货信息
    const FormData = reactive({
      receiver: null, //  收货人姓名
      contact: null, //  联系方式
      provinceCode: null, // 所在省份编码
      cityCode: null, // 所在城市编码
      countyCode: null, // 所在区/县编码
      address: null, // 详细地址
      postalCode: null, // 邮政编码
      addressTags: null, // 地址标签,以英文逗号分割
      isDefault: 1, // 是否为默认，0为是，1为否
      fullLocation: null // 完整的行政区地址
    })
    // 选择所在地区获取省市区编码
    const saveCode = (res) => {
      FormData.provinceCode = res.provinceCode
      FormData.cityCode = res.cityCode
      FormData.countyCode = res.countyCode
      FormData.fullLocation = res.fullLocation
    }
    // 添加收货地址信息确定按钮
    const submit = () => {
      addAddress(FormData).then(data => {
        // 设置id
        FormData.id = data.result.id
        // 提示
        Message({ type: 'success', text: '添加成功' })
        // 关闭
        visibleDialog.value = false
        // 触发自定义事件
        emit('on-success', FormData)
      })
    }
    return { visibleDialog, openvisibleDialog, FormData, saveCode, submit }
  }
}
</script>
<style lang="less" scoped>
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;

    .body {
      font-size: 14px;
    }
  }
}

.xtx-form {
  padding: 0;

  input {
    outline: none;

    &::placeholder {
      color: #ccc;
    }
  }
}

.xtx-city {
  width: 320px;

  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;

    .placeholder {
      color: #ccc;
    }

    i {
      color: #ccc;
      font-size: 18px;
    }

    .value {
      font-size: 14px;
    }
  }

  :deep(.option) {
    top: 49px;
  }
}
</style>
