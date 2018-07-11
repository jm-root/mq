const $ = require('./service')

let service = null
beforeAll(async () => {
  await $.onReady()
  service = $
})

test('produce', async () => {
  let doc = await service.produce('test', 'test')
  console.log(doc)
  expect(doc).toBeTruthy()
})
