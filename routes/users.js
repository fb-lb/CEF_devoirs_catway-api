var express = require('express');
var router = express.Router();
const service = require('../services/users');

/*
router.get('/', function(req, res, next) {
  res.render('users', { scripts: ['/javascripts/users.js'] });
});
*/

router.post('/', service.add);

router.post('/authenticate', service.authenticate);

router.post('/logout', service.logout)

module.exports = router;
