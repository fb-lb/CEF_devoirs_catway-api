var express = require('express');
var router = express.Router({ mergeParams: true });
const service = require('../services/reservations');
const private = require('../middlewares/private');

router.post('/:id/reservations/', private.checkJWT, async (req, res, next) => {
    try {
        const reqBody = req.body;
        const response = await service.add(reqBody, req.params.id);
        return res.status(204).send();
    } catch (error) {
        if (error.message === 'INVALID_CATWAY_ID') {
            return res.status(403).json({'message': "Attention cet identifiant de catway ne correspond à aucun catway."});
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

router.get('/all/reservations/all', private.checkJWT, async (req, res) => {
    try {
        const reservations = await service.getAll();
        return res.status(200).json(reservations);
    } catch (error) {
        return res.status(501).json({'message': 'Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement.'});
    }
});

router.get('/:id/reservations/:idReservation', private.checkJWT, async (req, res, next) => {
    try {
        const reservation = await service.get(req.params.id, req.params.idReservation);
        return res.status(200).json(reservation);
    } catch (error) {
        if (error.message == 'RESERVATION_NOT_FOUND') {
            return res.status(404).json({'message': "L'identifiant de la réservation ne correspond à aucune réservation pour ce catway."});
        } else if (error.message == 'CATWAY_NOT_FOUND') {
            return res.status(404).json({'message': "L'identifiat du catway ne correspond à aucun catway."});
        } else {
            return res.status(501).json({'message': 'Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement.'});
        }
    }
});

router.patch('/:id/reservations/:idReservation', private.checkJWT, async (req, res, next) => {
    try {
        const response = await service.update(req.params.id, req.params.idReservation, req.body);
        return res.status(204).send();
    } catch (error) {
        if (error.message == 'ALL_FIELDS_REQUIRED') {
            return res.status(400).json({ 'message' : 'Tous les champs sont requis.'});
        } else if (error.message == 'RESERVATION_NOT_FOUND') {
            return res.status(404).json({ 'message' : 'Cet identifiant ne correspond à aucune réservation enregistrée sur ce catway.'});
        } else if (error.message == 'INVALID_CATWAY_IN_URL') {
            return res.status(404).json({ 'message' : "L'identifiant de catway renseigné dans l'URL ne correspond à aucun catway."});
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

router.delete('/:id/reservations/:idReservation', private.checkJWT, async (req, res, next) => {
    try {
        const response = await service.deleteReservation(req.params.id, req.params.idReservation);
        return res.status(204).send();
    } catch (error) {
        if (error.message == 'CATWAY_NOT_FOUND') {
            return res.status(404).json({ 'message': "L'identifant du catway dans l'URL ne correspond à aucun catway enregistré." });
        } else if (error.message == 'RESERVATION_NOT_FOUND') {
            return res.status(404).json({ 'message': 'Cet identifiant ne correspond à aucune réservation faite sur ce catway.' });
        } else if (error.message.includes('Cast to ObjectId failed')) {
            return res.status(403).json({ 'message': "L'identifiant doit faire 24 caractères et doit contenir des chiffres et des lettres." });
        } else {
            return res.status(501).json({'message': 'Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement.'});
        }
    }
});

module.exports = router;