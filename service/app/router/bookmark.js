module.exports = function (router, controller) {
  router.post('/api/bookmark/importBookmark/', controller.bookmark.bookmark.importBookmark)
  router.post('/api/bookmark/modifyBookmark/', controller.bookmark.bookmark.modifyBookmark)
  router.post('/api/bookmark/moveBookmark/', controller.bookmark.bookmark.moveBookmark)
  router.post('/api/bookmark/removeBookmark/', controller.bookmark.bookmark.removeBookmark)
  router.post('/api/bookmark/sortBookmark/', controller.bookmark.bookmark.sortBookmark)
  router.post('/api/bookmark/getBookmark/', controller.bookmark.bookmark.getBookmark)
  router.post('/api/bookmark/addBookmark/', controller.bookmark.bookmark.addBookmark)
  router.post('/api/bookmark/saveNewNode/', controller.bookmark.bookmark.saveNewNode)
  router.post('/api/bookmark/getWebsiteTitleAndIcon/', controller.bookmark.bookmark.getWebsiteTitleAndIcon)
}
