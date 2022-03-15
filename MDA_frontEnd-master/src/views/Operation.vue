<template>
  <div class="page">
    <bdp-header />
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
/* eslint-disable */

// @ is an alias to /src
import Header from '@/components/Header.vue'

export default {
  components: {
    'bdp-header': Header
  }
}
</script>
<style scoped>
.page {
  height: 100%;
  width: 100%;
  padding-top: 55px;
  box-sizing: border-box;
  position: relative;
  /*overflow: auto;*/
  background: white;
}
.content {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  /*background: white;*/
}
</style>
