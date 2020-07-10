import * as types from './mutation-types'

const mutations = {
  [types.SET_USERINFO](state, { userInfo, status, token }) {
    if (status) {
      localStorage.setItem('token', token)
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      state.token = token
      state.userInfo = userInfo
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      state.token = ''
      state.userInfo = {}
    }
  }
}

export default mutations
