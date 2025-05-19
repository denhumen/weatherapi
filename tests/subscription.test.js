const request = require('supertest');
const app     = require('../src/app');

describe('Subscribe endpoint', () => {
  it('POST /api/subscribe with no body → 400 + errors', async () => {
    const res = await request(app)
      .post('/api/subscribe')
      .send({})
      .expect(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('POST /api/subscribe with invalid email/frequency → 400 + errors', async () => {
    const res = await request(app)
      .post('/api/subscribe')
      .send({ email: 'not-an-email', city: '', frequency: 'weekly' })
      .expect(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ param: 'email' }),
        expect.objectContaining({ param: 'city' }),
        expect.objectContaining({ param: 'frequency' }),
      ])
    );
  });
});

describe('Confirm and unsubscribe tokens', () => {
  it('GET /api/confirm/:token with bad UUID → 400', async () => {
    await request(app).get('/api/confirm/not-a-uuid').expect(400);
  });
  it('GET /api/unsubscribe/:token with bad UUID → 400', async () => {
    await request(app).get('/api/unsubscribe/1234').expect(400);
  });
});