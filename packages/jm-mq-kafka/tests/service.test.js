const $ = require('./service')

let service = null
beforeAll(async () => {
  await $.onReady()
  service = $
})

test('send', async () => {
  let doc = await service.send({
    topic: 'test',
    message: 'test'
  })
  console.log(doc)
  expect(doc).toBeTruthy()
})

test('send null', async () => {
  let doc = await service.send({
    topic: 'test'
  })
  console.log(doc)
  expect(doc).toBeTruthy()
})

test('send object', async () => {
  let doc = await service.send({
    topic: 'test',
    message: {
      id: 123,
      name: 'jeff'
    }
  })
  console.log(doc)
  expect(doc).toBeTruthy()
})

