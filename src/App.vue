<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'App',
  data() {
    return {}
  },
  created() {
    const token = localStorage.getItem('token')
    const userInfo = localStorage.getItem('userInfo')
    if (token) {
      this.setUserInfo({ userInfo: JSON.parse(userInfo), status: true, token })
    }
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USERINFO'
    })
  }
}
</script>

<style lang="scss">
@import './scss/reset.scss';
@import './scss/common.scss';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
  color: $color-black;
  height: 100%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    // color: #2c3e50;
    color: $color-black;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
