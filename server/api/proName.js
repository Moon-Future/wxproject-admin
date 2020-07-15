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
    let { pageNo = 1, pageSize = 20, word = '', author = '', poetry = '', used = '', enor } = ctx.request.query
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

// 新增、更新词组
router.post('/addWord', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    let { word, mean, feature, source, author, dynasty, poetry, likes, used, enor, id = '' } = ctx.request.body
    author = author === '' ? '佚名' : author
    if (id !== '') {
      // 更新
      await query(
        `UPDATE name_word SET mean = ?, feature = ?, source = ?, author = ?, dynasty = ?, poetry = ?, likes = ?, used = ?, enor = ? WHERE id = ?`,
        [mean, feature, source, author, dynasty, poetry, likes, used, enor, id]
      )
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
      `INSERT INTO name_word (id, word, mean, feature, source, author, dynasty, poetry, likes, used, enor, length, createtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [shortid(), word, mean, feature, source, author, dynasty, poetry, likes, used, enor, word.length, Date.now()]
    )
    ctx.body = { message: '添加成功' }
  } catch (err) {
    throw new Error(err)
  }
})

// 删除词组
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
    let { title, id, tab } = ctx.request.query
    let poetry, article
    if (tab === '0') {
      poetry = (await query(`SELECT * FROM name_poetry WHERE id = ? AND off != 1`, [id]))[0]
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
    // throw new Error(err)
  }
})

function writeFile(content, filename) {
  fs.writeFileSync(path.join(filePath, `${filename}.html`), content, 'utf-8')
}

// 小程序获取诗文列表
router.get('/getWxArticle', async ctx => {
  try {
    let { pageNo = 1, pageSize = 10, tab, condition = '' } = ctx.request.query
    let res, where, count
    switch (tab) {
      case '0':
        // 古诗文
        where = `WHERE ${condition === '' ? true : `title LIKE '%${condition}%' OR author LIKE '%${condition}%' OR verse LIKE '%${condition}%'`}`
        res = await query(`SELECT * FROM name_poetry ${where} AND off != 1 ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
        count = (await query(`SELECT COUNT(*) as count FROM name_poetry ${where} AND off != 1`)) || [{ count: 0 }]
        break
      case '1':
        // 姓氏起源
        where = `WHERE title LIKE '%姓氏起源%' AND ${condition === '' ? true : `title LIKE '%${condition}%' OR summary LIKE '%${condition}%'`}`
        res = await query(`SELECT * FROM name_article ${where} AND off != 1 ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
        count = (await query(`SELECT COUNT(*) as count FROM name_article ${where} AND off != 1`)) || [{ count: 0 }]
        break
      case '2':
        // 其他文章
        where = `WHERE title NOT LIKE '%姓氏起源%' AND ${condition === '' ? true : `title LIKE '%${condition}%' OR summary LIKE '%${condition}%'`}`
        res = await query(`SELECT * FROM name_article ${where} AND off != 1 ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
        count = (await query(`SELECT COUNT(*) as count FROM name_article ${where} AND off != 1`)) || [{ count: 0 }]
        break
    }
    ctx.body = { data: res, count: count[0].count }
  } catch (err) {
    throw new Error(err)
  }
})

// 小程序生成名字
router.post('/createName', async ctx => {
  try {
    let { pageNo = 1, pageSize = 10, exceptList = [], surname, used, length, feature, tab } = ctx.request.body
    if (tab !== undefined && tab !== '0') {
      let where = ''
      switch (tab) {
        case '1': // 社交
          where = `WHERE used = 3`
          break
        case '2': // 游戏
          where = `WHERE used = 2`
          break
        case '3': // 英文
          where = `WHERE enor = 1`
          break
      }
      let count = (await query(`SELECT COUNT(*) as count FROM name_word ${where} AND off != 1`))[0].count
      let result = await query(`SELECT * FROM name_word ${where} AND off != 1 ORDER BY createtime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
      ctx.body = { data: result, count: count }
      return
    }
    let count = (await query(`SELECT COUNT(*) as count FROM name_word WHERE off != 1`))[0].count
    let result = await getRandWord(exceptList, count, used, length, feature)
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
 * @param {String} used 0: 女孩 1：男孩 01：男女 2：网游 3：社交
 */
async function getRandWord(exceptList, count, used, length, feature) {
  let pageSize = 10,
    exceptStr = '',
    data = []
  if (exceptList.length === count) {
    let poetry = await query(`SELECT * FROM name_poetry ORDER BY rand() LIMIT ${pageSize}`)
    data = data.concat(await filterPoetry(poetry, length))
    return data
  }
  exceptList.forEach(ele => {
    exceptStr += `"${ele}", `
  })
  exceptStr = exceptStr.substr(0, exceptStr.length - 2)
  let where = `WHERE ${exceptList.length === 0 ? true : `id NOT IN (${exceptStr})`} AND length = ${length} AND used LIKE '%${used}%'`
  let res = [],
    featureLen = 0
  // 若输入了特征，先查询特征词
  if (feature !== '') {
    res = await query(`SELECT * FROM name_word ${where} AND feature LIKE '%${feature}%' ORDER BY rand() LIMIT ${pageSize}`)
    if (res.length !== 0) {
      featureLen = res.length
      for (let i = 0, len = res.length; i < len; i++) {
        exceptList.push(res[i].id)
        data.push(res[i])
      }
      exceptStr = ''
      exceptList.forEach(ele => {
        exceptStr += `"${ele}", `
      })
      exceptStr = exceptStr.substr(0, exceptStr.length - 2)
      where = `WHERE ${exceptList.length === 0 ? true : `id NOT IN (${exceptStr})`} AND length = ${length} AND used LIKE '%${used}%'`
    }
  }

  res = await query(`SELECT * FROM name_word ${where} ORDER BY rand() LIMIT ${pageSize - featureLen}`)
  for (let i = 0, len = res.length; i < len; i++) {
    exceptList.push(res[i].id)
    data.push(res[i])
  }
  // word 表数据已获取完，若还有剩下，再接着获取古诗词，从中拆分出 word
  if (res.length < pageSize - featureLen) {
    let rest = pageSize - featureLen - res.length
    let poetry = await query(`SELECT * FROM name_poetry ORDER BY rand() LIMIT ${rest}`)
    data = data.concat(await filterPoetry(poetry, length))
  }
  return data
}

/**
 * 从古诗中随机取出词组
 */
async function filterPoetry(poetryList, length) {
  let data = []
  for (let i = 0, len = poetryList.length; i < len; i++) {
    let contentArr = poetryList[i].verse.split('\n')
    let content = contentArr[random(0, contentArr.length - 1)]
    data.push({
      word: content[0] + (length == 2 ? content[1] : ''),
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
