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

module.exports = { add };