const request = require('supertest');
const app = require('../../app');
const assert = require('assert');
const baseURI = require('../setupTests').baseURI;
/* specify the url to be intercepted, here we use any string because we
 * are not sure the arbitrary port that will be assigned to the server during
 * testing
 */

describe('Test User Routes,[Un-Mocked Endpoints]', () => {
  it('', () => {
    it('should return a 200 OK response for the index route', (done) => {
      request(app)
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          return done();
        });
    });
  });
});

describe('Test User Routes,[Mocked Ednpoints]', () => {
  it("should return a 201 Created response for the 'users/register' route", (done) => {
    baseURI.post('/users/register').reply(201, {
      message:
        'Done, an email was sent to nabrrikk@yahoo.com. Click on the link in the email to confirm your email',
    });
    const data = {
      full_name: 'Nabaasa Richard',
      dob: '12-09-1789',
      email: 'nabrrikk@andela.com',
      contact: '0704367965',
      origin: 'Kampala',
    };
    request(app)
      .post('/users/register')
      .send(data)
      .expect('Content-Type', /json/)
      .expect(201)
      .expect({
        message:
          'Done, an email was sent to nabrrikk@yahoo.com. Click on the link in the email to confirm your email',
      })
      .end((err, res) => (err ? done(err) : done()));
  });
  it('should edit a user', (done) => {
    baseURI.put('/users/edit').reply(201, { message: 'Successfully edited' });
    const data = {};
    request(app)
      .put('/users/edit')
      .send(data)
      .expect('Content-Type', /json/)
      .expect({
        message: 'Successfully edited',
      })
      .end((err, res) => (err ? done(err) : done()));
  });
  it('should be able to set the password', (done) => {
    baseURI
      .post('/users/setpassword')
      .reply(200, { message: 'Password set sucessfully' });

    const data = {
      user_id: 10,
      password: 'lalala',
    };
    request(app)
      .post('/users/setpassword')
      .send(data)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({ message: 'Password set sucessfully' })
      .end((err, res) => (err ? done(err) : done()));
  });

  it('should be able to Login', (done) => {
    const sampleLoginResponse = {
      message: 'Login successful',
      token: 'eyJhbGciOiJIUz-Long-JWT-Token-eyJhbGciOiJIUz',
      user: {
        id: 10,
        full_name: 'Nabaasa Richard',
        origin: 'Kampala',
        dob: '1789-12-08T21:32:44.000Z',
        contact: '0704367966',
        email: 'nabrrikk@yahoo.com',
        verified: true,
      },
    };
    baseURI.post('/users/login').reply(200, sampleLoginResponse);

    const data = {
      user_id: 10,
      password: 'lalala',
    };
    request(app)
      .post('/users/login')
      .send(data)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(sampleLoginResponse)
      .end((err, res) => (err ? done(err) : done()));
  });
  it('should be able to verify an email with the randomly generated URI', (done) => {
    baseURI.get(/\.*/).reply(200, { success: 'Email has been verified' });

    request(app)
      .get('/users/ew564g43b2s')
      .expect(200)
      .expect({ success: 'Email has been verified' })
      .end((err, res) => (err ? done(err) : done()));
  });
});
