<template>
  <div class="container">
    <select-ball redNum="35" blueNum="12" redLen="5" blueLen="2" type="2"></select-ball>
  </div>
</template>

<script>
import selectBall from '@/components/lottery/selectBall'
export default {
  name: 'superLotto',
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
