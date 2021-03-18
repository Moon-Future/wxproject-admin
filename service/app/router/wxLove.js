module.exports = function (router, controller) {
  router.post('/api/wxLove/getPost/', controller.wxLove.post.getPost)
  router.post('/api/wxLove/writePost/', controller.wxLove.post.writePost)
  router.post('/api/wxLove/postDetail/', controller.wxLove.post.postDetail)
  router.post('/api/wxLove/writeComment/', controller.wxLove.post.writeComment)
  router.post('/api/wxLove/getComment/', controller.wxLove.post.getComment)
  router.post('/api/wxLove/liked/', controller.wxLove.post.liked)
  router.post('/api/wxLove/getLiked/', controller.wxLove.post.getLiked)
  router.post('/api/wxLove/upLoad/', controller.wxLove.post.upLoad)

  router.post('/api/wxLove/login/', controller.wxLove.login.login)
  router.post('/api/wxLove/register/', controller.wxLove.login.register)

  router.post('/api/wxLove/writeStory/', controller.wxLove.user.writeStory)
  router.post('/api/wxLove/getStory/', controller.wxLove.user.getStory)
  router.post('/api/wxLove/suggest/', controller.wxLove.user.suggest)
  router.post('/api/wxLove/updateUser/', controller.wxLove.user.updateUser)
  
  router.post('/api/wxLove/getAccessToken/', controller.wxLove.check.getAccessToken)
  router.post('/api/wxLove/textCheck/', controller.wxLove.check.textCheck)
  router.post('/api/wxLove/imageCheck/', controller.wxLove.check.imageCheck)
  router.post('/api/wxLove/auditPost/', controller.wxLove.check.auditPost)

  router.post('/api/wxLove/getPatam/', controller.wxLove.param.getPatam)

  // router.post('/api/wxLove/getNameList/', controller.wxLove.index.getNameList);
  // router.post('/api/wxLove/getSurnameList/', controller.wxLove.index.getSurnameList);
  // router.post('/api/wxLove/getWxArticle/', controller.wxLove.index.getWxArticle);
  // router.post('/api/wxLove/getArticleFile/', controller.wxLove.index.getArticleFile);
  // router.post('/api/wxLove/createName/', controller.wxLove.create.createName);

  // // 管理后台
  // router.post('/api/wxLove/getChinese/', controller.wxLove.admin.getChinese);
  // router.post('/api/wxLove/addChinese/', controller.wxLove.admin.addChinese);
  // router.post('/api/wxLove/delChinese/', controller.wxLove.admin.delChinese);

  // router.post('/api/wxLove/getWord/', controller.wxLove.admin.getWord);
  // router.post('/api/wxLove/addWord/', controller.wxLove.admin.addWord);
  // router.post('/api/wxLove/delWord/', controller.wxLove.admin.delWord);

  // router.post('/api/wxLove/getPoetry/', controller.wxLove.admin.getPoetry);
  // router.post('/api/wxLove/addPoetry/', controller.wxLove.admin.addPoetry);
  // router.post('/api/wxLove/delPoetry/', controller.wxLove.admin.delPoetry);

  // router.post('/api/wxLove/getArticle/', controller.wxLove.admin.getArticle);
  // router.post('/api/wxLove/addArticle/', controller.wxLove.admin.addArticle);
  // router.post('/api/wxLove/delArticle/', controller.wxLove.admin.delArticle);

  // router.post('/api/wxLove/getTag/', controller.wxLove.admin.getTag);
  // router.post('/api/wxLove/getArticleFile/', controller.wxLove.admin.getArticleFile);
}
