'use strict';
const shortid = require('shortid')
const path = require('path')
const fs = require('fs')
const filePath = path.join(__dirname, '../../../../article/proname')

const Controller = require('egg').Controller;

class HomeController extends Controller {
  // 获取汉字
  async getChinese() {
    const { ctx, app } = this
    try {
      let { pageNo = 1, pageSize = 20, chinese = '', attr = '', surname = '' } = ctx.request.body
      let where = `WHERE ${chinese === '' ? true : 'chinese = ?'} AND ${attr === '' ? true : 'attr = ?'} AND ${surname === '' ? true : 'surname = ?'}`
      let arr = [chinese, attr, surname].filter(ele => {
        return ele !== ''
      })
      let count = await app.mysql.query(`SELECT COUNT(*) as count FROM name_chinese ${where} AND off != 1`, arr)
      let res = await app.mysql.query(
        `SELECT * FROM name_chinese ${where} AND off != 1 ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`,
        arr
      )
      ctx.body = { data: res, count: count[0].count }
    } catch (err) {
      throw new Error(err)
    }
  }

  // 新增汉字
  async addChinese() {
    const { ctx, app } = this
    try {
      let { chinese, pronounce, stroke, attr, surname, id = '' } = ctx.request.body
      if (id !== '') {
        // 更新
        await app.mysql.query(`UPDATE name_chinese SET pronounce = ?, stroke = ?, attr = ?, surname = ? WHERE id = ?`, [pronounce, stroke, attr, surname, id])
        ctx.body = { message: '更新成功' }
        return
      }
      let res = await app.mysql.query(`SELECT * FROM name_chinese WHERE chinese = ?`, [chinese])
      if (res.length !== 0) {
        ctx.status = 400
        ctx.body = { message: '已存在相同数据' }
        return
      }
      await app.mysql.query(`INSERT INTO name_chinese (id, chinese, pronounce, stroke, attr, surname, createtime) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        shortid(),
        chinese,
        pronounce,
        stroke,
        attr,
        surname,
        Date.now()
      ])
      ctx.body = { message: '添加成功' }
    } catch (err) {
      throw new Error(err)
    }
  }

  // 删除汉字
  async delChinese() {
    const { ctx, app } = this
    try {
      let { id } = ctx.request.body
      await app.mysql.query(`UPDATE name_chinese SET off = 1 WHERE id = ?`, [id])
      ctx.body = { message: '删除成功' }
    } catch (err) {
      throw new Error(err)
    }
  }

  // 获取词组
  async getWord() {
    const { ctx, app } = this
    try {
      let { pageNo = 1, pageSize = 20, word = '', author = '', poetry = '', used = '', enor = '' } = ctx.request.body
      let where = `WHERE ${word === '' ? true : `word LIKE '%${word}%'`} AND ${author === '' ? true : `author LIKE '%${author}%'`} AND ${
        poetry === '' ? true : `poetry LIKE '%${poetry}%'`
      } AND ${used === '' ? true : `used LIKE '%${used}%'`} AND ${enor === '' ? true : `enor LIKE '%${enor}%'`}`
      let count = await app.mysql.query(`SELECT COUNT(*) as count FROM name_word ${where} AND off != 1`)
      let res = await app.mysql.query(`SELECT * FROM name_word ${where} AND off != 1 ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
      ctx.body = { data: res, count: count[0].count }
    } catch (err) {
      throw new Error(err)
    }
  }

  // 新增、更新词组
  async addWord() {
    const { ctx, app } = this
    try {
      let { word, mean, feature, source, author, dynasty, poetry, likes, used, enor, id = '' } = ctx.request.body
      author = author === '' ? '佚名' : author
      if (id !== '') {
        // 更新
        await app.mysql.query(
          `UPDATE name_word SET mean = ?, feature = ?, source = ?, author = ?, dynasty = ?, poetry = ?, likes = ?, used = ?, enor = ? WHERE id = ?`,
          [mean, feature, source, author, dynasty, poetry, likes, used, enor, id]
        )
        ctx.body = { message: '更新成功' }
        return
      }
      let res = await app.mysql.query(`SELECT * FROM name_word WHERE word = ?`, [word])
      if (res.length !== 0) {
        ctx.status = 400
        ctx.body = { message: '已存在相同数据' }
        return
      }
      await app.mysql.query(
        `INSERT INTO name_word (id, word, mean, feature, source, author, dynasty, poetry, likes, used, enor, length, createtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [shortid(), word, mean, feature, source, author, dynasty, poetry, likes, used, enor, word.length, Date.now()]
      )
      ctx.body = { message: '添加成功' }
    } catch (err) {
      throw new Error(err)
    }
  }

  // 删除词组
  async delWord() {
    const { ctx, app } = this
    try {
      let { id } = ctx.request.body
      await app.mysql.query(`UPDATE name_word SET off = 1 WHERE id = ?`, [id])
      ctx.body = { message: '删除成功' }
    } catch (err) {
      throw new Error(err)
    }
  }

  // 获取诗词
  async getPoetry() {
    const { ctx, app } = this
    try {
      let { pageNo = 1, pageSize = 20, title = '', author = '', verse = '' } = ctx.request.body
      let where = `WHERE ${title === '' ? true : `title LIKE '%${title}%'`} AND ${author === '' ? true : `author LIKE '%${author}%'`} AND ${
        verse === '' ? true : `verse LIKE '%${verse}%'`
      }`
      let count = await app.mysql.query(`SELECT COUNT(*) as count FROM name_poetry ${where} AND off != 1`)
      let res = await app.mysql.query(`SELECT * FROM name_poetry ${where} AND off != 1 ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
      ctx.body = { data: res, count: count[0].count }
    } catch (err) {
      throw new Error(err)
    }
  }

  // 新增诗词
  async addPoetry() {
    const { ctx, app } = this
    try {
      let { title, author, dynasty, verse, id = '' } = ctx.request.body
      author = author === '' ? '佚名' : author
      if (id !== '') {
        // 更新
        await app.mysql.query(`UPDATE name_poetry SET title = ?, author = ?, dynasty = ?, verse = ? WHERE id = ?`, [title, author, dynasty, verse, id])
        ctx.body = { message: '更新成功' }
        return
      }
      let res = await app.mysql.query(`SELECT * FROM name_poetry WHERE title = ?`, [title])
      if (res.length !== 0) {
        ctx.status = 400
        ctx.body = { message: '已存在相同数据' }
        return
      }
      await app.mysql.query(`INSERT INTO name_poetry (id, title, author, dynasty, verse, createtime) VALUES (?, ?, ?, ?, ?, ?)`, [
        shortid(),
        title,
        author,
        dynasty,
        verse,
        Date.now()
      ])
      ctx.body = { message: '添加成功' }
    } catch (err) {
      throw new Error(err)
    }
  }

  // 删除诗词
  async delPoetry() {
    const { ctx, app } = this
    try {
      let { id } = ctx.request.body
      await app.mysql.query(`UPDATE name_poetry SET off = 1 WHERE id = ?`, [id])
      ctx.body = { message: '删除成功' }
    } catch (err) {
      throw new Error(err)
    }
  }

  // 获取文章标签
  async getTag() {
    const { ctx, app } = this
    try {
      let res = await app.mysql.query(`SELECT * FROM name_tag WHERE off != 1 ORDER BY ork ASC`)
      ctx.body = { data: res }
    } catch (err) {
      throw new Error(err)
    }
  }

  // 获取文章
  async getArticle() {
    const { ctx, app } = this
    try {
      let { pageNo = 1, pageSize = 20, title = '', tag = '' } = ctx.request.body
      let where = `WHERE ${title === '' ? true : `title LIKE '%${title}%'`} AND ${tag === '' ? true : `tag = ${tag}`}`
      let count = await app.mysql.query(`SELECT COUNT(*) as count FROM name_article ${where} AND off != 1`)
      let res = await app.mysql.query(
        `SELECT a.*, t.name as tagm FROM name_article a, name_tag t ${where} AND a.tag = t.id AND a.off != 1 ORDER BY createtime ASC LIMIT ${(pageNo -
          1) *
          pageSize}, ${pageSize}`
      )
      ctx.body = { data: res, count: count[0].count }
    } catch (err) {
      throw new Error(err)
    }
  }

  // 新增文章
  async addArticle() {
    const { ctx, app } = this
    try {
      let { title, author, summary, tag, img, date, content, id = '' } = ctx.request.body
      tag = tag === '' ? '-1' : tag
      author = author === '' ? '取名通' : author
      date = date ? new Date(date).getTime() : new Date().getTime()
      if (id !== '') {
        // 更新
        await app.mysql.query(`UPDATE name_article SET title = ?, author = ?, summary = ?, tag = ?, img = ?, date = ? WHERE id = ?`, [
          title,
          author,
          summary,
          tag,
          img,
          date,
          id
        ])
        writeFile(content, title)
        ctx.body = { message: '更新成功' }
        return
      }
      let res = await app.mysql.query(`SELECT * FROM name_article WHERE title = ? AND off != 1`, [title])
      if (res.length !== 0) {
        ctx.status = 400
        ctx.body = { message: '已存在相同数据' }
        return
      }
      await app.mysql.query(`INSERT INTO name_article (id, title, author, summary, tag, img, date, createtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
        shortid(),
        title,
        author,
        summary,
        tag,
        img,
        date,
        Date.now()
      ])
      writeFile(content, title)
      ctx.body = { message: '添加成功' }
    } catch (err) {
      throw new Error(err)
    }
  }

  // 删除文章
  async delArticle() {
    const { ctx, app } = this
    try {
      let { id } = ctx.request.body
      let res = await app.mysql.query(`SELECT * FROM name_article WHERE id = ?`, [id])
      let { title, id: articleId } = res[0]
      await app.mysql.query(`UPDATE name_article SET off = 1 WHERE id = ?`, [id])
      try {
        fs.renameSync(path.join(filePath, `${title}.html`), path.join(filePath, `off_${title}_${articleId}.html`))
      } catch (err) {
        console.log(err)
      }
      ctx.body = { message: '删除成功' }
    } catch (err) {
      throw new Error(err)
    }
  }

  // 读取文章内容
  async getArticleFile() {
    const { ctx, app } = this
    try {
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
        article = fs.readFileSync(path.join(filePath, `${title}.html`), 'utf-8')
      }
      ctx.body = { poetry, article }
    } catch (err) {
      ctx.body = { article: '' }
    }
  }
}

function writeFile(content, filename) {
  fs.writeFileSync(path.join(filePath, `${filename}.html`), content, 'utf-8')
}

module.exports = HomeController;
