const request = require('supertest');
const nock = require('nock');
const app = require('../../app');
const baseURI = require('../setupTests').baseURI;

describe('Test the Payments Routes', () => {
  it('enables a user to make a payment', (done) => {
    baseURI
      .post('/payments')
      .reply(201, { message: 'Payment has been recorded' });
    request(app)
      .post('/payments')
      .expect('Content-Type', /json/)
      .expect(201)
      .expect({ message: 'Payment has been recorded' })
      .end((err, res) => (err ? done(err) : done()));
  });
});
