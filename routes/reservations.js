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

router.get('/:id', private.checkJWT, async (req, res, next) => {
    try {
        const reservation = await service.get(req.params.id);
        return res.status(200).json(reservation);
    } catch (error) {
        if (error.message == 'RESERVATION_NOT_FOUND') {
            return res.status(404).json({'message': "Cet identifiant ne correspond à aucune réservation."});
        } else {
            return res.status(501).json({'message': 'Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement.'});
        }
    }
});

router.patch('/:id', private.checkJWT, async (req, res, next) => {
    try {
        const response = await service.update(req.params.id, req.body);
        return res.status(204).send();
    } catch (error) {
        if (error.message == 'ALL_FIELDS_REQUIRED') {
            return res.status(400).json({ 'message' : 'Tous les champs sont requis.'});
        } else if (error.message == 'RESERVATION_NOT_FOUND') {
            return res.status(404).json({ 'message' : 'Cet identifiant ne correspond à aucune réservation enregistrée.'});
        } else if (error.message === 'INVALID_CATWAY_NUMBER') {
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
            return res.status(501).json({'message': 'Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement.'});
        }
    }
});

router.delete('/:id', private.checkJWT, async (req, res, next) => {
    try {
        const response = await service.deleteReservation(req.params.id);
        return res.status(204).send();
    } catch (error) {
        if (error.message == 'RESERVATION_NOT_FOUND') {
            return res.status(404).json({ 'message': 'Cet identifiant ne correspond à aucune réservation.' });
        } else if (error.message.includes('Cast to ObjectId failed')) {
            return res.status(403).json({ 'message': "L'identifiant doit faire 24 caractères et doit contenir des chiffres et des lettres." });
        } else {
            return res.status(501).json({'message': 'Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement.'});
        }
    }
});

module.exports = router;