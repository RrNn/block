const nock = require('nock');
const helpers = require('../models/helpers');
var jwt = require('jsonwebtoken');
const db = require('../config/database');

const setUp = {
  // the database to use oin testing
  db,
  /* specify the url to be intercepted, here we use any string because we
   * are not sure the arbitrary port that will be assigned to the server during
   * testing
   */
  baseURI: nock(/\.*/),
  userRegistrationData: {
    full_name: 'Nabaasa Richard',
    dob: '12-09-1789',
    email: 'nabrrikk@yahoo.com',
    contact: '0704367966',
    origin: 'Kampala',
  },
  userForPaymentsTest: {
    full_name: 'Alexander Petterson',
    dob: '12-09-1789',
    email: 'petterson@yahoo.com',
    contact: '0705678901',
    origin: 'Nairobi',
  },
  // the user object to send when updating the users/edit URI
  userEditData: {
    id: 1,
    full_name: 'Nabaasa Richard Cook',
    dob: '12-09-1789',
    origin: 'Cairo',
  },
  // generate the token to use for authenticated endpoitns
  authToken: jwt.sign(
    {
      id: 1,
      full_name: 'Nabaasa Richard',
      origin: 'Kampala',
      dob: '1789-12-08T21:32:44.000Z',
      contact: '0704367961',
      email: 'nabrrikk@yahoo.com',
      verified: 'true',
    },
    process.env.JWT_CERT,
    {
      expiresIn: '24h',
    }
  ),
};

module.exports = setUp;
