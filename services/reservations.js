const Reservation = require('../models/reservation');
const Catway = require('../models/catway');

async function add(reqBody, catwayId) {
    try {
        const catway = await Catway.findById(catwayId);
        if (!catway) throw new Error('INVALID_CATWAY_ID');
        
        const checkIn = Date.parse(reqBody.checkIn);
        const checkOut = Date.parse(reqBody.checkOut);
        const now = Date.now();
        if (checkIn < now) throw new Error('INVALID_CHECK_IN');
        if (checkIn > checkOut) throw new Error('INVALID_CHECK_OUT');

        const reservations = await Reservation.find({catwayNumber: catway.catwayNumber});
        reservations.forEach((reservation) => {
            const checkInReservation = Date.parse(reservation.checkIn);
            const checkOutReservation = Date.parse(reservation.checkOut);
            if (checkIn >= checkInReservation && checkIn <= checkOutReservation) throw new Error('CHECK_IN_ALREADY_RESERVED');
            if (checkOut >= checkInReservation && checkOut <= checkOutReservation) throw new Error('CHECK_OUT_ALREADY_RESERVED');
            if (checkIn <= checkInReservation && checkOut >= checkOutReservation) throw new Error('RESERVATION_IN_REQUEST');
        });

        await Reservation.create({
            catwayNumber: catway.catwayNumber,
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

async function deleteReservation(idCatway, idReservation) {
    try {
        const catway = await Catway.findById(idCatway);
        if (!catway) throw new Error('CATWAY_NOT_FOUND');

        const reservation = await Reservation.findOne({ _id: idReservation, catwayNumber: catway.catwayNumber });
        if (!reservation) throw new Error('RESERVATION_NOT_FOUND');

        await reservation.deleteOne({_id: idReservation});
        return true;
    } catch (error) {
        throw error;
    }
};

async function get(catwayId, reservationId) {
    try {
        const catway = await Catway.findById(catwayId);
        if (!catway) throw new Error('CATWAY_NOT_FOUND');
        const reservation = await Reservation.findOne({_id: reservationId, catwayNumber: catway.catwayNumber}, '-__v -createdAt -updatedAt')
        if (!reservation) throw new Error('RESERVATION_NOT_FOUND');
        
        return reservation;
    } catch (error) {
        throw error;
    }
};

async function getAll() {
    try {
        const reservations = await Reservation.find().select('-__v -createdAt -updatedAt');
        return reservations;
    } catch (error) {
        throw error;
        
    }
};

async function update(idCatway, idReservation, reqBody) {
    try {
        if (!reqBody.clientName || !reqBody.boatName || !reqBody.catwayNumber || !reqBody.checkIn || !reqBody.checkOut ) {
            throw new Error('ALL_FIELDS_REQUIRED');
        }

        const catway = await Catway.findById(idCatway);
        if (!catway) throw new Error('INVALID_CATWAY_IN_URL');

        const newCatway = await Catway.findOne({catwayNumber: reqBody.catwayNumber});
        if (!newCatway) throw new Error('INVALID_CATWAY_NUMBER');

        const reservation = await Reservation.findOne({_id: idReservation, catwayNumber: catway.catwayNumber});
        if (!reservation) throw new Error('RESERVATION_NOT_FOUND');

        const reservations = await Reservation.find({
            catwayNumber: reqBody.catwayNumber,
            _id: { $ne: idReservation }
        });

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