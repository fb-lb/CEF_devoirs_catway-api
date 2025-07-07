var express = require('express');
var router = express.Router();
const service = require('../services/users');
const private = require('../middlewares/private');

router.post('/', private.checkJWT, async (req, res) => {
    try {
        const result = await service.add(req.body);
        return res.status(201).json(result);
    } catch (error) {
        if (error.message === 'EMAIL_ALREADY_EXIST') {
            errorAddMessage = { 'message': 'Un utilisateur utilise déjà cette adresse mail' };
            return res.status(403).json(errorAddMessage);
        } else {
            let userName = `${req.body.firstName} ${req.body.lastName}`;
            errorAddMessage = { 'message': `L'utilisateur ${userName} n'a pas pu être ajouté. Assurez-vous d'avoir rempli tous les champs.` };
            return res.status(400).json(errorAddMessage);
        }
    }
});

router.get('/:id', private.checkJWT, async (req, res) => {
    try {
        const user = await service.get(req.params.id);
        return res.status(200).json(user);
    } catch (error) {
        if (error.message === 'USER_NOT_FOUND') {
            return res.status(404).json({'message': 'Cet identifiant ne correspond à aucun utilisateur'});
        } else {
            return res.status(501).json({'message': 'Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement.'});
        }
    }
});

router.patch('/:id', private.checkJWT, async (req, res) => {
    try {
        let id = req.params.id;
        let reqBody = req.body;
        const response = await service.update(id, reqBody);
        return res.status(204).send();
    } catch (error) {
        if (error.message === 'EMAIL_NAMES_REQUIRED') {
            return res.status(400).json({'message': 'Les champs Email, Nom et Prénom sont requis.'});
        } else if (error.message === 'NEW_PASSWORD_EMPTY') {
            return res.status(400).json({'message': 'Le nouveau mot de passe doit contenir au moins un caractère.'});
        } else if (error.message === 'INVALID_CURRENT_PASSWORD') {
            return res.status(403).json({'message': 'Mot de passe actuel incorrect.'});
        } else if (error.message === 'INVALID_ID') {
            return res.status(404).json({'message': 'Cet identifiant ne correspond à aucun utilisateur'});
        } else {
            return res.status(501).json({'message': "Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement."});
        }
    }
});

router.delete('/:id', private.checkJWT, async (req, res) => {
    try {
        let id = req.params.id;
        const response = await service.deleteUser(id);
        return res.status(204).send();
    } catch (error) {
        if (error.message === 'INVALID_ID') {
            return res.status(404).json({'message': 'Cet identifiant ne correspond à aucun utilisateur'});
        } else {
            return res.status(501).json({'message': "Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement."});
        }
    }
});

router.post('/authenticate', async (req, res) => {
    try {
        const response = await service.authenticate(req.body);
        res.cookie('token', response.token, {
            sameSite: 'Lax',
            httpOnly: true,
            secure: process.env.SECURE_COOKIE,
            maxAge: 1000 * 60 * 60 * 24
        });
        res.cookie('firstName', response.user.firstName, {
            sameSite: 'Lax',
            httpOnly: false,
            secure: process.env.SECURE_COOKIE,
            maxAge: 1000 * 60 * 60 * 24
        });
        res.cookie('lastName', response.user.lastName, {
            sameSite: 'Lax',
            httpOnly: false,
            secure: process.env.SECURE_COOKIE,
            maxAge: 1000 * 60 * 60 * 24
        });
        const message = { 'message': `Vous êtes connectés ${response.user.firstName} ${response.user.lastName}.`};

        return res.status(200).json(message);
    } catch (error) {
        if (error.message === 'INVALID_EMAIL_PASSWORD') {
            return res.status(403).json({ 'message': 'Email et/ou mot de passe incorrect'});
        } else if (error.message === 'INVALID_EMAIL') {
            return res.status(404).json({ 'message': 'Email incorrect'});
        } else {
            return res.status(501).json({ 'message': 'Utilisateur introuvable, avez-vous rempli tous les champs ?'});
        }
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        sameSite: 'Lax',
        httpOnly: true,
        secure: process.env.SECURE_COOKIE,
    });
    res.clearCookie('firstName', {
        sameSite: 'Lax',
        httpOnly: true,
        secure: process.env.SECURE_COOKIE,
    });
    res.clearCookie('lastName', {
        sameSite: 'Lax',
        httpOnly: true,
        secure: process.env.SECURE_COOKIE,
    });
    let message = { 'message': 'Vous êtes bien déconnecté.' };
    return res.status(200).json(message);
});

module.exports = router;
