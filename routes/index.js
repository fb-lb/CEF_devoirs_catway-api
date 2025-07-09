var express = require('express');
var router = express.Router();

const userRoute = require('../routes/users');
const catwayRoute = require('../routes/catways');
const reservationRoute = require('../routes/reservations');
const private = require('../middlewares/private');
const serviceCatways = require('../services/catways');
const serviceReservations = require('../services/reservations');

router.get('/', function(req, res, next) {
    res.render('home-page', { scripts: ['/javascripts/home-page.js'] });
});

router.get('/documentation-api', (req, res, next) => {
    let scripts = ['/javascripts/api-doc.js'];
    res.render('api-doc', { scripts: scripts });
});

router.get('/tableau-de-bord',private.checkJWT , (req, res, next) => {
    let scripts = ['/javascripts/dashboard/dashboard-users.js', '/javascripts/dashboard/dashboard-catways.js', '/javascripts/dashboard/dashboard-reservations.js'];
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

router.get('/catway/:id', private.checkJWT, async (req, res, next) => {
    try {
        const catway = await serviceCatways.get(req.params.id);
        res.render('catway-details', { catway });
    } catch(error) {
        const catway = {'message' : 'Nous ne parvenons pas à récupérer les détails du catway.'};
        res.render('catway-details', { catway });
    }
});

router.get('/liste-des-reservations', private.checkJWT, async (req, res, next) => {
    try {
        const reservations = await serviceReservations.getAll();
        const catways = await serviceCatways.getAll();
        reservations.forEach(reservation => {
            const checkIn = new Date(reservation.checkIn);
            reservation.checkIn = checkIn.toLocaleString().slice(0, -3);
            const checkOut = new Date(reservation.checkOut);
            reservation.checkOut = checkOut.toLocaleString().slice(0, -3);
            let catway = catways.find(c => c.catwayNumber == reservation.catwayNumber);
            reservation.catwayId = catway._id;
        });
        res.render('reservations-list', { reservations });
    } catch (error) {
        const reservations = {'message' : 'Nous ne parvenons pas à récupérer la liste des réservations.'};
        res.render('reservations-list', { reservations });
    } 
});

router.get('/catway/:id/reservation/:idReservation', private.checkJWT, async (req, res, next) => {
    try {
        const reservation = await serviceReservations.get(req.params.id, req.params.idReservation);
        const checkIn = new Date(reservation.checkIn); 
        reservation.checkIn = checkIn.toLocaleString().slice(0, -3);
        const checkOut = new Date(reservation.checkOut);
        reservation.checkOut = checkOut.toLocaleString().slice(0, -3);
        res.render('reservation-details', { reservation });
    } catch(error) {
        const reservation = {'message' : 'Nous ne parvenons pas à récupérer les détails de la réservation.'};
        res.render('reservation-details', { reservation });
    }
});

router.use('/users', userRoute);
router.use('/catways', catwayRoute);
router.use('/catways', reservationRoute);

// Redirection for ressources 404 not found
router.use((req, res, next) => {
    res.status(404);
    res.render('404');
})

module.exports = router;
