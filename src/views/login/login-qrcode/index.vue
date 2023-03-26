<template>
  <div class="qrcode-box">
    <img src="@/assets/images/qrcode.jpg" alt="">
    <p>打开 <a href="javascript:;">小兔鲜App</a> 扫码登录</p>
  </div>
</template>

<script>
export default {
  name: 'LoginQrcode'
}
</script>

<style lang='less' scoped>
// 二维码容器
.qrcode-box {
  text-align: center;
  padding-top: 40px;

  p {
    margin-top: 20px;

    a {
      color: @xtxColor;
      font-size: 16px;
    }
  }
}
</style>
