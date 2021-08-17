module.exports = (app) => {
  return async (ctx, next) => {
    console.log('connected')
    await next()
    // execute when disconnect.
    console.log('disconnection!')
  }
}
