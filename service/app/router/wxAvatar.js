module.exports = function(router, controller) {
  // 后台
  router.post('/api/avatar/getAvatarAllTab', controller.wxAvatar.index.getAvatarAllTab);
  router.post('/api/avatar/getAvatarTab', controller.wxAvatar.index.getAvatarTab);
  router.post('/api/avatar/addAvatarTab', controller.wxAvatar.index.addAvatarTab);
  router.post('/api/avatar/delAvatarTab', controller.wxAvatar.index.delAvatarTab);
  router.post('/api/avatar/getAvatarMask', controller.wxAvatar.index.getAvatarMask);
  router.post('/api/avatar/addAvatarMask', controller.wxAvatar.index.addAvatarMask);
  router.post('/api/avatar/delAvatarMask', controller.wxAvatar.index.delAvatarMask);
}