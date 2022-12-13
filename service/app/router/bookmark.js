module.exports = function (router, controller) {
  router.post('/api/bookmark/importBookmark/', controller.bookmark.bookmark.importBookmark)
  router.post('/api/bookmark/modifyBookmark/', controller.bookmark.bookmark.modifyBookmark)
  router.post('/api/bookmark/removeBookmark/', controller.bookmark.bookmark.removeBookmark)
  router.post('/api/bookmark/addBookmark/', controller.bookmark.bookmark.addBookmark)
}
