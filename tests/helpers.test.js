const request = require('supertest');
const app = require('../app');
const assert = require('assert');
const helpers = require('../models/helpers');
const db = require('../config/database');

console.log('+++++++++++++++', process.env.NODE_ENV);

// console.log(assert);
// before(function(done) {
//   console.log('THE_ENVIRONMENT', process.env.NODE_ENV);
//   eval('db-migrate up');

//   done();
// });
describe('Test the referralMax method', () => {
  // beforeEach(async () => {
  //   const result = await eval('db-migrate up');
  //   console.log('MIGRATED', result);
  // });
  // afterEach(() => {
  //   // eval('db-migrate down');
  // });
  // before(async function(done) {
  //   try {
  //     const result = await eval('db-migrate reset && db-migrate up');
  //     console.log('MIGRATED', result);
  //   } catch (e) {
  //     console.log('ERROR__:', e);
  //   }

  //   done();
  // });
  it('should return 0 if the refferer_user_id is not passed', async () => {
    const resp = await helpers.referralMax();
    console.log('RESP_ONE', resp);
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
    console.log('RESP_TWO', resp);
    assert.equal(resp, 4);
  });
});
