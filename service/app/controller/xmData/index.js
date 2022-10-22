'use strict'
const shortid = require('shortid')

const Controller = require('egg').Controller

class HomeController extends Controller {
  async addTableData() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { tableData, tableName } = ctx.request.body
      const tbId = shortid()
      const tbName = tableName.substr(0, tableName.lastIndexOf('.')).trim()
      let fields = ['pdName', 'adName', 'filterType', 'price', 'priceType', 'qualityScore', 'searchNum', 'pdId', 'cost', 'exposureNum', 'clickNum', 'clickPercent', 'addNum', 'addCost', 'orderROI', 'sales', 'doneROI']
      let sql = `INSERT INTO xm_table_data (id, ${fields.join(',')}, tableId, createTime, goodsId) VALUES `
      let sqlField = []
      let sqlData = []

      const goods = await conn.query(`SELECT * FROM xm_goods`)
      const goodsMap = {}
      let goodsSql = `INSERT INTO xm_goods (id, pdName, adName, createTime) VALUES `
      let goodsSqlField = []
      let goodsSqlData = []
      goods.forEach(item => {
        goodsMap[item.pdName + '_' + item.adName] = item.id
      })

      tableData.forEach((item, index) => {
        if (item.pdName !== '') {
          sqlField.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          sqlData.push(shortid())
          fields.forEach(field => {
            sqlData.push(typeof item[field] === 'undefined' ? '' : item[field])
          })

          if (!goodsMap[item.pdName + '_' + item.adName]) {
            const goodsId = shortid()
            goodsSqlField.push('(?, ?, ?, ?)')
            goodsSqlData.push(goodsId, item.pdName, item.adName, Date.now() + index)
            goodsMap[item.pdName + '_' + item.adName] = goodsId
          }

          sqlData.push(tbId, Date.now() + index, goodsMap[item.pdName + '_' + item.adName])
        }
      })
      await conn.query(`INSERT INTO xm_table (id, name, createTime) VALUES (?, ?, ?)`, [tbId, tbName, Date.now()])

      sql += sqlField.join(',')
      await conn.query(sql, sqlData)

      if (goodsSqlField.length) {
        goodsSql += goodsSqlField.join(',')
        await conn.query(goodsSql, goodsSqlData)
      }
      
      await conn.commit()
      ctx.body = { code: 200 }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错，请重新上传' }
    }
  }

  async getTableList() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const result = await conn.query(`SELECT * FROM xm_table WHERE off != 1 ORDER BY createTime DESC`)
      await conn.commit()
      ctx.body = { code: 200, data: result }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async getTableData() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { tableId } = ctx.request.body
      const result = await conn.query(`SELECT * FROM xm_table_data WHERE tableId = ? AND off != 1 ORDER BY createTime ASC`, [tableId])
      await conn.commit()
      ctx.body = { code: 200, data: result }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async getGoodsList() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const result = await conn.query(`SELECT * FROM xm_goods WHERE off != 1 ORDER BY createTime ASC`)
      await conn.commit()
      ctx.body = { code: 200, data: result }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async getGoodsData() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { goodsId } = ctx.request.body
      const result = await conn.query(`SELECT a.*, b.name as tableName FROM xm_table_data a, xm_table b WHERE a.goodsId = ? AND a.tableId = b.id AND a.off != 1 AND b.off != 1 ORDER BY createTime ASC`, [goodsId])
      await conn.commit()
      ctx.body = { code: 200, data: result }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async modifyTableName() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { tableId, tableName } = ctx.request.body
      await conn.query(`UPDATE xm_table SET name = ? WHERE id = ?`, [tableName, tableId])
      await conn.commit()
      ctx.body = { code: 200, message: '保存成功' }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async removeTable() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { tableId } = ctx.request.body
      await conn.query(`UPDATE xm_table SET off = 1 WHERE id = ?`, [tableId])
      await conn.commit()
      ctx.body = { code: 200, message: '删除成功' }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }
}

module.exports = HomeController
