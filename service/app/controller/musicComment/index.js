'use strict'
const axios = require('axios')
const shortid = require('shortid')
const API = require('./API')
const utils = require('../../utils/index')

const Controller = require('egg').Controller

class HomeController extends Controller {
  // 歌手
  async getArtists() {
    const { ctx, app } = this
    const limit = 50
    let offset = 0
    let artistList = await API.getArtists(-1, -1, limit, offset * limit)
    for (let i = 0, len = artistList.length; i < len; i++) {
      let item = artistList[i]
      await app.mysql.query(`INSERT INTO music_artist (id, name, alias, picUrl, musicSize) VALUES (?, ?, ?, ?, ?)`, [
        item.id, item.name, item.alias.join(','), item.picUrl, item.musicSize
      ])
    }
    while(artistList.length >= limit) {
      offset++
      artistList = await API.getArtists(-1, -1, limit, offset * limit)
      for (let i = 0, len = artistList.length; i < len; i++) {
        let item = artistList[i]
        await app.mysql.query(`INSERT INTO music_artist (id, name, alias, picUrl, musicSize) VALUES (?, ?, ?, ?, ?)`, [
          item.id, item.name, item.alias.join(','), item.picUrl, item.musicSize
        ])
      }
    }
    ctx.body = 'OK'
  }

  // 歌曲
  async getSongs() {
    const { ctx, app } = this
    const limit = 100
    let offset = 0

    const artists = await app.mysql.query(`SELECT * FROM music_artist`)

    for (let i = 0, len = artists.length; i < len; i++) {
      offset = 0
      let artistId = artists[i].id
      let artistsName = artists[i].name
      let songs = await API.getSongs(artistId, limit, offset * limit)
      for (let j = 0; j < songs.length; j++) {
        let item = songs[j]
        await app.mysql.query(`INSERT INTO music_songs (uuid, id, name, artistId, artistName) VALUES (?, ?, ?, ?, ?)`, [
          shortid(), item.id, item.name, artistId, artistsName
        ])
      }
      
      console.log('*********', offset, i, len)
      while(songs.length >= limit) {
        offset++
        console.log('*********', offset)
        songs = await API.getSongs(artistId, limit, offset * limit)
        for (let j = 0; j < songs.length; j++) {
          let item = songs[j]
          await app.mysql.query(`INSERT INTO music_songs (uuid, id, name, artistId, artistName) VALUES (?, ?, ?, ?, ?)`, [
            shortid(), item.id, item.name, artistId, artistsName
          ])
        }
      }
    }

    ctx.body = { songs }
  }

  // 处理歌曲
  async handleSongs() {
    const { ctx, app } = this
    let songs = await app.mysql.query(`SELECT * FROM music_songs`)
    let obj = {}, del = []
    for (let i = 0, len = songs.length; i < len; i++) {
      let song = songs[i]
      let { id, uuid, artistId, artistName } = song
      if (obj[id]) {
        del.push(uuid)
        obj[id].data.artistName += `/${artistName}`
        obj[id].data.artistId += `/${artistId}`
        obj[id].count++
      } else {
        obj[id] = {
          count: 1,
          data: song
        }
      }
    }
    for (let key in obj) {
      let item = obj[key]
      if (item.count > 1) {
        await app.mysql.query(`UPDATE music_songs SET artistId = ?, artistName = ? WHERE uuid = ?`, [item.data.artistId, item.data.artistName, item.uuid])
      }
    }
    for (let i = 0, len = del.length; i < len; i++) {
      await app.mysql.query(`DELETE FROM music_songs WHERE uuid = ?`, [del[i]])
    }
    ctx.body = 'ok'
  }

  // 热门评论
  async getHotComments() {
    const { ctx, app } = this
    const limit = 30
    let offset = 0, songId = 411214279
    let hotComments = await API.getComments(songId, 1, 20, 2)

    // for (let j = 0; j < hotComments.length; j++) {
    //   let item = hotComments[j]
    //   let user = item.user
    //   let beReplied = item.beReplied && item.beReplied[0] || { id: null, userId: null, userType: null, nickname: '', avatar: '', content: '' }
    //   try {
    //     await app.mysql.query(`INSERT INTO music_hotcomments (id, content, time, likedCount, userId, userType, nickname, avatar, beRepliedId, beRepliedUserId, 
    //       beRepliedUserType, beRepliedNickname, beRepliedAvatar, beRepliedContent, songId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
    //         item.commentId, filteremoji(item.content), item.time, item.likedCount, user.userId, user.userType, user.nickname, user.avatarUrl, beReplied.id,
    //         beReplied.userId, beReplied.userType, beReplied.nickname, beReplied.avatar, filteremoji(beReplied.content), songId
    //       ])
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    ctx.body = { hotComments }
  }

  // 评论
  async getComments() {
    const { ctx, app } = this
    const { songId, pageNo = 1, pageSize = 20 } = ctx.request.query
    let comments = await API.getComments(songId, pageNo, pageSize, 3)
    ctx.body = { comments }
  }

  // 评论总数
  async getCommentCount() {
    const { ctx, app } = this
    let songs = await app.mysql.query(`SELECT * FROM music_songs`)
    let start = 0, startTime = Date.now()
    for (let i = start, len = songs.length; i < len; i++) {
      let endTime = Date.now()
      console.log(len, i, utils.dateFormat(startTime, 'hh:mm'), utils.dateFormat(endTime, 'hh:mm'))
      let song = songs[i]
      if (song.commentCount !== null) continue
      let count = await API.getCommentCount(song.id)
      await app.mysql.query(`UPDATE music_songs SET commentCount = ? WHERE id = ?`, [count, song.id])

      let hotComments = await API.getComments(song.id, 1, 20, 2)

      for (let j = 0; j < hotComments.length; j++) {
        let item = hotComments[j]
        let user = item.user
        let beReplied = item.beReplied && item.beReplied[0] || { id: null, userId: null, userType: null, nickname: '', avatar: '', content: '' }
        if (item.likedCount < 1000) continue
        try {
          await app.mysql.query(`INSERT INTO music_hotcomments (id, content, time, likedCount, userId, userType, nickname, avatar, beRepliedId, beRepliedUserId, 
            beRepliedUserType, beRepliedNickname, beRepliedAvatar, beRepliedContent, songId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
              item.commentId, filteremoji(item.content), item.time, item.likedCount, user.userId, user.userType, user.nickname, user.avatarUrl, beReplied.id,
              beReplied.userId, beReplied.userType, beReplied.nickname, beReplied.avatar, filteremoji(beReplied.content), song.id
            ])
        } catch (error) {
          try {
            if (error.sqlMessage.indexOf('Incorrect string value') !== -1) {
              await app.mysql.query(`INSERT INTO music_hotcomments (id, content, time, likedCount, userId, userType, nickname, avatar, beRepliedId, beRepliedUserId, 
                beRepliedUserType, beRepliedNickname, beRepliedAvatar, beRepliedContent, songId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                  item.commentId, encodeURIComponent(filteremoji(item.content)), item.time, item.likedCount, user.userId, user.userType, user.nickname, user.avatarUrl, beReplied.id,
                  beReplied.userId, beReplied.userType, beReplied.nickname, beReplied.avatar, encodeURIComponent(filteremoji(beReplied.content)), song.id
                ])
            }
          } catch (err) {
            console.log('err: ', err, error)
          }
        }
      }
    }
    ctx.body = 'ok'
  }
}

// 过滤 Emoji
function filteremoji(str){
  var ranges = [
      '\ud83c[\udf00-\udfff]', 
      '\ud83d[\udc00-\ude4f]', 
      '\ud83d[\ude80-\udeff]'
  ]
  return str.replace(new RegExp(ranges.join('|'), 'g'), '')
}

module.exports = HomeController
