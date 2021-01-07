'use strict';

const importToMysql = require('./router/import')
const wxName = require('./router/wxName')
const user = require('./router/user')
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  user(router, controller);
  wxName(router, controller);
  // importToMysql(router, controller);
};
