module.exports = function(router, controller) {
  // 后台
  router.post('/api/wxAvatar/getAvatarAllTab', controller.wxAvatar.index.getAvatarAllTab);
  router.post('/api/wxAvatar/getAvatarTab', controller.wxAvatar.index.getAvatarTab);
  router.post('/api/wxAvatar/addAvatarTab', controller.wxAvatar.index.addAvatarTab);
  router.post('/api/wxAvatar/delAvatarTab', controller.wxAvatar.index.delAvatarTab);
  router.post('/api/wxAvatar/getAvatarMask', controller.wxAvatar.index.getAvatarMask);
  router.post('/api/wxAvatar/addAvatarMask', controller.wxAvatar.index.addAvatarMask);
  router.post('/api/wxAvatar/delAvatarMask', controller.wxAvatar.index.delAvatarMask);

  router.get('/api/wxAvatar/importMask', controller.wxAvatar.importData.importMask);
}