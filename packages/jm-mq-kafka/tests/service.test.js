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
