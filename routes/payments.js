const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Cash = require("../models/Cash");
const middleware = require("./middleware");

const cash = new Cash
router.post('/',middleware.checkToken, (req,res,next)=>{
  cash.pay(req.body)
  .then(resp=>{
    res.send(resp)
  })
  .catch(console.log)
})

module.exports = router;