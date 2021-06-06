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
    let obj = {}

    const artists = await app.mysql.query(`SELECT * FROM music_artist`)
    const songsResult = await app.mysql.query(`SELECT * FROM music_songs`)
    songsResult.forEach(item => {
      obj[item.id] = true
    })

    // let start = 0, offset = 1104, artist = 104700
    // INSERT INTO music_songs (uuid, id, name, artistId, artistName) VALUES 
    // ('3j_28SBY9zP', 1403732627, 'Joseph Megamix (Jacob And Sons-any Dream Will Do- Joseph\'s 
    // Coat -Pharaoh\'s Story-One More Angel In Heaven-Benjamin\'s Calypso-Close Every Door On 
    // Me-Brothers Came To Egypt (Instrumental version originally performed by From Joseph And
    //    The Amazing Technicolor', '104700', 'Various Artists')

    for (let i = 257, len = artists.length; i < len; i++) {
      offset = 0
      let artist = artists[i].id, artistm = artists[i].name
      let artistId = '', artistsName = ''
      let songData = await API.getSongs(artist, limit, offset * limit)
      let songs = songData.songs, more = songData.more
      for (let j = 0; j < songs.length; j++) {
        let item = songs[j]
        if (obj[item.id]) continue
        obj[item.id] = true
        artistId = item.ar.map(item => { return item.id } ).join('/')
        artistsName = item.ar.map(item => { return item.name } ).join('/')
        if (item.ar.length >= 10 || artistsName.length >= 50 || artistId.length >= 50) {
          artistId = '122455'
          artistsName = '群星'
        }
        await app.mysql.query(`INSERT INTO music_songs (uuid, id, name, artistId, artistName) VALUES (?, ?, ?, ?, ?)`, [
          shortid(), item.id, item.name, artistId, artistsName
        ])
      }
      
      console.log('*********', offset, i, len, artist, artistm)
      while(more) {
        offset++
        console.log('*********', offset, i, len, artist, artistm)
        songData = await API.getSongs(artist, limit, offset * limit)
        songs = songData.songs
        more = songData.more
        for (let j = 0; j < songs.length; j++) {
          let item = songs[j]
          if (obj[item.id]) continue
          obj[item.id] = true
          artistId = item.ar.map(item => { return item.id } ).join('/')
          artistsName = item.ar.map(item => { return item.name } ).join('/')
          if (item.ar.length >= 10 || artistsName.length >= 50 || artistId.length >= 50) {
            artistId = '122455'
            artistsName = '群星'
          }
          await app.mysql.query(`INSERT INTO music_songs (uuid, id, name, artistId, artistName) VALUES (?, ?, ?, ?, ?)`, [
            shortid(), item.id, item.name, artistId, artistsName
          ])
        }
      }
    }

    ctx.body = 'ok'
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
    let start = 223951, startTime = Date.now()
    for (let i = start, len = songs.length; i < len; i++) {
      let endTime = Date.now()
      console.log(len, i, utils.dateFormat(startTime, 'hh:mm'), utils.dateFormat(endTime, 'hh:mm'))
      let song = songs[i]
      if (song.commentCount !== null) continue
      let count = await API.getCommentCount(song.id)
      await app.mysql.query(`UPDATE music_songs SET commentCount = ? WHERE id = ?`, [count, song.id])

      // let hotComments = await API.getComments(song.id, 1, 20, 2)

      // for (let j = 0; j < hotComments.length; j++) {
      //   let item = hotComments[j]
      //   let user = item.user
      //   let beReplied = item.beReplied && item.beReplied[0] || { id: null, userId: null, userType: null, nickname: '', avatar: '', content: '' }
      //   if (item.likedCount < 1000) continue
      //   try {
      //     await app.mysql.query(`INSERT INTO music_hotcomments (id, content, time, likedCount, userId, userType, nickname, avatar, beRepliedId, beRepliedUserId, 
      //       beRepliedUserType, beRepliedNickname, beRepliedAvatar, beRepliedContent, songId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      //         item.commentId, filteremoji(item.content), item.time, item.likedCount, user.userId, user.userType, user.nickname, user.avatarUrl, beReplied.id,
      //         beReplied.userId, beReplied.userType, beReplied.nickname, beReplied.avatar, filteremoji(beReplied.content), song.id
      //       ])
      //   } catch (error) {
      //     try {
      //       if (error.sqlMessage.indexOf('Incorrect string value') !== -1) {
      //         await app.mysql.query(`INSERT INTO music_hotcomments (id, content, time, likedCount, userId, userType, nickname, avatar, beRepliedId, beRepliedUserId, 
      //           beRepliedUserType, beRepliedNickname, beRepliedAvatar, beRepliedContent, songId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      //             item.commentId, encodeURIComponent(filteremoji(item.content)), item.time, item.likedCount, user.userId, user.userType, user.nickname, user.avatarUrl, beReplied.id,
      //             beReplied.userId, beReplied.userType, beReplied.nickname, beReplied.avatar, encodeURIComponent(filteremoji(beReplied.content)), song.id
      //           ])
      //       }
      //     } catch (err) {
      //       console.log('err: ', err, error)
      //     }
      //   }
      // }
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
