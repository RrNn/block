const express = require('express');
const router = express.Router();
const User = require('../models/User');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource', req, res, next);
});

// this is the user object that
// will be used for all routes that need it.
user = new User();

router.post('/register', (req, res, next) => {
  user
    .register(req.body)
    .then((resp) => {
      res.json({ message: resp });
    })
    .catch((error) => {
      const errText = error.detail
        ? `The${error.detail.replace(/\(|\)|(Key)/gi, '')}`
        : 'An error occured';
      res.json({ message: errText.replace(/=/, ' ') });
    });
});

router.put('/edit', (req, res, next) => {
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

module.exports = router;
