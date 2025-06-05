const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function add(reqBody) {
    const temp = ({
        lastName : reqBody.lastName,
        firstName :reqBody.firstName,
        email :    reqBody.email,
        password : reqBody.password
    });

    try {
        let user = await User.create(temp);
        successAddMessage = { 'message': `L'utilisateur ${user.firstName} ${user.lastName} a bien été ajouté` }
        return successAddMessage;
    } catch (error) {
        if (error.message.includes("duplicate key error collection")) {
            throw new Error('EMAIL_ALREADY_EXIST');
        } else {
            throw error;
        };       
    }
};

async function authenticate(reqBody) {
    const { email, password } = reqBody;

    try {
        let user = await User.findOne({ email: email }, '-__v -createdAt -updatedAt');

        if (user) {
            try {
                const comparaison = await bcrypt.compare(password, user.password);
                if (!comparaison) {
                    throw new Error('INVALID_EMAIL_PASSWORD');
                } else {
                    delete user._doc.password;

                    const token = jwt.sign({
                        user: user
                    },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: 60 * 60 * 24
                    });
                    return {token, user};
                }
            } catch (error) {
                throw error;
            }
        } else {
            throw new Error('INVALID_EMAIL');
        }
    } catch (error) {
        throw error;
    }
};

async function deleteUser(id) {
    try {
        let user = await User.findById(id);
        if(user) {
            await User.deleteOne({_id: id});
            return true;
        } else {
            throw new Error('INVALID_ID');
        }
    } catch (error) {
        throw error;
    }
};

async function get(id) {
    try {
        let user = await User.findById(id, '-password -__v -createdAt -updatedAt');
        if(user) {
            return user
        } else {
            throw new Error('USER_NOT_FOUND');
        }
    } catch (error) {
        throw error;
    }
};

async function update(id, reqBody) {
    let currentPassword = reqBody.currentPassword;
    let newPassword = reqBody.newPassword;

    try {
        if (!reqBody.email || !reqBody.lastName || !reqBody.firstName) {
            throw new Error('EMAIL_NAMES_REQUIRED');
        }
        let user = await User.findById(id);
        if(user) {
            if(!currentPassword && !newPassword) {
                user.email = reqBody.email;
                user.lastName = reqBody.lastName;
                user.firstName = reqBody.firstName;
                await user.save();
                return true;
            } else if (await bcrypt.compare(currentPassword, user.password)) {
                if (!newPassword) {
                    throw new Error('NEW_PASSWORD_EMPTY');
                }
                user.email = reqBody.email;
                user.lastName = reqBody.lastName;
                user.firstName = reqBody.firstName;
                user.password = newPassword;
                await user.save();
                return true;
            } else {
                throw new Error('INVALID_CURRENT_PASSWORD');
            }
        } else {
            throw new Error('INVALID_ID');
        }
    } catch (error) {
        throw error;
    }
};

module.exports = { add, authenticate, deleteUser, get, update};