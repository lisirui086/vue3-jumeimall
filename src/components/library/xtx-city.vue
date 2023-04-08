<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle" :class="{ active: visible }">
      <span class="placeholder" v-if="!fullLocation">{{placeholder}}</span>
      <span class="value" v-else>{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <div class="loading" v-if="loading"></div>
      <template v-else>
        <span class="ellipsis" @click="selectFullLocation(item)" v-for="item in currList" :key="item.code">{{ item.name }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup (props, { emit }) {
    // 隐藏和显示
    const visible = ref(false)
    // 观察的节点
    const target = ref(null)
    // 存储省市区数据
    const allCityData = ref([])
    // 是否正在加载效果
    const loading = ref(false)
    // 控制隐藏和显示的方法
    const open = () => {
      // 清空上一次的选择
      for (const key in changeResult) {
        changeResult[key] = ''
      }
      visible.value = true
      // 在获取省市区时开启加载效果
      loading.value = true
      // 打开的时候发请求获取城市信息
      getCityData().then(data => {
        loading.value = false
        allCityData.value = data
      })
    }
    const close = () => {
      visible.value = false
    }
    // 计算属性
    const currList = computed(() => {
      // 默认是显示省数据
      let list = allCityData.value
      // 可能是市 如果你有了省了
      if (changeResult.provinceCode && changeResult.provinceName) {
        list = list.find(p => p.code === changeResult.provinceCode).areaList
      }
      // 可能是县,如果有市了
      if (changeResult.cityCode && changeResult.cityName) {
        list = list.find(c => c.code === changeResult.cityCode).areaList
      }
      return list
    })
    // 提供一个切换函数给select使用
    const toggle = () => {
      visible.value ? close() : open()
    }
    // 实现点击组件外部元素进行关闭操作
    // 参数1 监听了哪个元素 参数2 点击该元素外的其他地方触发的函数
    onClickOutside(target, () => {
      close()
    })
    // 定义 省市区的数据
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    // 选择收货地址
    const selectFullLocation = (item) => {
      // 判断level的等级
      switch (item.level) {
        // 省
        case 0:
          changeResult.provinceCode = item.code
          changeResult.provinceName = item.name
          break
        // 市
        case 1:
          changeResult.cityCode = item.code
          changeResult.cityName = item.name
          break
        // 区县
        default:
          changeResult.countyCode = item.code
          changeResult.countyName = item.name
          // 合并完整地址
          changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
          // 这是最后一级,关闭对话框,通知父组件
          close()
          emit('change', changeResult)
          break
      }
    }
    return { visible, toggle, target, loading, currList, selectFullLocation, changeResult }
  }
}
// 获取省市区数据函数
const getCityData = () => {
  // 数据：https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
  // 1. 当本地没有缓存，发请求获取数据
  // 2. 当本地缓存，取出本地数据
  // 返回promise在then获取数据，这里可能是异步操作可能是同步操作
  return new Promise((resolve, reject) => {
    // 约定： 数据存储在window上的cityData字段上
    if (window.cityData) {
      resolve(window.cityData)
    } else {
      // 头一次拿数据
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(({ data }) => {
        // 1. 缓存
        window.cityData = data
        resolve(data)
      })
    }
  })
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;

  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;

    &.active {
      background: #fff;
    }

    .placeholder {
      color: #999;
    }

    .value {
      color: #666;
      font-size: 12px;
    }

    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }

  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;

    >span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;

      &:hover {
        background: #f5f5f5;
      }
    }

    .loading {
      height: 290px;
      width: 100%;
      background: url(@/assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
