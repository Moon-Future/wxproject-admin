module.exports = function (router, controller) {
  router.post('/api/bookmark/importBookmark/', controller.bookmark.bookmark.importBookmark)
  router.post('/api/bookmark/addBookmark/', controller.bookmark.bookmark.addBookmark)
}
