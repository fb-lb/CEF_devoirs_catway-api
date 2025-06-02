const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function add(req, res, next) {
    const temp = ({
        lastName : req.body.lastName,
        firstName :req.body.firstName,
        email :    req.body.email,
        password : req.body.password
    });

    try {
        let user = await User.create(temp);
        successAddMessage = { 'message': `L'utilisateur ${user.firstName} ${user.lastName} a bien été ajouté` }
        return res.status(201).json(successAddMessage);
    } catch (error) {
        if (error.message.includes("duplicate key error collection")) {
            errorAddMessage = { 'message': 'Un utilisateur utilise déjà cette adresse mail' };
            return res.status(403).json(errorAddMessage);
        } else {
            let userName = `${req.body.firstName} ${req.body.lastName}`;
            errorAddMessage = { 'message': `L'utilisateur ${userName} n'a pas pu être ajouté. Assurez-vous d'avoir rempli tous les champs.` };
            return res.status(400).json(errorAddMessage);
        };       
    }
};

async function authenticate(req, res, next) {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email }, '-__v -createdAt -updatedAt');

        if (user) {
            bcrypt.compare(password, user.password, (err, response) => {
                if (err) {
                    throw new Error(err);
                }
                if (response) {
                    delete user._doc.password;

                    const expireIn = 60 * 60 * 24;
                    const token = jwt.sign({
                        user: user
                    },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: expireIn
                    });

                    res.cookie('token', token, {
                        sameSite: 'Lax',
                        httpOnly: true,
                        secure: process.env.SECURE_COOKIE,
                        maxAge: 1000 * 60 * 60 * 24
                    });
                    res.cookie('firstName', user.firstName, {
                        sameSite: 'Lax',
                        httpOnly: false,
                        secure: process.env.SECURE_COOKIE,
                        maxAge: 1000 * 60 * 60 * 24
                    });
                    res.cookie('lastName', user.lastName, {
                        sameSite: 'Lax',
                        httpOnly: false,
                        secure: process.env.SECURE_COOKIE,
                        maxAge: 1000 * 60 * 60 * 24
                    });
                    let message = { 'message': `Vous êtes connectés ${user.firstName} ${user.lastName}.`};
                    return res.status(200).json(message);
                }
                let message = { 'message': 'Email et/ou mot de passe incorrect'};
                return res.status(403).json(message);
            });
        } else {
            let message = { 'message': 'Email incorrect'};
            return res.status(404).json(message);
        }
    } catch (error) {
        let message = { 'message': 'Utilisateur introuvable, avez-vous rempli tous les champs ?'};
        return res.status(501).json(message);
    }
};

async function deleteUser(req, res, next) {
    let id = req.params.id;
    try {
        let user = await User.findById(id);
        if(user) {
            await User.deleteOne({_id: id});
            return res.status(204).send();
        } else {
            return res.status(404).json({'message': 'Cet identifiant ne correspond à aucun utilisateur'});
        }
    } catch (error) {
        return res.status(501).json({'message': "Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement."});
    }
};

async function get(req, res, next) {
    const id = req.params.id;
    try {
        let user = await User.findById(id, '-password -__v -createdAt -updatedAt');
        if(user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({'message': 'Cet identifiant ne correspond à aucun utilisateur'});
        }
    } catch (error) {
        res.status(501).json({'message': 'Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement.'});
    }
};

function logout(req, res, next) {
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
};

async function update(req, res, next) {
    let id = req.params.id;
    let currentPassword = req.body.currentPassword;
    let newPassword = req.body.newPassword;

    try {
        if (!req.body.email || !req.body.lastName || !req.body.firstName) {
            return res.status(400).json({'message': 'Les champs Email, Nom et Prénom sont requis.'});
        }
        let user = await User.findById(id);
        if(user) {
            if(!currentPassword && !newPassword) {
                user.email = req.body.email;
                user.lastName = req.body.lastName;
                user.firstName = req.body.firstName;
                await user.save();
                return res.status(204).send();
            } else if (await bcrypt.compare(currentPassword, user.password)) {
                if (!newPassword) {
                    return res.status(400).json({'message': 'Le nouveau mot de passe doit contenir au moins un caractère.'});
                }
                user.email = req.body.email;
                user.lastName = req.body.lastName;
                user.firstName = req.body.firstName;
                user.password = newPassword;
                await user.save();
                return res.status(204).send();
            } else {
                return res.status(403).json({'message': 'Mot de passe actuel incorrect.'});
            }
        } else {
            return res.status(404).json({'message': 'Cet identifiant ne correspond à aucun utilisateur'});
        }
    } catch (error) {
        return res.status(501).json({'message': "Nous ne parvenons pas à nous connecter à notre base de données. Veuillez réessayer ultérieurement."});
    }
};

module.exports = { add, authenticate, deleteUser, get, logout, update};