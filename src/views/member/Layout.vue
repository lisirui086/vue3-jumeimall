<template>
  <div class="container">
    <XtxMemberAside />
    <article class="article">
      <RouterView />
    </article>
  </div>
</template>
<script>
import XtxMemberAside from '@/components/aside'
export default {
  name: 'MemberLayout',
  components: {
    XtxMemberAside
  }
}
</script>
<style scoped lang="less">
.container {
  display: flex;
  padding-top: 20px;

  .article {
    width: 1000px;
  }
}
</style>
