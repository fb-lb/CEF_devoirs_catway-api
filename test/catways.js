const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const service = require('../services/catways');
const Catway = require('../models/catway');
const Reservation = require('../models/reservation');

describe('Catway Service - getAll', () => {
    it('should return all catways data', async () => {
        const mockCatways = [
            {
                _id: new mongoose.Types.ObjectId(),
                catwayNumber: 1,
                type: 'short',
                catwayState: 'bon état'
            },
            {
                _id: new mongoose.Types.ObjectId(),
                catwayNumber: 2,
                type: 'long',
                catwayState: 'un peu abîmé'
            }
        ];

        const selectStub = sinon.stub().resolves(mockCatways)
        const findStub = sinon.stub(Catway, 'find').returns({ select: selectStub });

        const response = await service.getAll();

        expect(findStub.calledOnce).to.be.true;
        expect(selectStub.calledOnce).to.be.true;
        expect(response).to.deep.equal(mockCatways);

        sinon.restore();
    });
});

describe('Catway Service - get', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should return catways data', async () => {
        const mockCatway = {
            _id: new mongoose.Types.ObjectId(),
            catwayNumber: 1,
            type: 'short',
            catwayState: 'bon état'
        };

        sinon.stub(Catway, 'findById').resolves(mockCatway);

        const response = await service.get(mockCatway._id.toString());

        expect(response).to.deep.equal(mockCatway);
        expect(Catway.findById.calledOnceWith(mockCatway._id.toString())).to.be.true;
    });

    it('should return an error with CATWAY_NOT_FOUND message when catway is not found', async() => {
        const badId = new mongoose.Types.ObjectId().toString();
        
        sinon.stub(Catway, 'findById').resolves(null);

        try {
            await service.get(badId);
            throw new Error("in case that error is not thrown");
        } catch (error) {
            expect(Catway.findById.calledOnceWith(badId)).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('CATWAY_NOT_FOUND');
        }
    });
});

describe('Catway Service - add', () => {
   let reqBody;

    beforeEach(() => {
        reqBody = {
            catwayNumber: 1,
            type: 'short',
            catwayState: 'bon état'
        };
    });

    afterEach(() => {
        sinon.restore();
    })

    it('should create a new catway', async() => {
        sinon.stub(Catway,'create').resolves(true);
        
        const response = await service.add(reqBody);

        expect(Catway.create.calledOnceWith(reqBody)).to.be.true;
        expect(response).to.be.true;
    });

    it('should throw an error with CATWAY_NUMBER_ALREADY_EXIST message', async () => {
        sinon.stub(Catway, 'create').rejects(new Error('duplicate key error collection'));

        try {
            await service.add(reqBody);
            throw new Error("in case that error is not thrown");
        } catch (error) {
            expect(Catway.create.calledOnceWith(reqBody)).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('CATWAY_NUMBER_ALREADY_EXIST');
        }
    });
});

describe('Catway Service - update', () => {
    let catway, id, reqBody;

    beforeEach(() => {
        catway = {
            _id: new mongoose.Types.ObjectId(),
            catwayNumber: 1,
            type: 'short',
            catwayState: 'bon état', 
            save: sinon.stub().resolves(true)
        };

        id = catway._id.toString();

        reqBody = {
            catwayNumber: 2,
            type: 'long',
            catwayState: 'mauvais état', 
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return true when updated catway is saved', async () => {
        sinon.stub(Catway, 'findById').resolves(catway);

        const response = await service.update(id, reqBody);
        
        expect(Catway.findById.calledOnceWith(id)).to.be.true;
        expect(catway.save.calledOnce).to.be.true;
        expect(catway.catwayNumber).to.equal(2);
        expect(catway.type).to.equal('long');
        expect(catway.catwayState).to.equal('mauvais état');
        expect(response).to.be.true;
    });

    it('should throw an error with ALL_FIELDS_REQUIRED message', async () => {
        reqBody.catwayNumber = null;
        
        try {
            await service.update(id, reqBody);
            throw new Error("in case that error is not thrown");
        } catch (error) {
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('ALL_FIELDS_REQUIRED');
        }
    });

    it('should throw an error with CATWAY_NOT_FOUND message', async () => {
        sinon.stub(Catway,'findById').resolves(null);

        try {
            await service.update(id, reqBody);
        } catch (error) {
            expect(Catway.findById.calledOnceWith(id)).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('CATWAY_NOT_FOUND');
        }
    });
});

describe('Catway Service - delete', () => {
    let id, catway, reservation;

    beforeEach(() => {
        catway = {
            _id: new mongoose.Types.ObjectId(),
            catwayNumber: 1
        };
        id = catway._id.toString();
        reservation = {
            _id: new mongoose.Types.ObjectId(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return true when catway is deleted', async () => {
        sinon.stub(Catway, 'findById').resolves(catway);
        sinon.stub(Reservation, 'findOne').resolves(null);
        sinon.stub(Catway, 'deleteOne').resolves(true);

        const response = await service.deleteCatway(id);
        
        expect(Catway.findById.calledOnceWith(id)).to.be.true;
        expect(Reservation.findOne.calledOnceWith({ catwayNumber: catway.catwayNumber })).to.be.true;
        expect(Catway.deleteOne.calledOnceWith({_id: id})).to.be.true;
        expect(response).to.be.true;
    });

    it('should throw an error with CATWAY_NOT_FOUND message', async () => {
        sinon.stub(Catway, 'findById').resolves(null);

        try {
            await service.deleteCatway(id);
            throw new Error("in case that error is not thrown");
        } catch (error) {
            expect(Catway.findById.calledOnceWith(id)).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('CATWAY_NOT_FOUND');
        }
    });

    it('should throw an error with CATWAY_RESERVED message', async () => {
        sinon.stub(Catway, 'findById').resolves(catway);
        sinon.stub(Reservation, 'findOne').resolves(reservation);

        try {
            await service.deleteCatway(id);
            throw new Error("in case that error is not thrown");
        } catch (error) {
            expect(Catway.findById.calledOnceWith(id)).to.be.true;
            expect(Reservation.findOne.calledOnceWith({ catwayNumber: catway.catwayNumber })).to.be.true;
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal('CATWAY_RESERVED');
        }
    });
});