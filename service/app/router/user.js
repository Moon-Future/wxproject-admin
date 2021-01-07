module.exports = function(router, controller) {
  router.post('/api/user/login/', controller.user.index.login);
  router.post('/api/user/checkLogin/', controller.user.index.checkLogin);
}