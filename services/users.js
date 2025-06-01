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

module.exports = { add, authenticate, logout};