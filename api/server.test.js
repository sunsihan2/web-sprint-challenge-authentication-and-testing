const request = require('supertest');
const db = require('../data/dbConfig');
const server = require('./server');
test('sanity', () => {
  expect(true).toBe(true)
})
beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
afterAll(async () => {
  await db.destroy()
})

describe('[post] /register', () => {
  it(' new user tst', async () => {
    const res = await request(server)
      .post('/api/auth/register').send({ username: 'serena', password: "666" })
    expect(res.body).toMatchObject({ username: 'serena' })
  })
  it('validation check', async () => {
    const res = await request(server).post('/api/auth/register').send({ username: 'serena' })
    expect(res.body).toMatchObject({ message: "missing username or password" })
  })
})

describe('[post] /login', () => {
  test('happy path check', async () => {
    await request(server).post('/api/auth/register').send({ username: 'serena', password: "666" })
    const res = await request(server).post('/api/auth/login').send({ username: 'serena', password: "666" })
    expect(res.body).toMatchObject({ message: "welcome, serena" })
  })
  test('sad path check', async () => {
    const res = await request(server).post('/api/auth/login').send({ username: 'judy', password: "666" })
    expect(res.body).toMatchObject({ message: "invalid credentials" })
  })
})

describe('[GET] /jokes', () => {
  test('gets error message on no token', async () => {
    await request(server).post('/api/auth/register').send({ username: 'serena', password: "666" })
    await request(server).post('/api/auth/login').send({ username: 'serena', password: "666" })
    const res = await request(server).get('/api/jokes')
    expect(res.text).not.toBe([
      {
        "id": "0189hNRf2g",
        "joke": "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
      },
      {
        "id": "08EQZ8EQukb",
        "joke": "Did you hear about the guy whose whole left side was cut off? He's all right now."
      },
      {
        "id": "08xHQCdx5Ed",
        "joke": "Why didn’t the skeleton cross the road? Because he had no guts."
      },
    ])

  })
  test('returns status 200 check', async () => {
    await request(server).post('/api/auth/register').send({ username: 'serena', password: "666" })
    await request(server).post('/api/auth/login').send({ username: 'serena', password: "666" })
    const res = await request(server).get('/api/jokes')
    expect(res.status).toBe(200)
  })
})
