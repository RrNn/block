const nock = require('nock');

const setUp = {
  /* specify the url to be intercepted, here we use any string because we
   * are not sure the arbitrary port that will be assigned to the server during
   * testing
   */
  baseURI: nock(/\.*/),
};

module.exports = setUp;
