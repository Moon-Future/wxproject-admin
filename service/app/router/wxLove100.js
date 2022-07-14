module.exports = function (router, controller) {
  router.post('/api/wxLove100/login/', controller.wxLove100.login.login)
  router.post('/api/wxLove100/updateUserInfo/', controller.wxLove100.login.updateUserInfo)
  router.post('/api/wxLove100/getControl/', controller.wxLove100.login.getControl)

  router.post('/api/wxLove100/toBeLover/', controller.wxLove100.user.toBeLover)
  router.post('/api/wxLove100/breakup/', controller.wxLove100.user.breakup)
  router.post('/api/wxLove100/getMessage/', controller.wxLove100.user.getMessage)
  router.post('/api/wxLove100/readMessage/', controller.wxLove100.user.readMessage)
  router.post('/api/wxLove100/refuse/', controller.wxLove100.user.refuse)
  router.post('/api/wxLove100/getUserList/', controller.wxLove100.user.getUserList)

  router.post('/api/wxLove100/getCardList/', controller.wxLove100.card.getCardList)
  router.post('/api/wxLove100/cardFinished/', controller.wxLove100.card.cardFinished)
  router.post('/api/wxLove100/cardEdit/', controller.wxLove100.card.cardEdit)
  router.post('/api/wxLove100/getSentence/', controller.wxLove100.card.getSentence)
  router.post('/api/wxLove100/cardAdd/', controller.wxLove100.card.cardAdd)
  router.post('/api/wxLove100/cardDelete/', controller.wxLove100.card.cardDelete)

  router.post('/api/wxLove100/suggest/', controller.wxLove100.system.suggest)

  router.post('/api/wxLove100/uploadFile/', controller.wxLove100.common.uploadFile)

  router.post('/api/wxLove100/getFestival/', controller.wxLove100.festival.getFestival)

  router.post('/api/wxLove100/addMemory/', controller.wxLove100.memory.addMemory)
  router.post('/api/wxLove100/getMemory/', controller.wxLove100.memory.getMemory)

  // router.get('/api/wxLove100/importCardList/', controller.wxLove100.importData.importCardList)

  // io.of('/love100').route('agree', io.controller.wxLove100.agree)
  // io.of('/love100').route('breakup', io.controller.wxLove100.breakup)
}
