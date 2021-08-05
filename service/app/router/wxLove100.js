module.exports = function (router, controller) {
  router.post('/api/wxLove100/login/', controller.wxLove100.login.login)
  router.post('/api/wxLove100/updateUserInfo/', controller.wxLove100.login.updateUserInfo)
  // router.post('/api/wxLove100/register/', controller.wxLove100.login.register)
}
