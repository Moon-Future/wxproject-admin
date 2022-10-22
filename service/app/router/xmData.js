module.exports = function (router, controller) {
  router.post('/api/xmData/addTableData/', controller.xmData.index.addTableData)
  router.post('/api/xmData/getTableList/', controller.xmData.index.getTableList)
  router.post('/api/xmData/getTableData/', controller.xmData.index.getTableData)
  router.post('/api/xmData/getGoodsList/', controller.xmData.index.getGoodsList)
  router.post('/api/xmData/getGoodsData/', controller.xmData.index.getGoodsData)
  router.post('/api/xmData/modifyTableName/', controller.xmData.index.modifyTableName)
  router.post('/api/xmData/removeTable/', controller.xmData.index.removeTable)
}
