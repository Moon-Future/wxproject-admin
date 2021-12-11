module.exports = function(router, controller) {
  // 后台
  router.post('/api/avatar/getAvatarTab', controller.wxAvatar.index.getAvatarTab);
  router.post('/api/avatar/addAvatarTab', controller.wxAvatar.index.addAvatarTab);
}