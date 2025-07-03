const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const sinon = require('sinon');
const Reservation = require('../models/reservation');
const reservationService = require('../services/reservations');
const Catway = require('../models/catway');
const catwayService = require('../services/catways');

describe('Reservation Service - getAll', () => {
    it('should return all reservations data', async () => {
        const mockReservations = [
            {
                _id: new mongoose.Types.ObjectId(),
                catwayNumber: 1,
                clientName: 'Dupont',
                boatName: 'Titanic',
                checkIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
                checkOut: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString()
            },
            {
                _id: new mongoose.Types.ObjectId(),
                catwayNumber: 2,
                clientName: 'Jack Sparrow',
                boatName: 'Black Pearl',
                checkIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
                checkOut: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString()
            }
        ];
        
        const selectStub = sinon.stub().resolves(mockReservations);
        const findStub = sinon.stub(Reservation, 'find').returns({ select : selectStub });
        
        const response = await reservationService.getAll();

        expect(findStub.calledOnce).to.be.true;
        expect(selectStub.calledOnce).to.be.true;
        expect(response).to.deep.equal(mockReservations);

        sinon.restore();
    });
});

describe('Reservation Service - get', () => {
    let reservation, reservationId, catway, catwayId;

    beforeEach(() => {
        catway = {
            _id: new mongoose.Types.ObjectId(),
            catwayNumber: 1,
            catwayState: 'bon état',
            type: 'short'
        };
        catwayId = catway._id.toString();
        reservation = {
            _id: new mongoose.Types.ObjectId(),
            catwayNumber: 1,
            clientName: 'Dupont',
            boatName: 'Titanic',
            checkIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
            checkOut: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString()
        };
        reservationId = reservation._id;
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should return one reservation's data", async () => {
        sinon.stub(Catway, 'findById').resolves(catway);
        sinon.stub(Reservation, 'findOne').resolves(reservation);

        const response = await reservationService.get(catwayId, reservationId);

        expect(Catway.findById.calledOnceWith(catwayId)).to.be.true;
        expect(Reservation.findOne.calledOnce).to.be.true;
        expect(Reservation.findOne.firstCall.args[0]).to.deep.equal({_id: reservationId, catwayNumber: catway.catwayNumber});
        expect(Reservation.findOne.firstCall.args[1]).to.equal('-__v -createdAt -updatedAt');
        expect(response).to.deep.equal(reservation);
    });

    it('should throw an error with CATWAY_NOT_FOUND message', async () => {
        sinon.stub(Catway, 'findById').resolves(null);
        const badCatwayId = new mongoose.Types.ObjectId();

        try {
            await reservationService.get(badCatwayId, reservationId);
            throw new Error("in case that error is not thrown");
        } catch (error) {
            expect(Catway.findById.calledOnceWith(badCatwayId)).to.be.true;
            expect(error).is.instanceOf(Error);
            expect(error.message).to.equal('CATWAY_NOT_FOUND');
        }
    });

    it('should throw an error with RESERVATION_NOT_FOUND message', async () => {
        sinon.stub(Catway, 'findById').resolves(catway);
        sinon.stub(Reservation, 'findOne').resolves(null);

        try {
            await reservationService.get(catwayId, reservationId);
            throw new Error("in case that error is not thrown");
        } catch (error) {
            expect(Catway.findById.calledOnceWith(catwayId)).to.be.true;
            expect(Reservation.findOne.calledOnce).to.be.true;
            expect(Reservation.findOne.firstCall.args[0]).to.deep.equal({_id: reservationId, catwayNumber: catway.catwayNumber});
            expect(Reservation.findOne.firstCall.args[1]).to.equal('-__v -createdAt -updatedAt');
            expect(error).is.instanceOf(Error);
            expect(error.message).to.equal('RESERVATION_NOT_FOUND');
        }
    });
});

describe('Reservation Service - add', () => {
    let reqBody, catway, catwayId, mockReservations;

    beforeEach(() => {
        reqBody = {
            catwayNumber: 1,
            clientName: 'Dupont',
            boatName: 'La Méduse',
            checkIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
            checkOut: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString()
        };
        catway = {
            _id: new mongoose.Types.ObjectId(),
            catwayNumber: 1,
            catwayState: 'bon état',
            type: 'short'
        };
        catwayId = catway._id.toString();
        mockReservations = [
            {
                _id: new mongoose.Types.ObjectId(),
                catwayNumber: 1,
                clientName: 'Dupont',
                boatName: 'Titanic',
                checkIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8).toISOString(),
                checkOut: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString()
            },
            {
                _id: new mongoose.Types.ObjectId(),
                catwayNumber: 1,
                clientName: 'Jack Sparrow',
                boatName: 'Black Pearl',
                checkIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 16).toISOString(),
                checkOut: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString()
            }
        ];
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return true when reservation is added', async () => {
        const temp = {
            catwayNumber: catway.catwayNumber,
            clientName: reqBody.clientName,
            boatName: reqBody.boatName,
            checkIn: reqBody.checkIn,
            checkOut: reqBody.checkOut
        };

        sinon.stub(Catway, 'findById').resolves(catway);
        sinon.stub(Reservation, 'find').resolves(mockReservations);
        sinon.stub(Reservation, 'create').resolves(true);

        const response = await reservationService.add(reqBody, catwayId);

        expect(Catway.findById.calledOnceWith(catwayId)).to.be.true;
        expect(Reservation.find.calledOnceWith({catwayNumber: catway.catwayNumber})).to.be.true;
        expect(Reservation.create.calledOnceWith(temp)).to.be.true;
        expect(response).to.be.true;
    });

    it('should throw an error with INVALID_CATWAY_ID message when catway is not found', async () => {
        sinon.stub(Catway, 'findById').resolves(null);
        const badCatwayId = new mongoose.Types.ObjectId();

        try {
            await reservationService.add(reqBody, badCatwayId);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(badCatwayId));
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('INVALID_CATWAY_ID');
        }
    });

    it('should throw an error with INVALID_CHECK_IN message when checkin date is before now', async () => {
        sinon.stub(Catway, 'findById').resolves(catway);
        reqBody.checkIn = new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString();

        try {
            await reservationService.add(reqBody, catwayId);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(catwayId));
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('INVALID_CHECK_IN');
        }
    });

    it('should throw an error with INVALID_CHECK_OUT message when checkout date is before checkin date', async () => {
        sinon.stub(Catway, 'findById').resolves(catway);
        reqBody.checkOut = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString();

        try {
            await reservationService.add(reqBody, catwayId);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(catwayId));
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('INVALID_CHECK_OUT');
        }
    });

    it('should throw an error with CHECK_IN_ALREADY_RESERVED message when checkin date is during a period already reserved', async () => {
        sinon.stub(Catway, 'findById').resolves(catway);
        sinon.stub(Reservation, 'find').resolves(mockReservations);
        reqBody.checkIn = new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString();
        reqBody.checkOut = new Date(Date.now() + 1000 * 60 * 60 * 24 * 13).toISOString();

        try {
            await reservationService.add(reqBody, catwayId);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(catwayId));
            expect(Reservation.find.calledOnceWith({catwayNumber: catway.catwayNumber})).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('CHECK_IN_ALREADY_RESERVED');
        }
    });

    it('should throw an error with CHECK_OUT_ALREADY_RESERVED message when checkout date is during a period already reserved', async () => {
        sinon.stub(Catway, 'findById').resolves(catway);
        sinon.stub(Reservation, 'find').resolves(mockReservations);
        reqBody.checkOut = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString();

        try {
            await reservationService.add(reqBody, catwayId);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(catwayId));
            expect(Reservation.find.calledOnceWith({catwayNumber: catway.catwayNumber})).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('CHECK_OUT_ALREADY_RESERVED');
        }
    });

    it('should throw an error with RESERVATION_IN_REQUEST message when a period already reserved between checkin and checkout dates', async () => {
        sinon.stub(Catway, 'findById').resolves(catway);
        sinon.stub(Reservation, 'find').resolves(mockReservations);
        reqBody.checkOut = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();

        try {
            await reservationService.add(reqBody, catwayId);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(catwayId));
            expect(Reservation.find.calledOnceWith({catwayNumber: catway.catwayNumber})).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('RESERVATION_IN_REQUEST');
        }
    });
});

describe('Reservation Service - update', () => {
    let reservation, reservationId, reqBody, currentCatway, currentCatwayId, newCatway, mockReservations;

    beforeEach(() => {
        reservation = {
            _id: new mongoose.Types.ObjectId(),
            catwayNumber: 2,
            clientName: 'Smith',
            boatName: 'La Méduse',
            checkIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
            checkOut: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
            save: sinon.stub().resolves(true)
        };
        reservationId = reservation._id;
        reqBody = {
            catwayNumber: 1,
            clientName: 'Barbe Noire',
            boatName: "Queen Anne's Revenge",
            checkIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
            checkOut: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString()
        };
        currentCatway = {
            _id: new mongoose.Types.ObjectId(),
            catwayNumber: 2,
            catwayState: 'bon état',
            type: 'short'
        };
        currentCatwayId = currentCatway._id.toString();
        newCatway = {
            _id: new mongoose.Types.ObjectId(),
            catwayNumber: 1,
            catwayState: 'bon état',
            type: 'short'
        };
        mockReservations = [
            {
                _id: new mongoose.Types.ObjectId(),
                catwayNumber: 1,
                clientName: 'Smith',
                boatName: 'Titanic',
                checkIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8).toISOString(),
                checkOut: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString()
            },
            {
                _id: new mongoose.Types.ObjectId(),
                catwayNumber: 1,
                clientName: 'Jack Sparrow',
                boatName: 'Black Pearl',
                checkIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 16).toISOString(),
                checkOut: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString()
            }
        ];
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return true when reservation is updated', async () => {
        sinon.stub(Catway, 'findById').resolves(currentCatway);
        sinon.stub(Catway, 'findOne').resolves(newCatway);
        sinon.stub(Reservation, 'findOne').resolves(reservation);
        sinon.stub(Reservation, 'find').resolves(mockReservations);

        const response = await reservationService.update(currentCatwayId, reservationId, reqBody);

        expect(Catway.findById.calledOnceWith(currentCatwayId)).to.be.true;
        expect(Catway.findOne.calledOnceWith({catwayNumber: reqBody.catwayNumber})).to.be.true;
        expect(Reservation.findOne.calledOnceWith({_id: reservationId, catwayNumber: currentCatway.catwayNumber})).to.be.true;
        expect(Reservation.find.calledOnceWith({catwayNumber: reqBody.catwayNumber, _id: { $ne: reservationId }})).to.be.true;
        expect(reservation.catwayNumber).to.equal(reqBody.catwayNumber);
        expect(reservation.clientName).to.equal(reqBody.clientName);
        expect(reservation.boatName).to.equal(reqBody.boatName);
        expect(reservation.checkIn).to.equal(reqBody.checkIn);
        expect(reservation.checkOut).to.equal(reqBody.checkOut);
        expect(reservation.save.calledOnce).to.be.true;
        expect(response).to.be.true;
    });

    it('should throw an error with ALL_FIELDS_REQUIRED message', async () => {
        reqBody.catwayNumber = null;

        try {
            await reservationService.update(currentCatwayId, reservationId, reqBody);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('ALL_FIELDS_REQUIRED');
            expect(reservation).to.deep.equal(reservation);
        }
    });

    it('should throw an error with INVALID_CATWAY_IN_URL message', async () => {
        sinon.stub(Catway, 'findById').resolves(null);

        try {
            await reservationService.update(currentCatwayId, reservationId, reqBody);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(currentCatwayId)).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('INVALID_CATWAY_IN_URL');
            expect(reservation).to.deep.equal(reservation);
        }
    });

    it('should throw an error with INVALID_CATWAY_NUMBER message', async () => {
        sinon.stub(Catway, 'findById').resolves(currentCatway);
        sinon.stub(Catway, 'findOne').resolves(null);

        try {
            await reservationService.update(currentCatwayId, reservationId, reqBody);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(currentCatwayId)).to.be.true;
            expect(Catway.findOne.calledOnceWith({catwayNumber: reqBody.catwayNumber})).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('INVALID_CATWAY_NUMBER');
            expect(reservation).to.deep.equal(reservation);
        }
    });

    it('should throw an error with RESERVATION_NOT_FOUND message', async () => {
        sinon.stub(Catway, 'findById').resolves(currentCatway);
        sinon.stub(Catway, 'findOne').resolves(newCatway);
        sinon.stub(Reservation, 'findOne').resolves(null);

        try {
            await reservationService.update(currentCatwayId, reservationId, reqBody);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(currentCatwayId)).to.be.true;
            expect(Catway.findOne.calledOnceWith({catwayNumber: reqBody.catwayNumber})).to.be.true;
            expect(Reservation.findOne.calledOnceWith({_id: reservationId, catwayNumber: currentCatway.catwayNumber})).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('RESERVATION_NOT_FOUND');
            expect(reservation).to.deep.equal(reservation);
        }
    });

    it('should throw an error with CHECK_IN_ALREADY_RESERVED message', async () => {
        reqBody.checkIn = new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString();
        reqBody.checkOut = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();
        sinon.stub(Catway, 'findById').resolves(currentCatway);
        sinon.stub(Catway, 'findOne').resolves(newCatway);
        sinon.stub(Reservation, 'findOne').resolves(reservation);
        sinon.stub(Reservation, 'find').resolves(mockReservations);

        try {
            await reservationService.update(currentCatwayId, reservationId, reqBody);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(currentCatwayId)).to.be.true;
            expect(Catway.findOne.calledOnceWith({catwayNumber: reqBody.catwayNumber})).to.be.true;
            expect(Reservation.findOne.calledOnceWith({_id: reservationId, catwayNumber: currentCatway.catwayNumber})).to.be.true;
            expect(Reservation.find.calledOnceWith({catwayNumber: reqBody.catwayNumber, _id: { $ne: reservationId }})).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('CHECK_IN_ALREADY_RESERVED');
            expect(reservation).to.deep.equal(reservation);
        }
    });

    it('should throw an error with CHECK_OUT_ALREADY_RESERVED message', async () => {
        reqBody.checkOut = new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString();
        sinon.stub(Catway, 'findById').resolves(currentCatway);
        sinon.stub(Catway, 'findOne').resolves(newCatway);
        sinon.stub(Reservation, 'findOne').resolves(reservation);
        sinon.stub(Reservation, 'find').resolves(mockReservations);

        try {
            await reservationService.update(currentCatwayId, reservationId, reqBody);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(currentCatwayId)).to.be.true;
            expect(Catway.findOne.calledOnceWith({catwayNumber: reqBody.catwayNumber})).to.be.true;
            expect(Reservation.findOne.calledOnceWith({_id: reservationId, catwayNumber: currentCatway.catwayNumber})).to.be.true;
            expect(Reservation.find.calledOnceWith({catwayNumber: reqBody.catwayNumber, _id: { $ne: reservationId }})).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('CHECK_OUT_ALREADY_RESERVED');
            expect(reservation).to.deep.equal(reservation);
        }
    });

    it('should throw an error with RESERVATION_IN_REQUEST message', async () => {
        reqBody.checkOut = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();
        sinon.stub(Catway, 'findById').resolves(currentCatway);
        sinon.stub(Catway, 'findOne').resolves(newCatway);
        sinon.stub(Reservation, 'findOne').resolves(reservation);
        sinon.stub(Reservation, 'find').resolves(mockReservations);

        try {
            await reservationService.update(currentCatwayId, reservationId, reqBody);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(currentCatwayId)).to.be.true;
            expect(Catway.findOne.calledOnceWith({catwayNumber: reqBody.catwayNumber})).to.be.true;
            expect(Reservation.findOne.calledOnceWith({_id: reservationId, catwayNumber: currentCatway.catwayNumber})).to.be.true;
            expect(Reservation.find.calledOnceWith({catwayNumber: reqBody.catwayNumber, _id: { $ne: reservationId }})).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('RESERVATION_IN_REQUEST');
            expect(reservation).to.deep.equal(reservation);
        }
    });

    it('should throw an error with INVALID_CHECK_IN message', async () => {
        reqBody.checkIn = new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString();
        sinon.stub(Catway, 'findById').resolves(currentCatway);
        sinon.stub(Catway, 'findOne').resolves(newCatway);
        sinon.stub(Reservation, 'findOne').resolves(reservation);
        sinon.stub(Reservation, 'find').resolves(mockReservations);

        try {
            await reservationService.update(currentCatwayId, reservationId, reqBody);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(currentCatwayId)).to.be.true;
            expect(Catway.findOne.calledOnceWith({catwayNumber: reqBody.catwayNumber})).to.be.true;
            expect(Reservation.findOne.calledOnceWith({_id: reservationId, catwayNumber: currentCatway.catwayNumber})).to.be.true;
            expect(Reservation.find.calledOnceWith({catwayNumber: reqBody.catwayNumber, _id: { $ne: reservationId }})).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('INVALID_CHECK_IN');
            expect(reservation).to.deep.equal(reservation);
        }
    });

    it('should throw an error with INVALID_CHECK_OUT message', async () => {
        reqBody.checkOut = new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString();
        sinon.stub(Catway, 'findById').resolves(currentCatway);
        sinon.stub(Catway, 'findOne').resolves(newCatway);
        sinon.stub(Reservation, 'findOne').resolves(reservation);
        sinon.stub(Reservation, 'find').resolves(mockReservations);

        try {
            await reservationService.update(currentCatwayId, reservationId, reqBody);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(currentCatwayId)).to.be.true;
            expect(Catway.findOne.calledOnceWith({catwayNumber: reqBody.catwayNumber})).to.be.true;
            expect(Reservation.findOne.calledOnceWith({_id: reservationId, catwayNumber: currentCatway.catwayNumber})).to.be.true;
            expect(Reservation.find.calledOnceWith({catwayNumber: reqBody.catwayNumber, _id: { $ne: reservationId }})).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('INVALID_CHECK_OUT');
            expect(reservation).to.deep.equal(reservation);
        }
    });
});

describe('Reservation Service - deleteReservation', () => {
    let catway, idCatway, reservation, idReservation;
    
    beforeEach(() => {
        catway = {
            _id: new mongoose.Types.ObjectId(),
            catwayNumber: 1,
            catwayState: 'bon état',
            type: 'short'
        };
        idCatway = catway._id.toString();
        reservation = {
            _id: new mongoose.Types.ObjectId(),
            catwayNumber: 1,
            clientName: 'Smith',
            boatName: 'La Méduse',
            checkIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
            checkOut: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
            deleteOne: sinon.stub().resolves(true)
        };
        idReservation = reservation._id;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return true when reservation is deleted', async () => {
        sinon.stub(Catway, 'findById').resolves(catway);
        sinon.stub(Reservation, 'findOne').resolves(reservation);

        const response = await reservationService.deleteReservation(idCatway, idReservation);

        expect(Catway.findById.calledOnceWith(idCatway)).to.be.true;
        expect(Reservation.findOne.calledOnceWith({ _id: idReservation, catwayNumber: catway.catwayNumber })).to.be.true;
        expect(reservation.deleteOne.calledOnceWith({_id: idReservation})).to.be.true;
        expect(response).to.be.true;
    });

    it('should throw an error with CATWAY_NOT_FOUND message', async () => {
        sinon.stub(Catway, 'findById').resolves(null);

        try {
            await reservationService.deleteReservation(idCatway, idReservation);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(idCatway)).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('CATWAY_NOT_FOUND');
        }
    });

    it('should throw an error with RESERVATION_NOT_FOUND message', async () => {
        sinon.stub(Catway, 'findById').resolves(catway);
        sinon.stub(Reservation, 'findOne').resolves(null);

        try {
            await reservationService.deleteReservation(idCatway, idReservation);
            throw new Error('in case that error is not thrown');
        } catch (error) {
            expect(Catway.findById.calledOnceWith(idCatway)).to.be.true;
            expect(Reservation.findOne.calledOnceWith({ _id: idReservation, catwayNumber: catway.catwayNumber })).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('RESERVATION_NOT_FOUND');
        }
    });
});