const Catway = require('../models/catway');

async function add(reqBody) {
    const temp =({
        catwayNumber: reqBody.catwayNumber,
        type: reqBody.type,
        catwayState: reqBody.catwayState
    });

    try {
        await Catway.create(temp);
        return true;
    } catch (error) {
        if (error.message.includes("duplicate key error collection")) {
            throw new Error('CATWAY_NUMBER_ALREADY_EXIST');
        } else {
            throw error;
        };
    }
};

async function deleteCatway(id) {
    try {
        const catway = await Catway.findById(id);
        if (catway) {
            await Catway.deleteOne({_id: id});
            return true;
        } else {
            throw new Error('CATWAY_NOT_FOUND');
        }
    } catch (error) {
        throw error;
    }
};

async function get(id) {
    try {
        const catway = await Catway.findById(id, '-__v -createdAt -updatedAt');
        if (catway) {
            return catway;
        } else {
            throw new Error('CATWAY_NOT_FOUND');
        }
    } catch (error) {
        throw error;
    }
};

async function getAll() {
    try {
        const catways = await Catway.find().select('-__v -createdAt -updatedAt');
        return catways;
    } catch (error) {
        throw error;
    }
}

async function update(id, reqBody) {
    try {
        if (!reqBody.catwayNumber || !reqBody.type || !reqBody.catwayState) {
            throw new Error('ALL_FIELDS_REQUIRED');
        }
        const catway = await Catway.findById(id);
        if (catway) {
            catway.catwayNumber = reqBody.catwayNumber;
            catway.type = reqBody.type;
            catway.catwayState = reqBody.catwayState;
            await catway.save();
            return true;
        } else {
            throw new Error('CATWAY_NOT_FOUND');
        }
    } catch (error) {
        throw error;
    }
};

module.exports = { add, deleteCatway, get, getAll, update };