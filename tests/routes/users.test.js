const request = require('supertest');
const app = require('../../app');
const assert = require('assert');
const setUp = require('../setupTests');

describe('Test User Routes', () => {
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
  it("should return a 201 Created response for the 'users/register' route", (done) => {
    request(app)
      .post('/users/register')
      .send(setUp.userRegistrationData)
      .expect('Content-Type', /json/)
      .expect(201)
      .expect({
        message:
          'Done, an email was sent to nabrrikk@yahoo.com. Click on the link in the email to confirm your email',
      })
      .end((err, res) => (err ? done(err) : done()));
  });
  it('should edit a user', (done) => {
    request(app)
      .put('/users/edit')
      .send(setUp.userEditData)
      .set('Authorization', setUp.authToken)
      .expect('Content-Type', /json/)
      .expect({
        message: 'Successfully edited',
      })
      .end((err, res) => (err ? done(err) : done()));
  });
  it('should be able to verify an email with the randomly generated URI', async () => {
    const hashedKey = await setUp.db.query(
      `select verified from users where email='petterson@yahoo.com'`
    );
    const result = await request(app).get(`/users/${hashedKey[0].verified}`);
    // console.log(result.body);
    assert.deepEqual(result.body, { success: 'Email has been verified' });
  });
  it('should be able to set the password', (done) => {
    const data = {
      user_id: 2,
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

  it('should be able to Login', async () => {
    /* here we use the use "petterson@yahoo.com" because
    we created the user in the Payments test and thats the 
    user for whom we verified the email and updated the 
    password in the tests above.
    */
    const data = {
      email: 'petterson@yahoo.com',
      password: 'lalala',
    };

    const res = await request(app)
      .post('/users/login')
      .send(data);

    assert.equal(res.body.message, 'Login successful');
    // Since the token will always change, lets just assert that thereturned token is
    // a very long hashed jwt key
    assert(res.body.token.length > 200);
  });
});
