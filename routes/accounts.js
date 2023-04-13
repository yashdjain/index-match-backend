var express = require('express');
var router = express.Router();
const { createNewAccount } = require('../database')

/* Create new accounts listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
 
router.post('/create', function(req, res, next) {
  const details = Object.values(req.body)
  createNewAccount(details)
  res.send('respond with a resource');
});

module.exports = router;