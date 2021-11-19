module.exports = function(router, controller) {
  router.get('/', controller.admin.page.index)
}