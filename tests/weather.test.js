const request = require('supertest');
const app     = require('../src/app');

describe('Weather endpoint', () => {
  it('GET /api/weather without city → 400 + errors', async () => {
    const res = await request(app)
      .get('/api/weather')
      .expect(400);
    expect(res.body).toHaveProperty('errors');
  });
});