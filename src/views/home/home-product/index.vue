<!-- 产品区块 -->
<template>
  <div class="home-product" ref="target">
    <HomePanel :title="item.name"  v-for="item in list" :key="item.id">
      <template v-slot:right>
        <div class="sub">
          <RouterLink  v-for="subitem in item.children" :key="subitem.id" :to="`/category/sub/${subitem.id}`">{{ subitem.name }}</RouterLink>
        </div>
        <XtxMore :path="`/category/${item.id}`" />
      </template>
      <div class="box">
        <RouterLink class="cover" :to="`/category/${item.id}`">
          <img v-lazy="item.picture" :alt="item.name">
          <strong class="label">
            <span>{{item.name}}馆</span>
            <span>{{item.saleInfo}}</span>
          </strong>
        </RouterLink>
        <ul class="goods-list">
          <li v-for="goods in item.goods" :key="goods.id">
            <HomeGoods :goods="goods" />
          </li>
        </ul>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from '@/views/home/home-panel'
import HomeGoods from '@/views/home/home-goods'
// 引入数据懒加载
import { useLazyData } from '@/hooks'
// 引入api
import { findGoods } from '@/api/home'
export default {
  name: 'HomeProduct',
  components: { HomePanel, HomeGoods },
  setup () {
    // 使用数据来加载
    const { target, result } = useLazyData(findGoods)
    return { target, list: result }
  }
}
</script>

<style scoped lang='less'>
.home-product {
  background: #fff;
  height: 2900px;

  .sub {
    margin-bottom: 2px;

    a {
      padding: 2px 12px;
      font-size: 16px;
      border-radius: 4px;

      &:hover {
        background: @xtxColor;
        color: #fff;
      }

      &:last-child {
        margin-right: 80px;
      }
    }
  }

  .box {
    display: flex;

    .cover {
      width: 240px;
      height: 610px;
      margin-right: 10px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .label {
        width: 188px;
        height: 66px;
        display: flex;
        font-size: 18px;
        color: #fff;
        line-height: 66px;
        font-weight: normal;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate3d(0, -50%, 0);

        span {
          text-align: center;

          &:first-child {
            width: 76px;
            background: rgba(0, 0, 0, .9);
          }

          &:last-child {
            flex: 1;
            background: rgba(0, 0, 0, .7);
          }
        }
      }
    }

    .goods-list {
      width: 990px;
      display: flex;
      flex-wrap: wrap;

      li {
        width: 240px;
        height: 300px;
        margin-right: 10px;
        margin-bottom: 10px;

        &:nth-last-child(-n+4) {
          margin-bottom: 0;
        }

        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}</style>
