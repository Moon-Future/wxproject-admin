const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')
const { dateFormat } = require('./util')
const dateMap = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六'
}

router.get('/getLottery', async ctx => {
  try {
    let { pageNo = 1, pageSize = 20, word = '', author = '', poetry = '', used = '', enor = '' } = ctx.request.query
    let where = `WHERE ${word === '' ? true : `word LIKE '%${word}%'`} AND ${author === '' ? true : `author LIKE '%${author}%'`} AND ${
      poetry === '' ? true : `poetry LIKE '%${poetry}%'`
    } AND ${used === '' ? true : `used LIKE '%${used}%'`} AND ${enor === '' ? true : `enor LIKE '%${enor}%'`}`
    let count = await query(`SELECT COUNT(*) as count FROM name_word ${where} AND off != 1`)
    let res = await query(`SELECT * FROM name_word ${where} AND off != 1 ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
    ctx.body = { data: res, count: count[0].count }
  } catch (err) {
    throw new Error(err)
  }
})

router.post('/addLottery', async ctx => {
  try {
    let { data, date, type } = ctx.request.body
    for (let i = 0, len = data.length; i < len; i++) {
      let item = data[i]
      let red = item.red.join(',')
      let blue = item.blue.join(',')
      let price = 2
      date = new Date(date)
      await query(`INSERT INTO lottery (id, red, blue, price, type, date, createtime) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        shortid(),
        red,
        blue,
        price,
        type,
        `${dateFormat(date, 'yyyy-MM-dd')} 星期${dateMap[date.getDay()]}`,
        Date.now()
      ])
    }
    ctx.body = { message: '添加成功' }
  } catch (err) {
    throw new Error(err)
  }
})

router.post('/delLottery', async ctx => {
  try {
    let { pageNo = 1, pageSize = 20, word = '', author = '', poetry = '', used = '', enor = '' } = ctx.request.query
    let where = `WHERE ${word === '' ? true : `word LIKE '%${word}%'`} AND ${author === '' ? true : `author LIKE '%${author}%'`} AND ${
      poetry === '' ? true : `poetry LIKE '%${poetry}%'`
    } AND ${used === '' ? true : `used LIKE '%${used}%'`} AND ${enor === '' ? true : `enor LIKE '%${enor}%'`}`
    let count = await query(`SELECT COUNT(*) as count FROM name_word ${where} AND off != 1`)
    let res = await query(`SELECT * FROM name_word ${where} AND off != 1 ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
    ctx.body = { data: res, count: count[0].count }
  } catch (err) {
    throw new Error(err)
  }
})

module.exports = router
