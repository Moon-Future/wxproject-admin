const fs = require('fs')
const path = require('path')
let content = fs.readFileSync(path.resolve(__dirname, './aaa.txt'), 'utf-8')
let obj = {}
content = content.split('\n').filter(ele => {
  ele = ele.trim()
  if (ele) {
    return true
  }
})

let map = {
  '身过弱': '0',
  '身弱': '1',
  '身强': '2',
  '身过强': '3',
  '身过衰': '0',
  '身衰': '1',
  '身旺': '2',
  '身过旺': '3',
}
let key = ''
content.forEach((ele, index) => {
  console.log(index)
  if (index === 0) {
    key = ele[4]
    obj[key] = {}
  } else {
    let arr = ele.split('，')
    let strong = arr[0].split('+')[0]
    let wang = arr[0].split('+')[1]
    let like = arr[1].split('：')[1].split('、')
    if (strong === '身过旺') {
      if (wang === '身强') {
        obj[key][map['身强'] + '-' + map[strong]] = like
        obj[key][map['身过强'] + '-' + map[strong]] = like
      }
      if (wang === '身弱') {
        obj[key][map['身弱'] + '-' + map[strong]] = like
        obj[key][map['身过弱'] + '-' + map[strong]] = like
      }
    } else if (strong === '身过衰') {
      if (wang === '身强') {
        obj[key][map['身强'] + '-' + map[strong]] = like
        obj[key][map['身过强'] + '-' + map[strong]] = like
      }
      if (wang === '身弱') {
        obj[key][map['身弱'] + '-' + map[strong]] = like
        obj[key][map['身过弱'] + '-' + map[strong]] = like
      }
    } else {
      obj[key][map[strong] + '-' + map[wang]] = like
    }
  }
})

console.log(obj)

