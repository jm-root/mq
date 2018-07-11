const event = require('jm-event')
const error = require('jm-err')
const help = require('./help')
const wraper = require('./wraper')

let MS = require('jm-ms-core')
let ms = new MS()
let Err = error.Err

/**
 * @apiDefine Error
 *
 * @apiSuccess (Error 200) {Number} err 错误代码
 * @apiSuccess (Error 200) {String} msg 错误信息
 *
 * @apiExample {json} 错误:
 *     {
 *       err: 错误代码
 *       msg: 错误信息
 *     }
 */

module.exports = function (opts = {}) {
  let service = this
  let router = ms.router()
  service.wrapRoute = wraper(service)

  async function produce (opts) {
    let doc = service.produce(opts.data.topic, opts.data.message)
    return {ret: 1}
  }

  let wrap = service.wrapRoute

  router.use(help(service))
    .use(function (opts, cb, next) {
      if (!service.ready) {
        let e = error.err(Err.FA_NOTREADY)
        return cbErr(opts, cb, e)
      }
      next()
    })
    .add('/publish', 'post', wrap(produce))
    .add('/produce', 'post', wrap(produce))

  return router
}
