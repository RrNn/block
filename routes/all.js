const express = require('express');
const router = express.Router();
const User = require('../models/User');

// console.log('In the route-->', User.all().then((data) => console.log(data)));

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

module.exports = router;
