import http from './http'

export const URL = {
  register: '/api/user/register',
  login: '/api/user/login',
  checkLogin: '/api/user/checkLogin',

  // 词组
  getWord: '/api/proname/getWord',
  addWord: '/api/proname/addWord',
  delWord: '/api/proname/delWord',
  // 汉字
  getChinese: '/api/proname/getChinese',
  addChinese: '/api/proname/addChinese',
  delChinese: '/api/proname/delChinese',
  // 诗词
  getPoetry: '/api/proname/getPoetry',
  addPoetry: '/api/proname/addPoetry',
  delPoetry: '/api/proname/delPoetry',
  // 获取文章标签
  getTag: '/api/proname/getTag',
  // 文章
  getArticle: '/api/proname/getArticle',
  addArticle: '/api/proname/addArticle',
  delArticle: '/api/proname/delArticle',
  getArticleFile: '/api/proname/getArticleFile',

  // 彩票
  getLottery: '/api/lottery/getLottery',
  addLottery: '/api/lottery/addLottery',
  delLottery: '/api/lottery/delLottery'
}

const API = {
  register(data) {
    return http.post(URL.register, data)
  },

  login(username, password) {
    return http.post(URL.login, { username, password })
  },

  checkLogin() {
    return http.post(URL.checkLogin)
  },

  getWord(params = {}) {
    return http.get(URL.getWord, { params })
  },

  addWord(data) {
    return http.post(URL.addWord, data)
  },

  delWord(data) {
    return http.post(URL.delWord, data)
  },

  getChinese(params = {}) {
    return http.get(URL.getChinese, { params })
  },

  addChinese(data) {
    return http.post(URL.addChinese, data)
  },

  delChinese(data) {
    return http.post(URL.delChinese, data)
  },

  getPoetry(params = {}) {
    return http.get(URL.getPoetry, { params })
  },

  addPoetry(data) {
    return http.post(URL.addPoetry, data)
  },

  delPoetry(data) {
    return http.post(URL.delPoetry, data)
  },

  getTag() {
    return http.get(URL.getTag)
  },

  getArticle(params = {}) {
    return http.get(URL.getArticle, { params })
  },

  addArticle(data) {
    return http.post(URL.addArticle, data)
  },

  delArticle(data) {
    return http.post(URL.delArticle, data)
  },

  getArticleFile(params = {}) {
    return http.get(URL.getArticleFile, { params })
  },

  getLottery(params = {}) {
    return http.get(URL.getLottery, { params })
  },

  addLottery(data) {
    return http.post(URL.addLottery, data)
  },

  delLottery(data) {
    return http.post(URL.delLottery, data)
  }
}

export default API
