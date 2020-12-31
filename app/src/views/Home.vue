<template>
  <div class="home">
    <el-container class="home-container">
      <el-aside width="200px">
        <Aside></Aside>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Aside from '@/components/Aside'
import http from '@/utils/http.js'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Home',
  components: {
    Aside
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['loginStatus'])
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.home {
  height: 100%;
}
.home-container {
  height: 100%;
}
</style>
