const Service = require('./service')
const router = require('./router')

/**
 * mq module.
 * @module mq
 * @param {Object} opts
 * @example
 * opts参数:{
 *  mqtt:
 * }
 * @return {}
 */
module.exports = function (opts = {}) {
  ['mqtt'].forEach(function (key) {
    process.env[key] && (opts[key] = process.env[key])
  })

  let o = new Service(opts)
  o.router = router

  return o
}
