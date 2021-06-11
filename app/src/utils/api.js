import http from './http'

export const URL = {
  register: '/api/user/register',
  login: '/api/user/login',
  checkLogin: '/api/user/checkLogin',

  // 词组
  getWord: '/api/wxName/getWord',
  addWord: '/api/wxName/addWord',
  delWord: '/api/wxName/delWord',
  // 汉字
  getChinese: '/api/wxName/getChinese',
  addChinese: '/api/wxName/addChinese',
  delChinese: '/api/wxName/delChinese',
  // 诗词
  getPoetry: '/api/wxName/getPoetry',
  addPoetry: '/api/wxName/addPoetry',
  delPoetry: '/api/wxName/delPoetry',
  // 获取文章标签
  getTag: '/api/wxName/getTag',
  // 文章
  getArticle: '/api/wxName/getArticle',
  addArticle: '/api/wxName/addArticle',
  delArticle: '/api/wxName/delArticle',
  getArticleFile: '/api/wxName/getArticleFile',

  // 彩票
  getLottery: '/api/lottery/getLottery',
  addLottery: '/api/lottery/addLottery',
  delLottery: '/api/lottery/delLottery',

  // 获取开奖信息
  getLotteryData: '/api/lottery/getLotteryData',
  getLotteryRecent: '/api/lottery/getLotteryRecent',


  // 网易云
  getArtist: '/api/music/getArtist',
  getHotComment: '/api/music/getHotComment',
  getSong: '/api/music/getSong',
  updateMusicSize: '/api/music/updateMusicSize',
  updateCommentCount: '/api/music/updateCommentCount',
  updateCommentLikedCount: '/api/music/updateCommentLikedCount',
  getUpdateHistory: '/api/music/getUpdateHistory'
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

  getWord(data) {
    return http.post(URL.getWord, data)
  },

  addWord(data) {
    return http.post(URL.addWord, data)
  },

  delWord(data) {
    return http.post(URL.delWord, data)
  },

  getChinese(data) {
    return http.post(URL.getChinese, data)
  },

  addChinese(data) {
    return http.post(URL.addChinese, data)
  },

  delChinese(data) {
    return http.post(URL.delChinese, data)
  },

  getPoetry(data) {
    return http.post(URL.getPoetry, data)
  },

  addPoetry(data) {
    return http.post(URL.addPoetry, data)
  },

  delPoetry(data) {
    return http.post(URL.delPoetry, data)
  },

  getTag() {
    return http.post(URL.getTag)
  },

  getArticle(data) {
    return http.post(URL.getArticle, data)
  },

  addArticle(data) {
    return http.post(URL.addArticle, data)
  },

  delArticle(data) {
    return http.post(URL.delArticle, data)
  },

  getArticleFile(data) {
    return http.post(URL.getArticleFile, data)
  },

  getLottery(data) {
    return http.post(URL.getLottery, data)
  },

  addLottery(data) {
    return http.post(URL.addLottery, data)
  },

  delLottery(data) {
    return http.post(URL.delLottery, data)
  },

  getLotteryData(data) {
    return http.post(URL.getLotteryData, data)
  },

  getLotteryRecent(data) {
    return http.post(URL.getLotteryRecent, data)
  },


  getArtist(data) {
    return http.post(URL.getArtist, data)
  },

  getHotComment(data) {
    return http.post(URL.getHotComment, data)
  },

  getSong(data) {
    return http.post(URL.getSong, data)
  },

  updateMusicSize(data) {
    return http.post(URL.updateMusicSize, data)
  },

  updateCommentCount(data) {
    return http.post(URL.updateCommentCount, data)
  },

  updateCommentLikedCount(data) {
    return http.post(URL.updateCommentLikedCount, data)
  },

  getUpdateHistory(data) {
    return http.post(URL.getUpdateHistory, data)
  },
}

export default API
