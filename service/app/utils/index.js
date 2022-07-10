const jwt = require('jsonwebtoken')
const COS = require('cos-nodejs-sdk-v5')
const { tokenConfig, tencentCloud } = require('../../config/secret')

function ajax(opts) {
  return new Promise((resolve, reject) => {
    request(opts, function (err, response, body) {
      if (err) {
        reject(err)
      } else {
        try {
          resolve(JSON.parse(body))
        } catch (error) {
          resolve(body)
        }
      }
    })
  })
}

// 验证是否登陆
function checkToken(ctx) {
  const token = ctx.get('Authorization')
  if (token === '') {
    ctx.status = 403
    ctx.body = { message: '请先登陆' }
    return false
  }
  try {
    const userInfo = jwt.verify(token.split(' ')[1], tokenConfig.privateKey)
    return userInfo
  } catch (err) {
    ctx.status = 403
    ctx.body = { message: '请先登陆' }
    return false
  }
}

function dateFormat(date, format) {
  date = typeof date === 'number' ? new Date(date) : date
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

// 随机生成数字 ID
function createId(len = 6) {
  return Math.random().toString().slice(-len)
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 创建实例
const cos = new COS({
  SecretId: tencentCloud.SecretId,
  SecretKey: tencentCloud.SecretKey,
})

const cosUpload = function (fileName, filePath, bucketInfo) {
  // 分片上传
  return new Promise((resolve, reject) => {
    cos.sliceUploadFile(
      {
        Bucket: bucketInfo.bucket,
        Region: bucketInfo.region,
        Key: fileName,
        FilePath: filePath,
      },
      function (err, data) {
        // console.log('err', err)
        // console.log('data', data)
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      }
    )
  })
}

module.exports = { checkToken, dateFormat, createId, random, ajax, cosUpload }
