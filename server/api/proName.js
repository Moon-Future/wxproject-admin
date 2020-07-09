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
    ctx.body = {}
  } catch (err) {
    throw new Error(err)
  }
})

// 新增词组
router.post('/addWord', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    const { word, mean, feature, from, author, poetry, like } = ctx.request.body
    await query(`INSERT INTO word (id, word, mean, feature, from, author, poetry, like) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
      shortid(),
      word,
      mean,
      feature,
      from,
      author,
      poetry,
      like
    ])
    ctx.body = { message: '添加成功' }
  } catch (err) {
    throw new Error(err)
  }
})

module.exports = router
