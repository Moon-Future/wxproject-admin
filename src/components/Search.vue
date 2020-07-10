<template>
  <div class="search-container">
    <div class="search-condition">
      <slot></slot>
    </div>
    <el-button type="primary" size="mini" @click="search">搜索</el-button>
  </div>
</template>

<script>

export default {
  name: 'Search',
  methods: {
    search() {
      this.$emit('search')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  margin-bottom: 10px;
  display: flex;
}
.search-condition {
  display: flex;
  width: 100%;
}
</style>
