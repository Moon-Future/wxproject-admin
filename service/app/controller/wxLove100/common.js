'use strict'
const shortid = require('shortid')
const { cosUpload } = require('../../utils/index')
const { tencentCloud } = require('../../../config/secret')

const Controller = require('egg').Controller

class HomeController extends Controller {
  async uploadFile() {
    const { ctx } = this
    try {
      const formData = ctx.request.body
      const file = ctx.request.files[0]
      const { filename, filepath } = file
      const result = await cosUpload(`upload/card/${formData.user}_${shortid()}${filename.substr(filename.lastIndexOf('.'))}`, filepath, tencentCloud.love100)
      ctx.body = { filePath: result.Location }
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = HomeController
