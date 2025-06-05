var express = require('express');
var router = express.Router();

const userRoute = require('../routes/users');
const catwayRoute = require('../routes/catways');
const private = require('../middlewares/private');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home-page', { scripts: ['/javascripts/home-page.js'] });
});

router.get('/tableau-de-bord',private.checkJWT , (req, res, next) => {
    let scripts = ['/javascripts/dashboard-users.js', '/javascripts/dashboard-catways.js'];
    res.render('dashboard', { scripts: scripts });
});

router.use('/users', userRoute);
router.use('/catways', catwayRoute);

module.exports = router;
