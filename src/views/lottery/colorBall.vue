<template>
  <div class="container">
    <select-ball :redNum="33" :blueNum="16" :redLen="6" :blueLen="1" :type="1"></select-ball>
  </div>
</template>

<script>
import selectBall from '@/components/lottery/selectBall'
export default {
  name: 'colorBall',
  components: {
    selectBall
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
