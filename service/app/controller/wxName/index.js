'use strict';
const path = require('path')
const fs = require('fs')
const filePath = path.join(__dirname, '../../../../article/proname')

const Controller = require('egg').Controller;

class HomeController extends Controller {
  /**
   * 获取名称列表
   */
  async getNameList() {
    const { ctx, app } = this;
    const { pageNo = 1, pageSize = 20 } = ctx.request.body
    // 男生，女生名，不包含英文名
    const where = 'WHERE (used = 0 OR used = 1) AND enor = 0 AND off != 1'
    const count = await app.mysql.query(`SELECT COUNT(*) as count FROM name_word ${where}`)
    const nameList = await app.mysql.query(`SELECT * FROM name_word ${where} ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)

    ctx.body = { data: nameList, count: count[0].count };
  }

  /**
   * 获取姓氏起源列表
   */
  async getSurnameList() {
    const { ctx, app } = this;
    const { pageNo = 1, pageSize = 10, condition = '' } = ctx.request.body
    // 姓氏起源
    const where = `WHERE a.title LIKE '%姓氏起源%' AND ${condition === '' ? true : `(a.title LIKE '%${condition}%' OR a.summary LIKE '%${condition}%')`}`
    const res = await app.mysql.query(`SELECT a.*, t.name as tagm FROM name_article a, name_tag t ${where} AND a.tag = t.id AND a.off != 1 ORDER BY a.createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
    const count = (await app.mysql.query(`SELECT COUNT(*) as count FROM name_article a ${where} AND off != 1`)) || [{ count: 0 }]
    
    ctx.body = { data: res, count: count[0].count }
  }

  /**
   * 获取诗文列表
   */
  async getWxArticle() {
    const { ctx, app } = this
    const { pageNo = 1, pageSize = 10, tab, condition = '' } = ctx.request.body
    let res, where, count
    switch (tab) {
      case 0:
        // 古诗文
        where = `WHERE ${condition === '' ? true : `title LIKE '%${condition}%' OR author LIKE '%${condition}%' OR verse LIKE '%${condition}%'`}`
        res = await app.mysql.query(`SELECT * FROM name_poetry ${where} AND off != 1 ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
        count = (await app.mysql.query(`SELECT COUNT(*) as count FROM name_poetry ${where} AND off != 1`)) || [{ count: 0 }]
        break
      case 1:
        // 姓氏起源
        where = `WHERE title LIKE '%姓氏起源%' AND ${condition === '' ? true : `title LIKE '%${condition}%' OR summary LIKE '%${condition}%'`}`
        res = await app.mysql.query(`SELECT * FROM name_article ${where} AND off != 1 ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
        count = (await app.mysql.query(`SELECT COUNT(*) as count FROM name_article ${where} AND off != 1`)) || [{ count: 0 }]
        break
      case 2:
        // 其他文章
        where = `WHERE title NOT LIKE '%姓氏起源%' AND ${condition === '' ? true : `title LIKE '%${condition}%' OR summary LIKE '%${condition}%'`}`
        res = await app.mysql.query(`SELECT * FROM name_article ${where} AND off != 1 ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
        count = (await app.mysql.query(`SELECT COUNT(*) as count FROM name_article ${where} AND off != 1`)) || [{ count: 0 }]
        break
    }
    ctx.body = { data: res, count: count[0].count }
  }

  /**
   * 读取文章内容
   */
  async getArticleFile() {
    const { ctx, app } = this
    let { title, id, tab } = ctx.request.body
    let poetry, article
    if (title.indexOf('/') !== -1) {
      title = title.replace(/\//g, '^')
    }
    if (tab === '0') {
      poetry = (await app.mysql.query(`SELECT * FROM name_poetry WHERE id = ? AND off != 1`, [id]))[0]
      try {
        article = fs.readFileSync(path.join(filePath, `古诗词_${title}.html`), 'utf-8')
      } catch (err) {
        article = ''
      }
    } else {
      try {
        article = fs.readFileSync(path.join(filePath, `${title}.html`), 'utf-8')
      } catch (err) {
        article = ''
      }
    }
    ctx.body = { poetry, article }
  }
}

module.exports = HomeController;
