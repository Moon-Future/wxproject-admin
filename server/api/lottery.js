const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')
const { dateFormat, ajax } = require('./util')
const axois = require('axios')
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
    let { date, type } = ctx.request.query
    date = new Date(Number(date))
    date = `${dateFormat(date, 'yyyy-MM-dd')} 星期${dateMap[date.getDay()]}`
    let res = await query(`SELECT * FROM lottery WHERE date = ? AND type = ? AND off != 1 ORDER BY createtime ASC`, [date, type])
    ctx.body = { data: res }
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
    let { id } = ctx.request.body
    await query(`UPDATE lottery SET off = 1 WHERE id = ?`, [id])
    ctx.body = { message: '删除成功' }
  } catch (err) {
    throw new Error(err)
  }
})

// 查询开奖结果
router.get('/getLotteryData', async ctx => {
  try {
    let { date, type } = ctx.request.query
    date = new Date(date)
    if (type == 1) {
      // 双色球
      let res = await ajax({
        url: 'http://www.cwl.gov.cn/cwl_admin/kjxx/findDrawNotice',
        method: 'GET',
        headers: {
          Referer: 'http://www.cwl.gov.cn/kjxx/ssq/kjgg/'
        },
        qs: {
          name: 'ssq',
          issueCount: '',
          issueStart: '',
          issueEnd: '',
          dayStart: dateFormat(date, 'yyyy-MM-dd'),
          dayEnd: dateFormat(date, 'yyyy-MM-dd'),
          pageNo: ''
        }
      })
      ctx.body = { data: res }
    } else {
      // 超级大乐透
      ctx.body = { data: [] }
    }
  } catch (err) {
    throw new Error(err)
  }
})

// 查询最近开奖结果
router.get('/getLotteryRecent', async ctx => {
  try {
    let { type } = ctx.request.query
    if (type == 1) {
      // 双色球
      let codeRes = await ajax({
        url: 'http://www.cwl.gov.cn/cwl_admin/kjxx/findIssue?name=ssq',
        method: 'GET',
        headers: {
          Referer: 'http://www.cwl.gov.cn/kjxx/ssq/'
        },
        qs: { name: 'ssq' }
      })
      let code = codeRes.result.code[0]
      let res = await ajax({
        url: 'http://www.cwl.gov.cn/cwl_admin/kjxx/findKjxx/forIssue',
        method: 'GET',
        headers: {
          Referer: 'http://www.cwl.gov.cn/kjxx/ssq/'
        },
        qs: { name: 'ssq', code: code }
      })
      ctx.body = { data: res.result[0] }
    } else {
      // 超级大乐透
      let res = await ajax({
        url: 'https://www.lottery.gov.cn/api/lottery_kj_detail_new.jspx?_ltype=4&_term=',
        method: 'POST',
        headers: {
          Referer: 'http://www.cwl.gov.cn/kjxx/ssq/'
        },
        body: JSON.stringify({
          _ltype: '4',
          _term: ''
        })
      })
      let lottery = res[0].lottery
      ctx.body = {
        data: {
          code: lottery.term,
          date: lottery.fTime,
          red: lottery.number
            .split('-')[0]
            .split(' ')
            .join(','),
          blue: lottery.number
            .split('-')[1]
            .split(' ')
            .join(',')
        }
      }
    }
  } catch (err) {
    throw new Error(err)
  }
})

module.exports = router
