const nodemailer = require('nodemailer')
const { emailInfo } = require('../../config/secret')
/*
  emailInfo: {
    account = {
      user: 'xxxxxx@qq.com',
      // 这里密码不是qq密码，是你设置的smtp授权码
      pass: 'xxxxxx',
    }
  }
*/
const account = emailInfo.account

const transporter = nodemailer.createTransport({
  // host: 'smtp.qq.email',
  service: 'qq',
  port: 465,
  secure: true, // true for 465, false for other ports 587
  auth: {
    user: account.user, // generated ethereal user
    pass: account.pass, // generated ethereal password
  },
})

var mailOptions = {
  from: 'LeonChan <236338364@qq.com>', // sender address
  to: '236338364@qq.com', // list of receivers
  subject: '失恋营地', // Subject line
  // text: '有新注册用户', // plain text body
  // html: '<b>你好哟</b>' // html body
}

module.exports = { transporter, mailOptions }
