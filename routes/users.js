var express = require('express');
var router = express.Router();
const service = require('../services/users');

router.get('/', function(req, res, next) {
  const informations = service.getInformations(req);
  service.resetInformations(req);
  res.render('users', informations);
});

router.post('/', service.add);

module.exports = router;
