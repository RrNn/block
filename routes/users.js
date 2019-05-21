const express = require('express');
const router = express.Router();
const User = require('../models/User');
const middleware = require('./middleware');

// this is the user object that
// will be used for all routes that need it.
user = new User();

router.get('/', function(req, res, next) {
  User.all()
    .then((data) => {
      res.json({ data: data });
    })
    .catch((error) => {
      console.error(error);
      res.json({ Error: error });
    });
});

router.post('/register', (req, res, next) => {
  user
    .register(req.body)
    .then((resp) => {
      res.statusCode = 201;
      res.json({ message: resp });
    })
    .catch((error) => {
      const errText = error.detail
        ? `The${error.detail.replace(/\(|\)|(Key)/gi, '')}`
        : 'An error occured';
      res.json({ message: errText.replace(/=/, ' ') });
    });
});

router.put('/edit', middleware.checkToken, (req, res, next) => {
  user
    .edit(req.body)
    .then((resp) => {
      res.json({ message: resp });
    })
    .catch((error) => {
      console.error(error);
      res.json({ message: error });
    });
});

router.post('/setpassword', (req, res, next) => {
  user
    .setPassword(req.body)
    .then((resp) => {
      res.json(resp);
    })
    .catch((error) => {
      res.json(error);
    });
});

router.post('/login', (req, res, next) => {
  User.login(req.body.email, req.body.password)
    .then((resp) => {
      res.json(resp);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/*', (req, res, next) => {
  // Pass the sha to the emailVerified method on the user.
  User.verifyEmail(req.url.replace('/', ''))
    .then((resp) => {
      res.json(resp);
    })
    .catch((error) => {
      res.json(error);
    });
});

module.exports = router;
