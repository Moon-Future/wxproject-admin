module.exports = (app) => {
  return async (ctx, next) => {
    app.love100SocketMap = app.love100SocketMap || {}
    app.love100SocketMap[ctx.query.userId] = ctx.socket.id
    await next()
    // execute when disconnect.
    delete app.love100SocketMap[ctx.query.userId]
    // console.log('disconnection!')
  }
}
