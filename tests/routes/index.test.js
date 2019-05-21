const request = require('supertest');
const nock = require('nock');
const app = require('../../app');
const assert = require('assert');

describe('Test the Index Routes', () => {
  it('should load the index route', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => (err ? done(err) : done()));
  });
});
