var express = require('express');
var router = express.Router();
const service = require('../services/catways');
const private = require('../middlewares/private');

router.post('/', private.checkJWT, async (req, res) => {
    try {
        const response = await service.add(req.body);
        return res.status(201).json({message: 'Le catway a bien été enregistré'});
    } catch (error) {
        if (error.message === 'CATWAY_NUMBER_ALREADY_EXIST') {
            errorAddMessage = { 'message': 'Un catway possède déjà le même numéro' };
            return res.status(403).json(errorAddMessage);
        } else {
            errorAddMessage = { 'message': "Le catway n'a pas pu être ajouté. Assurez-vous d'avoir rempli tous les champs." };
            return res.status(400).json(errorAddMessage);
        }
    }
});

router.get('/all', private.checkJWT, async (req, res) => {
    try {
        const catways = await service.getAll();
        return res.status(200).json(catways);
    } catch (error) {
        return res.status(501).json({'message': 'Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement.'});
    }
});

router.get('/:id', private.checkJWT, async (req, res) => {
    try {
        const catway = await service.get(req.params.id);
        return res.status(200).json(catway);
    } catch (error) {
        if (error.message == 'CATWAY_NOT_FOUND') {
            return res.status(404).json({'message': "Cet identifiant ne correspond à aucun catway."});
        } else {
            return res.status(501).json({'message': 'Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement.'});
        }
    }
});

router.patch('/:id', private.checkJWT, async (req, res) => {
    try {
        const response = await service.update(req.params.id, req.body);
        return res.status(204).send();
    } catch (error) {
        if (error.message == 'CATWAY_NOT_FOUND') {
            return res.status(404).json({'message': 'Cet identifiant ne correspond à aucun catway.'});
        } else if (error.message == 'ALL_FIELDS_REQUIRED') {
            return res.status(400).json({'message': 'Tous les champs sont requis.'});
        } else if (error.message.includes('duplicate key error collection')) {
            return res.status(403).json({'message': 'Ce numéro est déjà attribué à un autre catway'});
        } else {
            return res.status(501).json({'message': 'Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement.'});
        }
    }
});

router.delete('/:id', private.checkJWT, async (req, res) => {
    try {
        const response = await service.deleteCatway(req.params.id);
        return res.status(204).send();
    } catch (error) {
        if (error.message === 'CATWAY_NOT_FOUND') {
            return res.status(404).json({'message': 'Cet identifiant ne correspond à aucun catway'});
        } else if (error.message === 'CATWAY_RESERVED') {
            return res.status(409).json({ 'message': 'Ce catway ne peut être supprimé pour le moment car il apparaît dans au moins une réservation. Modifiez/Supprimez cette/ces réservation(s) pour pouvoir supprimer ce catway.' });
        } else if (error.message.includes('Cast to ObjectId failed')) {
            return res.status(403).json({ 'message': "L'identifiant doit faire 24 caractères et doit contenir des chiffres et des lettres." });
        } else {
            return res.status(501).json({'message': 'Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement.'});
        }
    }
});

module.exports = router;