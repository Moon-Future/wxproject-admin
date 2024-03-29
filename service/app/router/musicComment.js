module.exports = function(router, controller) {
  // 后台
  router.post('/api/music/getArtist', controller.musicComment.admin.getArtist);
  router.post('/api/music/getHotComment', controller.musicComment.admin.getHotComment);
  router.post('/api/music/getSong', controller.musicComment.admin.getSong);
  router.post('/api/music/updateMusicSize', controller.musicComment.admin.updateMusicSize);
  router.post('/api/music/updateCommentCount', controller.musicComment.admin.updateCommentCount);
  router.post('/api/music/updateCommentLikedCount', controller.musicComment.admin.updateCommentLikedCount);
  router.post('/api/music/getUpdateHistory', controller.musicComment.admin.getUpdateHistory);

  // router.get('/api/musicComment/getArtists', controller.musicComment.index.getArtists);
  router.get('/api/musicComment/getSongs', controller.musicComment.index.getSongs);
  // router.get('/api/musicComment/handleSongs', controller.musicComment.index.handleSongs);

  router.get('/api/musicComment/getCommentCount', controller.musicComment.index.getCommentCount);
  router.get('/api/musicComment/getHotComments', controller.musicComment.index.getHotComments);
  router.get('/api/musicComment/getComments', controller.musicComment.index.getComments);

  router.post('/api/music/getHotComments', controller.musicComment.music.getHotComments);
  router.post('/api/music/getHotMusic', controller.musicComment.music.getHotMusic);
  router.post('/api/music/getLyric', controller.musicComment.music.getLyric);
  router.post('/api/music/getSongInfo', controller.musicComment.music.getSongInfo);
}