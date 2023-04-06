<template>
  <div class="xtx-cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <!-- 购物车无商品时展示 -->
      <CartNone v-if="validList.length <= 0" />
      <!-- 购物车有商品时展示 -->
      <div class="cart" v-else>
        <table>
          <thead>
            <tr>
              <th width="120">
                <XtxCheckbox @change="checkAll" :modelValue="isCheckAll">全选</XtxCheckbox>
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-for="goods in validList" :key="goods.skuId">
              <td>
                <XtxCheckbox @change="($event) => checkOne(goods.skuId, $event)" :modelValue="goods.selected" />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to='`/product/${goods.id}`'><img :src="goods.picture" :alt="goods.name"></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ goods.name }}</p>
                    <!-- 选择规格组件 -->
                    <CartSku :skuId="goods.skuId" :attrsText="goods.attrsText"
                      @change="$event => updateCartSku(goods.skuId, $event)" />
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ goods.nowPrice }}</p>
                <p v-if="goods.price < goods.nowPrice">比加入时降价 <span class="red">&yen;{{ goods.price - goods.nowPrice
                }}</span>
                </p>
              </td>
              <td class="tc">
                <XtxNumbox @change="$event => updateGoodsCount(goods.skuId, $event)" :max="goods.stock"
                  :modelValue="goods.count" />
              </td>
              <td class="tc">
                <p class="f16 red">&yen;{{ Math.round((goods.nowPrice * 100) * goods.count) / 100 }}</p>
              </td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p><a class="green" href="javascript:;" @click="deleteGoods(goods.skuId)">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="invalidList.length">
            <tr>
              <td colspan="6">
                <h3 class="tit">失效商品</h3>
              </td>
            </tr>
            <tr v-for="item in invalidList" :key="item.skuId">
              <td>
                <XtxCheckbox style="color:#eee;" :modelValue="item.selected" />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${item.id}`"><img :src="item.picture" alt=""></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ item.name }}</p>
                    <p class="attr">{{ item.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.nowPrice }}</p>
              </td>
              <td class="tc">{{ item.count }}</td>
              <td class="tc">
                <p>&yen;{{ Math.round((item.nowPrice * 100) * item.count) / 100 }}</p>
              </td>
              <td class="tc">
                <p><a class="green" href="javascript:;">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XtxCheckbox @change="checkAll" :modelValue="isCheckAll">全选</XtxCheckbox>
          <a href="javascript:;" @click="batchDeleteCart(false)">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;" @click="batchDeleteCart(true)">清空失效商品</a>
        </div>
        <div class="total">
          共 {{ validTotal }} 件商品，已选择 {{ selectedTotal }} 件，商品合计：
          <span class="red">¥{{ selectedAmount }}</span>
          <XtxButton type="primary" @click="checkout">下单结算</XtxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
</template>
<script>
import GoodRelevant from '@/views/goods/goods-relevant'
import CartNone from '@/views/cart/cart-none'
import CartSku from '@/views/cart/cart-sku'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
// 引入封装的Confirm组件
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
export default {
  name: 'XtxCartPage',
  components: { GoodRelevant, CartNone, CartSku },
  setup () {
    const store = useStore()
    const router = useRouter()
    // 有效列表
    const validList = computed(() => store.getters['cart/validList'])
    // 无效商品列表
    const invalidList = computed(() => store.getters['cart/invalidList'])
    // 有效商品总金额
    const validAmount = computed(() => store.getters['cart/validAmount'])
    // 是否全选
    const isCheckAll = computed(() => store.getters['cart/isCheckAll'])
    // 有效商品件数
    const validTotal = computed(() => store.getters['cart/validTotal'])
    // 已选商品总件数
    const selectedTotal = computed(() => store.getters['cart/selectedTotal'])
    // 已选商品总金额
    const selectedAmount = computed(() => store.getters['cart/selectedAmount'])
    // 已选商品列表
    const selectedList = computed(() => store.getters['cart/selectedList'])
    // 单个商品的是否选中
    const checkOne = (skuId, selected) => {
      store.dispatch('cart/updateCart', { skuId, selected })
    }
    // 全选或取消全选
    const checkAll = (selected) => {
      store.dispatch('cart/checkAllCart', selected)
    }
    // 删除对应商品
    const deleteGoods = (skuId) => {
      Confirm({ text: '确定要删除商品吗？' })
        .then(() => {
          store.dispatch('cart/deleteCart', skuId)
          Message({ type: 'success', text: '删除成功' })
        }).catch(e => {
          Message({ type: 'warn', text: '已取消' })
        })
    }
    // 批量删除选中商品
    const batchDeleteCart = (isClean) => {
      Confirm({ text: `警告！确定删除${isClean ? '无效' : '选中'}的商品？` }).then(() => {
        store.dispatch('cart/batchDeleteCart', isClean)
        Message({ type: 'success', text: '已删除' })
      }).catch(e => {
        Message({ text: '已取消' })
      })
    }
    // 修改商品数量
    const updateGoodsCount = (skuId, count) => {
      store.dispatch('cart/updateCart', { skuId, count })
    }
    // 修改商品规格
    const updateCartSku = (oldSkuId, newSku) => {
      // 提交dispatch
      store.dispatch('cart/updateCartSku', { oldSkuId, newSku })
    }
    // 结算按钮
    const checkout = () => {
      // 1. 判断是否选中商品，且提示
      if (selectedList.value.length === 0) return Message({ text: '请勾选需要结算的商品' })
      // 2. 弹出确认框，提示： 下单结算需要登录
      Confirm({ text: '下单结算需要登录，现在去登录吗？' }).then(() => {
        // 跳转至结算页
        router.push('/member/checkout')
      }).catch(e => {
        Message({ text: '已取消' })
      })
      // 3. 使用路由导航守卫，遇到需要登录的路由跳转，拦截到登录页面
    }
    return {
      // 有效列表
      validList,
      // 无效商品列表
      invalidList,
      // 有效商品总金额
      validAmount,
      // 是否全选
      isCheckAll,
      // 有效商品件数
      validTotal,
      // 已选商品总件数
      selectedTotal,
      // 已选商品总金额
      selectedAmount,
      checkOne,
      checkAll,
      deleteGoods,
      batchDeleteCart,
      updateGoodsCount,
      updateCartSku,
      checkout
    }
  }
}
</script>
<style scoped lang="less">
.tc {
  text-align: center;

  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}

.red {
  color: @priceColor;
}

.green {
  color: @xtxColor
}

.f16 {
  font-size: 16px;
}

.goods {
  display: flex;
  align-items: center;

  img {
    width: 100px;
    height: 100px;
  }

  >div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;

    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}

.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;

  .xtx-checkbox {
    color: #999;
  }

  .batch {
    a {
      margin-left: 20px;
    }
  }

  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}

.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}

.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;

    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;

      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;

        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }

      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}</style>
