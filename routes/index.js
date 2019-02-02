const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ name: 'Welcome to Block' });
  // res.render('index', { title: 'Express' });
});

module.exports = router;
