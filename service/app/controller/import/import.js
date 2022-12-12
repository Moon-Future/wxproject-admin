'use strict';
const path = require('path')
const fs = require('fs')
const filePath = path.join(__dirname, '../../../../import')
const shortid = require('shortid')

const Controller = require('egg').Controller;

class HomeController extends Controller {
  /**
   * 诗经
   */
  async shijing() {
    const { ctx, app } = this;
    let content1 = fs.readFileSync(path.join(filePath, 'shijing.txt'), 'utf-8')
    content1 = JSON.parse(content1)

    let result = []
    for (let i = 0, len = content1.length; i < len; i++) {
      let { t, d, a, c } = content1[i]
      let res = await app.mysql.select('name_poetry', {
        where: { title: t, dynasty: d, author: a, verse: c }
      })
      
      if (res && !res[0]) {
        console.log(t, d, a, res)
        await app.mysql.insert('name_poetry', { id: shortid(), title: t, dynasty: d, author: a, type: '诗经', verse: c, createtime: Date.now() })
      } else {
        await app.mysql.update('name_poetry', { id: res[0].id, type: '诗经' })
        result.push(res[0])
      }
    }
    console.log(content1.length, result.length)

    ctx.body = result;
  }

  /**
   * 楚辞
   */
  async chuci() {
    const { ctx, app } = this;
    let content1 = fs.readFileSync(path.join(filePath, 'chuci.txt'), 'utf-8')
    content1 = JSON.parse(content1)

    let result = []
    for (let i = 0, len = content1.length; i < len; i++) {
      let { t, d, a, c } = content1[i]
      let res = await app.mysql.select('name_poetry', {
        where: { title: t, dynasty: d, author: a, verse: c }
      })
      
      if (res && !res[0]) {
        console.log(t, d, a, res)
        await app.mysql.insert('name_poetry', { id: shortid(), title: t, dynasty: d, author: a, type: '楚辞', verse: c, createtime: Date.now() })
      } else {
        await app.mysql.update('name_poetry', { id: res[0].id, type: '楚辞' })
        result.push(res[0])
      }
      
    }
    console.log(content1.length, result.length)

    ctx.body = result;
  }

  /**
   * 唐诗
   */
  async tangshi() {
    const { ctx, app } = this;
    let content1 = fs.readFileSync(path.join(filePath, 'tangshi300.txt'), 'utf-8')
    content1 = JSON.parse(content1)

    let result = []
    for (let i = 0, len = content1.length; i < len; i++) {
      let { t, d, a, c } = content1[i]
      let res = await app.mysql.select('name_poetry', {
        where: { title: t, dynasty: d, author: a, verse: c }
      })
      
      if (res && !res[0]) {
        console.log(t, d, a, res)
        await app.mysql.insert('name_poetry', { id: shortid(), title: t, dynasty: d, author: a, type: '唐诗', verse: c, createtime: Date.now() })
      } else {
        await app.mysql.update('name_poetry', { id: res[0].id, type: '唐诗' })
        result.push(res[0])
      }
      
    }
    console.log(content1.length, result.length)

    ctx.body = result;
  }

  /**
   * 宋词
   */
  async songci() {
    const { ctx, app } = this;
    let content1 = fs.readFileSync(path.join(filePath, 'songci300.txt'), 'utf-8')
    let content2 = fs.readFileSync(path.join(filePath, 'songcijx.txt'), 'utf-8')
    content1 = JSON.parse(content1)
    content2 = JSON.parse(content2)
    content1 = content1.concat(content2)

    let result = [], obj = []
    for (let i = 0, len = content1.length; i < len; i++) {
      let { t, d, a, c } = content1[i]
      let key = `${t}_${d}_${a}_${c}`
      let res = await app.mysql.select('name_poetry', {
        where: { title: t, dynasty: d, author: a, verse: c }
      })
      if (obj[key]) {
        console.log(obj[key])
      } else {
        obj[key] = { t, d, a, c }
      }
      
      if (res && !res[0]) {
        console.log(t, d, a, res)
        await app.mysql.insert('name_poetry', { id: shortid(), title: t, dynasty: d, author: a, type: '宋词', verse: c, createtime: Date.now() })
      } else {
        await app.mysql.update('name_poetry', { id: res[0].id, type: '宋词' })
        result.push(res[0])
      }
      
    }
    console.log(content1.length, result.length)

    ctx.body = result;
  }

  /**
   * 古诗
   */
  async gushi() {
    const { ctx, app } = this;
    let content1 = fs.readFileSync(path.join(filePath, 'gushi19.txt'), 'utf-8')
    let content2 = fs.readFileSync(path.join(filePath, 'gushi300.txt'), 'utf-8')
    content1 = JSON.parse(content1)
    content2 = JSON.parse(content2)
    content1 = content1.concat(content2)

    let result = [], obj = []
    for (let i = 0, len = content1.length; i < len; i++) {
      let { t, d, a, c } = content1[i]
      let key = `${t}_${d}_${a}_${c}`
      let res = await app.mysql.select('name_poetry', {
        where: { title: t, dynasty: d, author: a, verse: c }
      })
      // if (obj[key]) {
      //   console.log(obj[key])
      // } else {
      //   obj[key] = { t, d, a, c }
      // }
      
      if (res && !res[0]) {
        console.log(t, d, a, res)
        await app.mysql.insert('name_poetry', { id: shortid(), title: t, dynasty: d, author: a, type: '古诗', verse: c, createtime: Date.now() })
      } else {
        await app.mysql.update('name_poetry', { id: res[0].id, type: '古诗' })
        result.push(res[0])
      }
      
    }
    console.log(content1.length, result.length)

    ctx.body = result;
  }
}

module.exports = HomeController;
