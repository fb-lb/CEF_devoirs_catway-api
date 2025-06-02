var express = require('express');
var router = express.Router();

const userRoute = require('../routes/users');
const private = require('../middlewares/private');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home-page', { scripts: ['/javascripts/home-page.js'] });
});

router.get('/tableau-de-bord',private.checkJWT , (req, res, next) => {
  res.render('dashboard', { scripts: ['/javascripts/dashboard-users.js'] });
});

router.use('/users', userRoute);

module.exports = router;
