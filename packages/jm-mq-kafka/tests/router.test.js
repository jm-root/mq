const $ = require('./service')

let router = null
beforeAll(async () => {
  await $.onReady()
  router = $.router()
})

test('produce', async () => {
  let doc = await router.post('/produce', {topic: 'test', message: 'test'})
  console.log(doc)
  expect(doc).toBeTruthy()
})
