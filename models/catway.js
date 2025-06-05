const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Catway = new Schema({
    catwayNumber: {
        type: Number,
        unique: true,
        trim: true,
        required: [true, "Le numéro est requis"],
    },
    type : {
        type: String,
        trim: true,
        required: [true, "Le type est requis"],
        enum: {
            values: ['short', 'long'],
            message: 'Le type doit être "short" ou "long".'
        }
    },
    catwayState: {
        type: String,
        trim: true,
        required: [true, "La description de l'état du catway est requise."]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Catway', Catway);