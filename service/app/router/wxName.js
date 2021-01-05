module.exports = function(router, controller) {
  router.post('/api/wxName/getNameList/', controller.wxName.index.getNameList);
  router.post('/api/wxName/getSurnameList/', controller.wxName.index.getSurnameList);
  router.post('/api/wxName/getWxArticle/', controller.wxName.index.getWxArticle);
  router.post('/api/wxName/getArticleFile/', controller.wxName.index.getArticleFile);

  router.post('/api/wxName/createName/', controller.wxName.create.createName);
}