var express = require('express');
var router = express.Router();
const service = require('../services/reservations');
const private = require('../middlewares/private');

router.post('/', private.checkJWT, async (req, res, next) => {
    try {
        const reqBody = req.body;
        const response = await service.add(reqBody);
        return res.status(204).send();
    } catch (error) {
        if (error.message === 'INVALID_CATWAY_NUMBER') {
            return res.status(403).json({'message': "Attention ce numéro de catway ne correspond à aucun catway."});
        } else if (error.message === 'CHECK_IN_ALREADY_RESERVED') {
             return res.status(403).json({'message': "L'arrivée a lieu sur une réservation déjà enregistrée."});
        } else if (error.message === 'CHECK_OUT_ALREADY_RESERVED') {
             return res.status(403).json({'message': "Le départ a lieu sur une réservation déjà enregistrée."});
        } else if (error.message === 'RESERVATION_IN_REQUEST') {
             return res.status(403).json({'message': "Une réservation est déjà enregistrée au cours de la période demandée."});
        } else if (error.message === 'INVALID_CHECK_IN') {
            return res.status(403).json({'message': "Attention la date et l'heure d'arrivée ne peuvent pas être antérieures à maintenant."});
        } else if (error.message === 'INVALID_CHECK_OUT') {
            return res.status(403).json({'message': "La date et l'heure de départ ne peuvent pas être antérieures à l'heure et la date d'arrivée."});
        } else {
            return res.status(501).json({ 'message': "La réservation n'a pas pu être ajoutée. Assurez-vous d'avoir rempli tous les champs." });
        }
    }
});

module.exports = router;