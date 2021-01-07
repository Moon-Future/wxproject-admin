module.exports = function(router, controller) {
  router.post('/api/wxName/getNameList/', controller.wxName.index.getNameList);
  router.post('/api/wxName/getSurnameList/', controller.wxName.index.getSurnameList);
  router.post('/api/wxName/getWxArticle/', controller.wxName.index.getWxArticle);
  router.post('/api/wxName/getArticleFile/', controller.wxName.index.getArticleFile);
  router.post('/api/wxName/createName/', controller.wxName.create.createName);

  // 管理后台
  router.post('/api/wxName/getChinese/', controller.wxName.admin.getChinese);
  router.post('/api/wxName/addChinese/', controller.wxName.admin.addChinese);
  router.post('/api/wxName/delChinese/', controller.wxName.admin.delChinese);
  
  router.post('/api/wxName/getWord/', controller.wxName.admin.getWord);
  router.post('/api/wxName/addWord/', controller.wxName.admin.addWord);
  router.post('/api/wxName/delWord/', controller.wxName.admin.delWord);
  
  router.post('/api/wxName/getPoetry/', controller.wxName.admin.getPoetry);
  router.post('/api/wxName/addPoetry/', controller.wxName.admin.addPoetry);
  router.post('/api/wxName/delPoetry/', controller.wxName.admin.delPoetry);
  
  router.post('/api/wxName/getArticle/', controller.wxName.admin.getArticle);
  router.post('/api/wxName/addArticle/', controller.wxName.admin.addArticle);
  router.post('/api/wxName/delArticle/', controller.wxName.admin.delArticle);

  router.post('/api/wxName/getTag/', controller.wxName.admin.getTag);
  router.post('/api/wxName/getArticleFile/', controller.wxName.admin.getArticleFile);
}