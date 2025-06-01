const mongoose = require('mongoose');

exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO);
        console.log('Connected to the catway database');
    } catch (err) {
        console.error('Connection error to the catway databse : ', err);
    }
}