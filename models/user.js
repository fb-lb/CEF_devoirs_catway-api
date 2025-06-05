const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const User = new Schema({
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Le nom est requis']
    },
    firstName: {
        type: String,
        trim: true,
        required: [true, 'Le prénom est requis']
    },
    email: {
        type: String,
        trim: true,
        required: [true, "L'email est requis"],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Mot de passe requis']
    }
}, {
    timestamps: true
});

User.pre('save', async function(){
    if(!this.isModified('password')) {
        return;
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
        console.error(err);
        throw err;
    }
});

module.exports = mongoose.model('User', User);