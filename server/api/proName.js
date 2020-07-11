const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')
const { checkToken } = require('./util')

// 获取词组
router.get('/getWord', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    let { pageNo = 1, pageSize = 20, word = '', author = '', poetry = '', use = '' } = ctx.request.query
    let where = `WHERE ${word === '' ? true : `word LIKE '%${word}%'`} AND ${author === '' ? true : `author LIKE '%${author}%'`} AND ${
      poetry === '' ? true : `poetry LIKE '%${poetry}%'`
    } AND ${use === '' ? true : `use = ${use}`}`
    let count = await query(`SELECT COUNT(*) as count FROM name_word ${where} AND off != 1`)
    let res = await query(`SELECT * FROM name_word ${where} AND off != 1 ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
    ctx.body = { data: res, count: count[0].count }
  } catch (err) {
    throw new Error(err)
  }
})

// 新增、更新词组
router.post('/addWord', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    let { word, mean, feature, source, author, dynasty, poetry, likes, used, id = '' } = ctx.request.body
    author = author === '' ? '佚名' : author
    if (id !== '') {
      // 更新
      await query(`UPDATE name_word SET mean = ?, feature = ?, source = ?, author = ?, dynasty = ?, poetry = ?, likes = ?, used = ? WHERE id = ?`, [
        mean,
        feature,
        source,
        author,
        dynasty,
        poetry,
        likes,
        used,
        id
      ])
      ctx.body = { message: '更新成功' }
      return
    }
    let res = await query(`SELECT * FROM name_word WHERE word = ?`, [word])
    if (res.length !== 0) {
      ctx.status = 400
      ctx.body = { message: '已存在相同数据' }
      return
    }
    await query(
      `INSERT INTO name_word (id, word, mean, feature, source, author, dynasty, poetry, likes, used, createtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [shortid(), word, mean, feature, source, author, dynasty, poetry, likes, used, Date.now()]
    )
    ctx.body = { message: '添加成功' }
  } catch (err) {
    throw new Error(err)
  }
})

// 删除汉字
router.post('/delWord', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    let { id } = ctx.request.body
    await query(`UPDATE name_word SET off = 1 WHERE id = ?`, [id])
    ctx.body = { message: '删除成功' }
  } catch (err) {
    throw new Error(err)
  }
})

// 获取汉字
router.get('/getChinese', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    let { pageNo = 1, pageSize = 20, chinese = '', attr = '', surname = '' } = ctx.request.query
    let where = `WHERE ${chinese === '' ? true : 'chinese = ?'} AND ${attr === '' ? true : 'attr = ?'} AND ${surname === '' ? true : 'surname = ?'}`
    let arr = [chinese, attr, surname].filter(ele => {
      return ele !== ''
    })
    let count = await query(`SELECT COUNT(*) as count FROM name_chinese ${where} AND off != 1`, arr)
    let res = await query(
      `SELECT * FROM name_chinese ${where} AND off != 1 ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`,
      arr
    )
    ctx.body = { data: res, count: count[0].count }
  } catch (err) {
    throw new Error(err)
  }
})

// 新增汉字
router.post('/addChinese', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    let { chinese, pronounce, stroke, attr, surname, id = '' } = ctx.request.body
    if (id !== '') {
      // 更新
      await query(`UPDATE name_chinese SET pronounce = ?, stroke = ?, attr = ?, surname = ? WHERE id = ?`, [pronounce, stroke, attr, surname, id])
      ctx.body = { message: '更新成功' }
      return
    }
    let res = await query(`SELECT * FROM name_chinese WHERE chinese = ?`, [chinese])
    if (res.length !== 0) {
      ctx.status = 400
      ctx.body = { message: '已存在相同数据' }
      return
    }
    await query(`INSERT INTO name_chinese (id, chinese, pronounce, stroke, attr, surname, createtime) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
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
})

// 删除汉字
router.post('/delChinese', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    let { id } = ctx.request.body
    await query(`UPDATE name_chinese SET off = 1 WHERE id = ?`, [id])
    ctx.body = { message: '删除成功' }
  } catch (err) {
    throw new Error(err)
  }
})

// 获取诗词
router.get('/getPoetry', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    let { pageNo = 1, pageSize = 20, poetry = '', author = '', verse = '' } = ctx.request.query
    let where = `WHERE ${poetry === '' ? true : `poetry LIKE '%${poetry}%'`} AND ${author === '' ? true : `author LIKE '%${author}%'`} AND ${
      verse === '' ? true : `verse LIKE '%${verse}%'`
    }`
    let count = await query(`SELECT COUNT(*) as count FROM name_poetry ${where} AND off != 1`)
    let res = await query(`SELECT * FROM name_poetry ${where} AND off != 1 ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
    ctx.body = { data: res, count: count[0].count }
  } catch (err) {
    throw new Error(err)
  }
})

// 新增诗词
router.post('/addPoetry', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    let { poetry, author, dynasty, verse, id = '' } = ctx.request.body
    author = author === '' ? '佚名' : author
    if (id !== '') {
      // 更新
      await query(`UPDATE name_poetry SET poetry = ?, author = ?, dynasty = ?, verse = ? WHERE id = ?`, [poetry, author, dynasty, verse, id])
      ctx.body = { message: '更新成功' }
      return
    }
    let res = await query(`SELECT * FROM name_poetry WHERE poetry = ?`, [poetry])
    if (res.length !== 0) {
      ctx.status = 400
      ctx.body = { message: '已存在相同数据' }
      return
    }
    await query(`INSERT INTO name_poetry (id, poetry, author, dynasty, verse, createtime) VALUES (?, ?, ?, ?, ?, ?)`, [
      shortid(),
      poetry,
      author,
      dynasty,
      verse,
      Date.now()
    ])
    ctx.body = { message: '添加成功' }
  } catch (err) {
    throw new Error(err)
  }
})

// 删除诗词
router.post('/delPoetry', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    let { id } = ctx.request.body
    await query(`UPDATE name_poetry SET off = 1 WHERE id = ?`, [id])
    ctx.body = { message: '删除成功' }
  } catch (err) {
    throw new Error(err)
  }
})

module.exports = router
