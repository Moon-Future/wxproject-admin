module.exports = function(router, controller) {
  // router.get('/api/musicComment/getArtists', controller.musicComment.index.getArtists);
  // router.get('/api/musicComment/getSongs', controller.musicComment.index.getSongs);
  router.get('/api/musicComment/getCommentCount', controller.musicComment.index.getCommentCount);
  router.get('/api/musicComment/getHotComments', controller.musicComment.index.getHotComments);
  router.get('/api/musicComment/getComments', controller.musicComment.index.getComments);

  router.post('/api/music/getHotComments', controller.musicComment.music.getHotComments);
}