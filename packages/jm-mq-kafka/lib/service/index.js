const event = require('jm-event')
const log = require('jm-log4js')
const error = require('jm-err')
const _ = require('lodash')
const Kafka = require('kafka-node')
const {URL} = require('url')

const logger = log.getLogger('mq')

class Service {
  constructor (opts = {}) {
    event.enableEvent(this)
    this.ready = false
    this.no_auto_create_topic = opts.no_auto_create_topic
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

    this.listTopic()
      .then(doc => {
        this.topics = doc
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

  async listTopic () {
    await this.onReady()
    return new Promise(resolve => {
      this.client.loadMetadataForTopics([], (err, doc) => {
        if (err) {
          logger.error(`list topic fail`)
          logger.error(err)
          throw err
        }
        logger.info(`list topic ok`)
        doc = _.get(doc, '1.metadata')
        let topics = Object.keys(doc)
        this.topics = topics
        resolve(topics)
      })
    })
  }

  async createTopic (topic) {
    if (!topic) throw error.err(error.Err.FA_PARAMS)
    await this.onReady()
    return new Promise(resolve => {
      var topics = [
        topic
      ]

      this.client.createTopics(topics, (err, doc) => {
        if (err) {
          logger.error(`create topic fail: ${topic}`)
          logger.error(err)
          throw err
        }
        logger.info(`create topic ok: ${topic}`)
        resolve(doc)
      })
    })
  }

  async checkTopic (topic) {
    await this.onReady()
    if (!this.topics) await this.listTopic()
    if (this.topics.indexOf(topic) >= 0) return
    await this.createTopic(topic)
    this.topics.push(topic)
  }

  async send (opts) {
    if (!this.no_auto_create_topic) await this.checkTopic(opts.topic)
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
            logger.error(err)
            throw err
          }
          logger.info(`send ok: ${JSON.stringify(payload)}`)
          resolve(doc)
        }
      )
    })
  }
}

module.exports = Service
