var express = require('express');
var router = express.Router();
const service = require('../services/users');
const private = require('../middlewares/private');

router.post('/', private.checkJWT, service.add);

router.get('/:id', private.checkJWT, service.get);

router.patch('/:id', private.checkJWT, service.update);

router.delete('/:id', private.checkJWT, service.deleteUser);

router.post('/authenticate', service.authenticate);

router.post('/logout', service.logout)

module.exports = router;
