const User = require('../models/user');

function getInformations(req) {
    let informations = {
        successAddMessage: req.session.successAddMessage || null,
        errorAddMessage: req.session.errorAddMessage || null
    }; 
    return informations;
};

function resetInformations(req) {
    req.session.successAddMessage = null;
    req.session.errorAddMessage = null;
}

async function add(req, res, next) {
    const temp = ({
        lastName : req.body.lastName,
        firstName :req.body.firstName,
        email :    req.body.email,
        password : req.body.password
    });

    try {
        let user = await User.create(temp);
        req.session.successAddMessage = `L'utilisateur ${user.firstName} ${user.lastName} a bien été ajouté`;
        return res.redirect('/users');
    } catch (error) {
        if (error.message.includes("duplicate key error collection")) {
            req.session.errorAddMessage = "Un utilisateur utilise déjà cette adresse mail";
            return res.redirect('/users');
        } else {
            let userName = `${req.body.firstName} ${req.body.lastName}`;
            req.session.errorAddMessage = `L'utilisateur ${userName} n'a pas pu être ajouté`;
            return res.redirect('/users');
        };       
    }
}

module.exports = { getInformations, resetInformations, add};