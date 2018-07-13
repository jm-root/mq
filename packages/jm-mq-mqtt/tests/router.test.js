const $ = require('./service')

let router = null
beforeAll(async () => {
  await $.onReady()
  router = $.router()
})

test('send', async () => {
  let doc = await router.post('/test', {message: 'test'})
  console.log(doc)
  expect(doc).toBeTruthy()
})
