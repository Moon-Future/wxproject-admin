const axios = require('axios')
const HOST = 'http://localhost:3000'

module.exports = {
  // 获取歌手列表
  async getArtists(type = -1, area = -1, limit = 30, offset = 0) {
    const result = await axios.get(`${HOST}/artist/list?type=${type}&area=${area}&limit=${limit}&offset=${offset}`)
    return result.data.artists
  },

  // 获取歌手歌曲列表
  async getSongs(id, limit = 30, offset = 0) {
    const result = await axios.get(`${HOST}/artist/songs?id=${id}&limit=${limit}&offset=${offset}`)
    return result.data
  },

  // 获取歌曲热门评论
  async getHotComments(id, limit = 30, offset = 0) {
    const result = await axios.get(`${HOST}/comment/hot?id=${id}&type=0&limit=${limit}&offset=${offset}`)
    return result.data.hotComments
  },

  // 获取歌曲全部评论
  // sortType: 排序方式,1:按推荐排序,2:按热度排序,3:按时间排序
  async getComments(id, pageNo = 1, pageSize = 20, sortType = 3) {
    const result = await axios.get(`${HOST}/comment/new?id=${id}&type=0&pageNo=${pageNo}&pageSize=${pageSize}&sortType=${sortType}`)
    return result.data.data.comments
  },

  // 获取歌曲评论总数
  async getCommentCount(id) {
    const result = await axios.get(`${HOST}/comment/music?id=${id}&limit=1`)
    return result.data.total
  },

  // 获取歌词
  async getLyric(id) {
    const result = await axios.get(`${HOST}/lyric?id=${id}`)
    return result.data.lrc.lyric
  }
}