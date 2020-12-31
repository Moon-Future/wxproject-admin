module.exports = function(router, controller) {
  router.get('/api/wxName/shijing/', controller.import.import.shijing)
  router.get('/api/wxName/chuci/', controller.import.import.chuci)
  router.get('/api/wxName/tangshi/', controller.import.import.tangshi)
  router.get('/api/wxName/songci/', controller.import.import.songci)
  router.get('/api/wxName/gushi/', controller.import.import.gushi)
}