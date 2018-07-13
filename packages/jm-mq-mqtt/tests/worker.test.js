const mqtt = require('mqtt')
const $ = require('./service')

let service = null
beforeAll(async () => {
  await $.onReady()
  service = $

  let mq = service.client
  mq.subscribe('#', {qos: 1})

  mq.on('message', function (topic, message, packet) {
    console.info('topic: %j message: %s', topic, message.toString())
  })
})

test('produce', async () => {
  expect(1).toBeTruthy()
})
