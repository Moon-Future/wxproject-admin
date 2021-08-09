module.exports = function (router, controller) {
  router.post('/api/wxLove100/login/', controller.wxLove100.login.login)
  router.post('/api/wxLove100/updateUserInfo/', controller.wxLove100.login.updateUserInfo)

  router.post('/api/wxLove100/toBeLover/', controller.wxLove100.user.toBeLover)
  router.post('/api/wxLove100/breakup/', controller.wxLove100.user.breakup)

  router.post('/api/wxLove100/getCardList/', controller.wxLove100.card.getCardList)
  router.post('/api/wxLove100/cardFinished/', controller.wxLove100.card.cardFinished)
  router.post('/api/wxLove100/cardEdit/', controller.wxLove100.card.cardEdit)
  // router.post('/api/wxLove100/register/', controller.wxLove100.login.register)
}
