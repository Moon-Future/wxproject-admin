'use strict';

const importToMysql = require('./router/import')
const wxName = require('./router/wxName')
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  wxName(router, controller);
  // importToMysql(router, controller);
};
