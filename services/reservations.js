const Reservation = require('../models/reservation');
const Catway = require('../models/catway');

async function add(reqBody) {
    try {
        const reservations = await Reservation.find({catwayNumber: reqBody.catwayNumber});

        const catway = await Catway.findOne({catwayNumber: reqBody.catwayNumber});
        const checkIn = Date.parse(reqBody.checkIn);
        const checkOut = Date.parse(reqBody.checkOut);
        const now = Date.now();

        reservations.forEach((reservation) => {
            const checkInReservation = Date.parse(reservation.checkIn);
            const checkOutReservation = Date.parse(reservation.checkOut);
            if (checkIn >= checkInReservation && checkIn <= checkOutReservation) throw new Error('CHECK_IN_ALREADY_RESERVED');
            if (checkOut >= checkInReservation && checkOut <= checkOutReservation) throw new Error('CHECK_OUT_ALREADY_RESERVED');
            if (checkIn <= checkInReservation && checkOut >= checkOutReservation) throw new Error('RESERVATION_IN_REQUEST');
        });

        if (!catway) throw new Error('INVALID_CATWAY_NUMBER');
        if (checkIn < now) throw new Error('INVALID_CHECK_IN');
        if (checkIn > checkOut) throw new Error('INVALID_CHECK_OUT');

        await Reservation.create({
            catwayNumber: reqBody.catwayNumber,
            clientName: reqBody.clientName,
            boatName: reqBody.boatName,
            checkIn: reqBody.checkIn,
            checkOut: reqBody.checkOut
        });
        return true;
    } catch (error) {
        throw error;
    }
};

async function deleteReservation(id) {
    try {
        const reservation = await Reservation.findById(id);
        if (reservation) {
            await reservation.deleteOne({_id: id});
            return true;
        } else {
            throw new Error('RESERVATION_NOT_FOUND');
        }
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

async function get(id) {
    try {
        const reservation = await Reservation.findById(id, '-__v -createdAt -updatedAt');
        if (reservation) {
            return reservation;
        } else {
            throw new Error('RESERVATION_NOT_FOUND');
        }
    } catch (error) {
        throw error;
    }
};

async function getAll() {
    try {
        const reservations = await Reservation.find();
        return reservations;
    } catch (error) {
        throw error;
        
    }
};

async function update(id, reqBody) {
    try {
        if (!reqBody.clientName || !reqBody.boatName || !reqBody.catwayNumber || !reqBody.checkIn || !reqBody.checkOut ) {
            throw new Error('ALL_FIELDS_REQUIRED');
        }

        const reservation = await Reservation.findById(id);
        if (!reservation) throw new Error('RESERVATION_NOT_FOUND');

        const reservations = await Reservation.find({
            catwayNumber: reqBody.catwayNumber,
            _id: { $ne: id }
        });

        const checkIn = Date.parse(reqBody.checkIn);
        const checkOut = Date.parse(reqBody.checkOut);
        const now = Date.now();
        const catway = await Catway.findOne({catwayNumber: reqBody.catwayNumber});

        reservations.forEach((reservation) => {
            const checkInReservation = Date.parse(reservation.checkIn);
            const checkOutReservation = Date.parse(reservation.checkOut);
            if (checkIn >= checkInReservation && checkIn <= checkOutReservation) throw new Error('CHECK_IN_ALREADY_RESERVED');
            if (checkOut >= checkInReservation && checkOut <= checkOutReservation) throw new Error('CHECK_OUT_ALREADY_RESERVED');
            if (checkIn <= checkInReservation && checkOut >= checkOutReservation) throw new Error('RESERVATION_IN_REQUEST');
        });

        if (!catway) throw new Error('INVALID_CATWAY_NUMBER');
        if (checkIn < now) throw new Error('INVALID_CHECK_IN');
        if (checkIn > checkOut) throw new Error('INVALID_CHECK_OUT');

        reservation.clientName = reqBody.clientName;
        reservation.boatName = reqBody.boatName;
        reservation.catwayNumber = reqBody.catwayNumber;
        reservation.checkIn = reqBody.checkIn;
        reservation.checkOut = reqBody.checkOut;
        await reservation.save();
        return true;
    } catch (error) {
        throw error;
    }
};

module.exports = { add, deleteReservation, get, getAll, update};