const Service = require('./service')
const router = require('./router')

/**
 * mq module.
 * @module mq
 * @param {Object} opts
 * @example
 * opts参数:{
 *  kafka: (可选, 如果不填，自动连接默认 127.0.0.1:6379)
 * }
 * @return {}
 */
module.exports = function (opts = {}) {
  ['kafka'].forEach(function (key) {
    process.env[key] && (opts[key] = process.env[key])
  })

  let o = new Service(opts)
  o.router = router

  return o
}
