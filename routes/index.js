var express = require('express');
var router = express.Router();

const userRoute = require('../routes/users');
const catwayRoute = require('../routes/catways');
const private = require('../middlewares/private');
const serviceCatways = require('../services/catways');

router.get('/', function(req, res, next) {
    res.render('home-page', { scripts: ['/javascripts/home-page.js'] });
});

router.get('/tableau-de-bord',private.checkJWT , (req, res, next) => {
    let scripts = ['/javascripts/dashboard/dashboard-users.js', '/javascripts/dashboard/dashboard-catways.js'];
    res.render('dashboard', { scripts: scripts });
});

router.get('/liste-des-catways', private.checkJWT, async (req, res, next) => {
    try {
        const catways = await serviceCatways.getAll();
        res.render('catways-list', { catways });
    } catch (error) {
        const catways = {'message' : 'Nous ne parvenons pas à récupérer la liste des catways.'};
        res.render('catways-list', { catways });
    } 
});

router.use('/users', userRoute);
router.use('/catways', catwayRoute);

module.exports = router;
