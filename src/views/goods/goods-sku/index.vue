<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img @click="changeSku(item,val)" v-if="val.picture" :class="{selected:val.selected, disabled:val.disabled}" :src="val.picture" :alt="val.name" :title="val.name">
          <span @click="changeSku(item,val)" v-else :class="{selected:val.selected, disabled:val.disabled}">{{val.name}}</span>
          <!-- <span>{{val.desc}}</span> -->
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
// 引入幂集算法
import powerSet from '@/vender/power-set'
// 设置分隔符
const spliter = '★'
// 得到一个路径字典对象
const getPathMap = (skus) => {
  // 1. 得到所有的sku集合， props.goods.skus
  // 2. 从所有的sku中筛选出有效的sku
  // 3. 根据有效的sku使用power-set算法得到子集
  // 4. 根据子集往路径字典对象中存储 key-value
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory) {
      // 计算当前有库存的sku子集
      // 例如：[1,2,3] => [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
      // 可选值数据
      const valueArr = sku.specs.map(val => val.valueName)
      // 3. 得到sku属性值数组的子集
      const valueArrPowerSet = powerSet(valueArr)
      // 遍历子集，往pathMap插入数据
      valueArrPowerSet.forEach(arr => {
        // 根据arr得到字符串的key，约定key是：['蓝色','128G'] ===> '蓝色★128G'
        const key = arr.join(spliter)
        // 给pathMap设置数据
        if (pathMap[key]) {
          // 已经有key往数组追加
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}
// 得到选中的参数
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    // 选中的按钮对象
    const selectedVal = item.values.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}
// 更新按钮禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  // 1. 约定每一个按钮的状态由本身的disabled数据来控制
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      // 2. 判断当前是否选中，是选中不用判断
      if (val.selected) return
      // 3. 拿着当前的值按照顺序套入选中的数据
      selectedValues[i] = val.name
      // 4. 剔除undeined数据，按照分隔符拼接key
      const key = selectedValues.filter(value => value).join(spliter)
      // 5. 去路径字典里查找是否有数据，有可以点击，没有就禁用
      val.disabled = !pathMap[key]
    })
  })
}
// 默认选中
const initDefaultSelected = (goods, skuId) => {
  // 1. 找出Sku得信息
  // 2. 遍历每一个按钮,按钮的值和sku记录的值相同就选中
  const sku = goods.skus.find(sku => sku.id === skuId)
  goods.specs.forEach((item, i) => {
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Array,
      default: () => ([])
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)
    // 根据skuid初始化选中
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }
    // 组件初始化：更新按钮禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    // 1. 选中与取消选中，约定在每一个按钮都用自己的选中状态数据：selected
    // 1.1 点击的是已选中，只需要取消当前的选中
    // 1.2 点击的是未选中，先把其他的都变成未选中，然后自己选中
    const changeSku = (item, val) => {
      // 如果是禁用状态不作为
      if (val.disabled) return
      // 如果已选中
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(v => {
          v.selected = false
        })
        val.selected = true
      }
      // 组件初始化：更新按钮禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 将你选择的sku信息通知父组件{skuId, price, oldPrice, inventory, specsText}
      // 1. 选择完整的sku组合按钮, 才能拿到信息, 提交父组件
      // 2. 不是完整的sku组合按钮, 提交空对象给父组件
      const validSelectedValues = getSelectedValues(props.goods.specs).filter(v => v)
      if (validSelectedValues.length === props.goods.specs.length) {
        // 完整
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          inventory: sku.inventory,
          oldPrice: sku.oldPrice,
          // [属性名: 属性值, ..., 属性名: 属性值]
          // .trim() 取出字符串两端空格
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}: ${c.valueName}`, '').trim()
        })
      } else {
        // 不完整
        // 传入空对象是因为给父组件知道商品规格添加是否完整,不完整不让添加
        emit('change', {})
      }
    }
    return { changeSku }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
