const event = require('jm-event')
const log = require('jm-log4js')
const Kafka = require('kafka-node')
const {URL} = require('url')

const logger = log.getLogger('mq')

class Service {
  constructor (opts) {
    event.enableEvent(this)
    this.ready = false
    const url = new URL(opts.kafka)
    const client = new Kafka.Client(url.host)
    const producer = new Kafka.Producer(client)
    this.client = client
    this.producer = producer

    producer.on('ready', () => {
      this.ready = true
      this.emit('ready')
      logger.info('mq-kafka ready.')
    })

    producer.on('error', err => {
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
          let payload = {
            topic: opts.topic,
            messages: JSON.stringify(opts.message)
          }
          this.producer.send(
            [payload],
            (err, doc) => {
              if (err) {
                logger.error(`send fail: ${JSON.stringify(payload)}`)
                throw err
              }
              logger.info(`send ok: ${JSON.stringify(payload)}`)
              resolve(doc)
            }
          )
        })
      })
  }
}

module.exports = Service
