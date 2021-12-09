module.exports = function(router, controller) {
  // 后台
  router.post('/api/avatar/getAvatarTabs', controller.wxAvatar.index.getAvatarTabs);
}