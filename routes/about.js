/*
 * this file is not so important in the app, just for a few references
 */
const express = require('express');
const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.use('/location', function(req, res, next) {
  console.log('The about us location middleware has been hit');
  console.log('Request Method--->', req.method);
  console.log('Original Url--->', req.originalUrl);
  next();
});

router.get(
  '/',
  function(req, res, next) {
    console.log('Doing other things');
    next();
  },
  function(req, res) {
    const data = [
      { name: 'User one' },
      { name: 'User two' },
      { name: 'User three' },
    ];
    res.json({ data: data });
  }
);

router.get('/location', function(req, res, next) {
  res.json({ location: 'We are located in 55 countries world wide' });
});

router.get('/un', function(req, res, next) {
  setTimeout(function() {
    try {
      throw new Error('Not found, Broken!');
    } catch (error) {
      next(error);
    }
  }, 1000);
});

module.exports = router;
