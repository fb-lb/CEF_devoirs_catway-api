var express = require('express');
var router = express.Router();

const userRoute = require('../routes/users');
const private = require('../middlewares/private');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home-page', { 
    title: 'Express',
    scripts: ['/javascripts/home-page.js'],
    firstName: req.cookies.firstName || null,
    lastName: req.cookies.lastName || null
   });
});

router.get('/tableau-de-bord',private.checkJWT , (req, res, next) => {
  res.render('dashboard', { 
    scripts: ['/javascripts/users.js'],
    firstName: req.cookies.firstName || null,
    lastName: req.cookies.lastName || null
  });
})

router.use('/users', userRoute);

module.exports = router;
