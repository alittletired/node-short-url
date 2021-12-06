// import request from 'supertest'
// import app from '../../src/app'
// import { initializeConfig } from '../../src/services/config.service'
// describe('insert', () => {
//   let connection

//   beforeAll(async () => {
//     connection = await mongoose.connect(global.__MONGO_URI__)
//   })

//   afterAll(async () => {
//     await connection.close()
//   })
// })

// describe('generate shorturl', () => {
//   test('generate same shorturl', () => {
//     return request(app)
//       .post('/shortUrl')
//       .field('originUrl', 'http://shorturl/1')
//       .expect(200)
//       .end((err, res) => {
//         console.log(res)
//       })
//   })
// })
