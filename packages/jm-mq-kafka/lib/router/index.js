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

  async function filterReady () {
    if (!service.ready) throw error.err(Err.FA_NOTREADY)
  }

  async function listTopic (opts) {
    let doc = await service.listTopic()
    return {rows: doc}
  }

  async function createTopic (opts) {
    await service.createTopic(opts.data.topic)
    return {ret: 1}
  }

  async function send (opts) {
    let data = Object.assign({}, opts.params, opts.data)
    await service.send(data)
    return {ret: 1}
  }

  let wrap = service.wrapRoute

  router.use(help(service))
    .use(wrap(filterReady, true))
    .add('/topics', 'get', wrap(listTopic))
    .add('/topics', 'post', wrap(createTopic))
    .add('/:topic', 'post', wrap(send))
    .add('/:topic', 'get', wrap(send))

  return router
}
