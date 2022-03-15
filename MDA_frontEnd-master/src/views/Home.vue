<template>
  <div class="home">
    <bdp-header :navShow="false"/>
  </div>
</template>

<script>
/* eslint-disable */

// @ is an alias to /src
import Header from '@/components/Header.vue'

export default {
  name: 'home',
  components: {
    'bdp-header': Header
  }
}
</script>
