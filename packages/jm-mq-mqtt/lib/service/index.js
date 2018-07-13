const event = require('jm-event')
const log = require('jm-log4js')
const mqtt = require('mqtt')

const logger = log.getLogger('mq')

class Service {
  constructor (opts) {
    event.enableEvent(this)
    this.ready = false

    const client = mqtt.connect(opts.mqtt)
    this.client = client

    client.on('connect', (connack) => {
      this.ready = true
      this.emit('ready')
      logger.info('mqtt ready.')
    })

    client.on('reconnect', () => {
      logger.info('mqtt reconnect')
    })

    client.on('close', () => {
      this.ready = false
      logger.info('mqtt closed.')
    })

    client.on('offline', () => {
      logger.info('mqtt offline.')
      this.ready = false
    })

    client.on('error', (err) => {
      logger.error(err)
    })
  }

  onReady () {
    let self = this
    return new Promise(function (resolve, reject) {
      if (self.ready) return resolve(self.ready)
      self.once('ready', function () {
        resolve(self.ready)
      })
    })
  }

  async send (opts) {
    return this.onReady()
      .then(() => {
        return new Promise(resolve => {
          this.client.publish(opts.topic, JSON.stringify(opts.message), {qos: 1}, function (err) {
            if (err) {
              logger.error(`send fail: ${JSON.stringify(opts)}`)
              logger.error(err)
              throw err
            }
            logger.info(`send ok: ${JSON.stringify(opts)}`)
            resolve(opts)
          })
        })
      })
  }
}

module.exports = Service
