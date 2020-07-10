const query = require('../database/init')
const path = require('path')
const fs = require('fs')
const shortid = require('shortid')
const { dateFormat } = require('../api/util.js')

// 导入汉字
async function importChinese() {
  const filename = 'chinese.txt'
  let filecontent = fs.readFileSync(path.join(__dirname, filename), 'utf-8')
  let objArr = filecontent.split(' *^* ')
  let startTime = new Date()
  for (let i = 0, len = objArr.length; i < len; i++) {
    if (objArr[i] == '') {
      continue
    }
    let id = shortid()
    let obj = JSON.parse(objArr[i])
    obj.p = obj.p.filter(ele => {
      return isNaN(Number(ele))
    })
    console.log(`共【${len}】条数据，正在导入第【${i + 1}，${obj.c}】条，还剩【${len - i - 1}】条，用时【${dateFormat(startTime, 'hh:mm')}，${(Date.now() - startTime) / 1000} s】`)
    await query(`INSERT INTO name_chinese (id, chinese, pronounce, stroke, createtime) VALUES (?, ?, ?, ?, ?)`, [id, obj.c, obj.p.join(','), obj.s, Date.now()])
  }
}

importChinese()
