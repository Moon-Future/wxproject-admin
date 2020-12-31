<template>
  <div class="login-container">
    <el-form :model="form" label-position="left" label-width="50px" size="small">
      <el-form-item label="账号">
        <el-input v-model="form.username" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="form.password" @keyup.enter.native="login"></el-input>
      </el-form-item>
    </el-form>
    <el-button class="login-btn" type="primary" size="mini" @click="login" :loading="loading">登陆</el-button>
  </div>
</template>

<script>
import API from '@/utils/api'
import { mapMutations } from 'vuex'
const crypto = require('crypto')

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  created() {
    this.setUserInfo({ status: false })
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USERINFO'
    }),
    async login() {
      if (this.loading) {
        return
      }
      if (this.form.username === '' || this.form.password === '') {
        this.$message({ type: 'error', message: '请输入用户和密码' })
        return
      }
      try {
        this.loading = true
        let res = await API.login(
          this.form.username,
          crypto
            .createHash('sha1')
            .update(this.form.password.trim())
            .digest('hex')
        )
        const { token, userInfo } = res.data
        this.setUserInfo({ userInfo, status: true, token })
        this.loading = false
        this.$router.replace({
          path: '/'
        })
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.login-btn {
  width: 200px;
}
</style>
