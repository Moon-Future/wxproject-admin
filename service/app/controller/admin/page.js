'use strict';
const path = require('path')
const fs = require('fs')
const indexHtml = '../../dist/index.html'

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.response.type = 'html'
    ctx.body = fs.readFileSync(path.resolve(__dirname, indexHtml))
  }
}

module.exports = HomeController;
