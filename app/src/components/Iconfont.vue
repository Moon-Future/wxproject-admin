<template>
  <div class="icon-container" :style="{ fontSize: fontSize + 'px', color: color, margin: margin }">
    <svg class="iconfont" aria-hidden="true">
      <use :xlink:href="`#${icon}`"></use>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'icon-video'
    },
    fontSize: {
      type: Number,
      default: 16
    },
    color: {
      type: String,
      default: 'initial'
    },
    margin: {
      type: String,
      default: '0'
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-container {
  display: inline;
}
</style>
