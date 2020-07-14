const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')
const { checkToken, random } = require('./util')
const path = require('path')
const fs = require('fs')
let filePath = path.join(__dirname, '../../article/proname')

// 获取词组
router.get('/getWord', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    let { pageNo = 1, pageSize = 20, word = '', author = '', poetry = '', used = '' } = ctx.request.query
    let where = `WHERE ${word === '' ? true : `word LIKE '%${word}%'`} AND ${author === '' ? true : `author LIKE '%${author}%'`} AND ${
      poetry === '' ? true : `poetry LIKE '%${poetry}%'`
    } AND ${used === '' ? true : `used LIKE '%${used}%'`}`
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
      `INSERT INTO name_word (id, word, mean, feature, source, author, dynasty, poetry, likes, used, length, createtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [shortid(), word, mean, feature, source, author, dynasty, poetry, likes, used, word.length, Date.now()]
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
    let { pageNo = 1, pageSize = 20, title = '', author = '', verse = '' } = ctx.request.query
    let where = `WHERE ${title === '' ? true : `title LIKE '%${title}%'`} AND ${author === '' ? true : `author LIKE '%${author}%'`} AND ${
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
    let { title, author, dynasty, verse, id = '' } = ctx.request.body
    author = author === '' ? '佚名' : author
    if (id !== '') {
      // 更新
      await query(`UPDATE name_poetry SET title = ?, author = ?, dynasty = ?, verse = ? WHERE id = ?`, [title, author, dynasty, verse, id])
      ctx.body = { message: '更新成功' }
      return
    }
    let res = await query(`SELECT * FROM name_poetry WHERE title = ?`, [title])
    if (res.length !== 0) {
      ctx.status = 400
      ctx.body = { message: '已存在相同数据' }
      return
    }
    await query(`INSERT INTO name_poetry (id, title, author, dynasty, verse, createtime) VALUES (?, ?, ?, ?, ?, ?)`, [
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

// 获取文章标签
router.get('/getTag', async ctx => {
  try {
    let res = await query(`SELECT * FROM name_tag WHERE off != 1 ORDER BY ork ASC`)
    ctx.body = { data: res }
  } catch (err) {
    throw new Error(err)
  }
})

// 获取文章
router.get('/getArticle', async ctx => {
  try {
    let { pageNo = 1, pageSize = 20, title = '', tag = '' } = ctx.request.query
    let where = `WHERE ${title === '' ? true : `title LIKE '%${title}%'`} AND ${tag === '' ? true : `tag = ${tag}`}`
    let count = await query(`SELECT COUNT(*) as count FROM name_article ${where} AND off != 1`)
    let res = await query(
      `SELECT a.*, t.name as tagm FROM name_article a, name_tag t ${where} AND a.tag = t.id AND a.off != 1 ORDER BY createtime ASC LIMIT ${(pageNo -
        1) *
        pageSize}, ${pageSize}`
    )
    ctx.body = { data: res, count: count[0].count }
  } catch (err) {
    throw new Error(err)
  }
})

// 新增文章
router.post('/addArticle', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    let { title, author, summary, tag, img, date, content, id = '' } = ctx.request.body
    tag = tag === '' ? '-1' : tag
    author = author === '' ? '取名通' : author
    date = date ? new Date(date).getTime() : new Date().getTime()
    if (id !== '') {
      // 更新
      await query(`UPDATE name_article SET title = ?, author = ?, summary = ?, tag = ?, img = ?, date = ? WHERE id = ?`, [
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
    let res = await query(`SELECT * FROM name_article WHERE title = ?`, [title])
    if (res.length !== 0) {
      ctx.status = 400
      ctx.body = { message: '已存在相同数据' }
      return
    }
    await query(`INSERT INTO name_article (id, title, author, summary, tag, img, date, createtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
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
})

// 删除文章
router.post('/delArticle', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    let { id } = ctx.request.body
    let res = await query(`SELECT * FROM name_article WHERE id = ?`, [id])
    let title = res[0].title
    await query(`UPDATE name_article SET off = 1 WHERE id = ?`, [id])
    fs.renameSync(path.join(filePath, `${title}.html`), path.join(filePath, `off_${title}.html`))
    ctx.body = { message: '删除成功' }
  } catch (err) {
    throw new Error(err)
  }
})

// 读取文章内容
router.get('/getArticleFile', async ctx => {
  try {
    let { title } = ctx.request.query
    let res = fs.readFileSync(path.join(filePath, `${title}.html`), 'utf-8')
    ctx.body = { data: res }
  } catch (err) {
    ctx.body = { data: '' }
    // throw new Error(err)
  }
})

function writeFile(content, filename) {
  fs.writeFileSync(path.join(filePath, `${filename}.html`), content, 'utf-8')
}

// 生成名字
router.post('/createName', async ctx => {
  try {
    let { exceptList = [], surname, userd, length, feature } = ctx.request.body
    let count = (await query(`SELECT COUNT(*) as count FROM name_word WHERE off != 1`))[0].count
    let result = await getRandWord(exceptList, count)
    // 获取拼音
    for (let i = 0, len = result.length; i < len; i++) {
      let word = result[i].word,
        wordStr = '',
        pronounce = [],
        attr = [],
        wordMap = {}
      word.split('').forEach((ele, index) => {
        wordStr += `"${ele}", `
        wordMap[ele] = index
      })
      wordStr = wordStr.substr(0, wordStr.length - 2)
      let res = await query(`SELECT * FROM name_chinese WHERE chinese IN (${wordStr})`)
      res.forEach((ele, index) => {
        res[index].ork = wordMap[ele.chinese] || 0
      })
      res.sort((a, b) => {
        return a.ork - b.ork
      })
      res.forEach(ele => {
        pronounce.push(ele.pronounce.split(',').join(' | '))
        ele.attr ? attr.push(ele.attr) : false
      })
      result[i].pronounce = pronounce.join('，')
      result[i].attr = attr.join('，')
    }
    ctx.body = { data: result }
  } catch (err) {
    throw new Error(err)
  }
})

/**
 * 随机取数据
 * @param {Array} exceptList 已获取数据，在 sql 语句中排除掉
 * @param {Number} count 数据库数据总数
 */
async function getRandWord(exceptList, count) {
  let pageSize = 10,
    exceptStr = '',
    data = []
  if (exceptList.length === count) {
    let poetry = await query(`SELECT * FROM name_poetry ORDER BY rand() LIMIT ${pageSize}`)
    data = data.concat(await filterPoetry(poetry))
    return data
  }
  exceptList.forEach(ele => {
    exceptStr += `"${ele}", `
  })
  exceptStr = exceptStr.substr(0, exceptStr.length - 2)
  let where = `WHERE ${exceptList.length === 0 ? true : `id NOT IN (${exceptStr})`}`
  let res = await query(`SELECT * FROM name_word ${where} ORDER BY rand() LIMIT ${pageSize}`)
  for (let i = 0, len = res.length; i < len; i++) {
    exceptList.push(res[i].id)
    data.push(res[i])
  }
  // word 表数据已获取完，若还有剩下，再接着获取古诗词，从中拆分出 word
  if (res.length < pageSize) {
    let rest = pageSize - res.length
    let poetry = await query(`SELECT * FROM name_poetry ORDER BY rand() LIMIT ${rest}`)
    data = data.concat(await filterPoetry(poetry))
  }
  return data
}

/**
 * 从古诗中随机取出词组
 */
async function filterPoetry(poetryList) {
  let data = []
  for (let i = 0, len = poetryList.length; i < len; i++) {
    let contentArr = poetryList[i].verse.split('\n')
    let content = contentArr[random(0, contentArr.length - 1)]
    data.push({
      word: content[0] + content[1],
      mean: '',
      source: content,
      author: poetryList[i].author,
      dynasty: poetryList[i].dynasty,
      poetry: poetryList[i].title
    })
  }
  return data
}

module.exports = router
