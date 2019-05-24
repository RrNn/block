const request = require('supertest');
const app = require('../app');
const assert = require('assert');
const helpers = require('../models/helpers');
const db = require('../config/database');
const setUp = require('./setupTests');

describe('Test the referralMax method', () => {
  it('should return 0 if the refferer_user_id is not passed', async () => {
    const resp = await helpers.referralMax();
    assert.equal(resp, 0);
  });

  it('should return the number of users reffered by the user referring another', async () => {
    /*
    this basically means,given that a user is registering and they have sent data with the
    referrer_user_id, the function should check the user with this id and return the number
    of users that user has referred. R'mba if they are already 4, we wont allow becasue a given
    user can only refer up to 4 other users.
     */

    const resp = await helpers.referralMax(1);
    assert.equal(resp, 0);
  });
  it('checks whether the use exists', async () => {
    // here we expect to get a false on the first assertion and a true on the next assertion
    // because the function return true if no user_id is passed along
    const userOneExists = await helpers.userExists(1);
    const userTwoExists = await helpers.userExists();
    assert.equal(userOneExists, false);
    assert.equal(userTwoExists, true);
  });
  it('returns true if the user exists [ Truly ]', async () => {
    // create the user to use
    const result = await setUp.db.query(
      `insert into users (full_name,origin,dob,contact,email,verified) values ('Peter Drury','UK','12-06-1990','0789574631','peter@drury.org','true') returning id`
    );

    const userTrulyExists = await helpers.userExists(result[0].id);
    assert.equal(userTrulyExists, true);
  });
});
