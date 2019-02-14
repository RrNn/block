const express = require('express');
const router = express.Router();
const User = require('../models/User');

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

router.get('/*',(req,res,next)=>{
  // Pass the sha to the emailVerified method on the user.
   User.verifyEmail(req.url.replace('/',''))
   .then(resp=>{
    res.send(resp)
   })
   .catch(error=>{
    res.send(error)
   })
})

module.exports = router;
