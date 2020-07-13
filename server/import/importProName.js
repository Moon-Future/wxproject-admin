const query = require('../database/init')
const path = require('path')
const fs = require('fs')
const shortid = require('shortid')
const { dateFormat } = require('../api/util.js')

// 导入汉字
async function importChinese() {
  const filename = 'chinese.json'
  let filecontent = JSON.parse(fs.readFileSync(path.join(__dirname, filename), 'utf-8'))
  let startTime = new Date()
  for (let i = 0, len = filecontent.length; i < len; i++) {
    let id = shortid()
    let obj = filecontent[i]
    obj.p = obj.p.filter(ele => {
      return isNaN(Number(ele))
    })
    console.log(
      `共【${len}】条数据，正在导入第【${i + 1}，${obj.c}】条，还剩【${len - i - 1}】条，用时【${dateFormat(startTime, 'hh:mm')}，${(Date.now() -
        startTime) /
        1000} s】`
    )
    await query(`INSERT INTO name_chinese (id, chinese, pronounce, stroke, surname, attr, createtime) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
      id,
      obj.c,
      obj.p.join(','),
      obj.s,
      obj.x,
      obj.attr || '',
      Date.now()
    ])
  }
}

// 导入诗词
async function importPoetry() {
  let fileArr = [
    {
      url: 'https://so.gushiwen.cn/gushi/tangshi.aspx',
      title: '唐诗三百首',
      filename: 'tangshi300.txt'
    },
    {
      url: 'https://so.gushiwen.cn/gushi/sanbai.aspx',
      title: '古诗三百首',
      filename: 'gushi300.txt'
    },
    {
      url: 'https://so.gushiwen.cn/gushi/songsan.aspx',
      title: '宋词三百首',
      filename: 'songci300.txt'
    },
    {
      url: 'https://so.gushiwen.cn/gushi/songci.aspx',
      title: '宋词精选',
      filename: 'songcijx.txt'
    },
    {
      url: 'https://so.gushiwen.cn/gushi/shijiu.aspx',
      title: '古诗十九首',
      filename: 'gushi19.txt'
    },
    {
      url: 'https://so.gushiwen.cn/gushi/shijing.aspx',
      title: '诗经',
      filename: 'shijing.txt'
    },
    {
      url: 'https://so.gushiwen.cn/gushi/chuci.aspx',
      title: '楚辞',
      filename: 'chuci.txt'
    }
  ]
  let duplObj = {}
  for (let i = 0; i < fileArr.length; i++) {
    let filename = fileArr[i].filename
    let filecontent = JSON.parse(fs.readFileSync(path.join(__dirname, filename), 'utf-8'))
    let startTime = new Date()
    for (let j = 0, len = filecontent.length; j < len; j++) {
      if (duplObj[filecontent[j].t]) {
        continue
      }
      duplObj[filecontent[j].t] = filecontent[j].t
      let obj = filecontent[j]
      let id = shortid()
      obj.c = obj.c
        .replace(/<br>/g, '\n')
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '')
        .trim()
      console.log(
        `共【${len}, ${filename}】条数据，正在导入第【${j + 1}, ${len - j - 1}】条，用时【${dateFormat(startTime, 'hh:mm')}，${(Date.now() -
          startTime) /
          1000} s】`
      )
      await query(`INSERT INTO name_poetry (id, title, author, dynasty, verse, createtime) VALUES (?, ?, ?, ?, ?, ?)`, [
        id,
        obj.t,
        obj.a,
        obj.d,
        obj.c,
        Date.now()
      ])
    }
  }
  console.log(duplObj)
}

// importPoetry()
