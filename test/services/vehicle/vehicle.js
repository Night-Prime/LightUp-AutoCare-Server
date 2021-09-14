const sinon = require('sinon');
const { expect, assert } = require('chai');

const Controller = require('../../controller/mock');
const VehicleService = require('../../../src/services/client/client');

describe('Client Service', () => {
    let vehicleController = null,
        vehicleService = null,
        next = null;

    beforeEach(() => {
        vehicleController = { ...Controller };
        next = sinon.spy((e) => e);
    });

    afterEach(() => {
        vehicleController = null;
        vehicleService = null;
        next = null;
    });

    describe('CLient Service: createRecord method', () => {
        it('throws an error when body is not specified', async () => {
            vehicleService = new VehicleService(vehicleController);
            await vehicleService.readRecordById({}, next);
            next.called;
        });

        it('throws an error for empty body for client', async () => {
            vehicleService = new VehicleService(vehicleController);
            let body = {};
            await vehicleService.createRecord({ body, next });
        });

        it('imcomplete client schema throws an error', async () => {
            vehicleService = new VehicleService(vehicleController);
            let body = {
                name: 'Stanley',
                email: 'stanley@SpeechGrammarList.com',
            };
            await vehicleService.createRecord({ body }, next);
            next.called;
        });

        it('imcomplete client schema throws an error', async () => {
            vehicleService = new VehicleService(vehicleController);
            let body = {
                name: 'Stanley',
                email: 'stanley@SpeechGrammarList.com',
                telephone: 08131654376,
            };
            vehicleController = {
                ...vehicleController,
                createRecord: sinon.spy((body) => ({ ...body, id: 1, _id: '1samplecompany2345' })),
            };

            vehicleService = new VehicleService(vehicleController);
            const success = await vehicleService.createRecord({ body }, next);
            expect(success).to.have.ownProperty('payload').to.not.be.null;
        });
    });

    describe('Client Service: readRecordById method', () => {
        it('throws an error when id is not specified', async () => {
            vehicleService = new VehicleService(vehicleController);
            await vehicleService.readRecordById({ params: {} }, next);
            next.called;
        });

        it('get a record for valid id', async () => {
            const params = { id: 2 };

            vehicleController = {
                ...vehicleController,
                readRecords: sinon.spy((params) => [{ ...params, is_active: true }]),
            };

            vehicleService = new VehicleService(vehicleController);
            const success = await vehicleService.readRecordById({ params }, next);
            expect(success).to.have.ownProperty('payload').to.not.be.null;
        });
    });

    describe('Client Service: updateRecordById method', () => {
        it('throws an error when id is not specified', async () => {
            vehicleService = new VehicleService(vehicleController);
            await vehicleService.updateRecordById({ params: {} }, next);
            next.called;
        });

        it('throws an error when body is not specified', async () => {
            vehicleService = new VehicleService(vehicleController);
            await vehicleService.createRecord({ params: { id: 87 }, body: {} }, next);
            next.called;
        });

        it('throws error on unspecified type', async () => {
            vehicleService = new VehicleService(vehicleController);
            let body = {};
            await vehicleService.createRecord({ params: { id: 87 }, body }, next);
            next.called;
        });

        it('throws error on invalid type', async () => {
            vehicleService = new VehicleService(vehicleController);
            let body = {
                type: 'any',
            };
            await vehicleService.createRecord({ params: { id: 87 }, body }, next);
            next.called;
        });

        it('throws error on invalid client schema', async () => {
            vehicleService = new VehicleService(vehicleController);
            let body = {
                name: 'Stanley',
                email: 'stanley@SpeechGrammarList.com',
            };

            await vehicleService.updateRecordById({ params: { id: 3 }, body }, next);
            next.called;
        });

        it('update client for valid data', async () => {
            let body = {
                name: 'Stanley',
                email: 'stanley@SpeechGrammarList.com',
                telephone: 08131654376,
            };

            vehicleController = {
                ...vehicleController,
                readRecords: sinon.spy(() => [{ info: body, is_active: true }]),
                updateRecords: sinon.spy(() => ({
                    ...body,
                    id: 1,
                    _id: '1samplecompany2345',
                    is_active: true,
                    ok: 1,
                    nModified: 1,
                })),
            };

            vehicleService = new VehicleService(vehicleController);
            const success = await vehicleService.updateRecordById(
                { params: { id: 3 }, body },
                next
            );
            expect(success).to.have.ownProperty('payload').to.not.be.null;
        });
    });

    describe('Client Service: deleteRecordById method', () => {
        it('throws an error when id is not specified', async () => {
            vehicleService = new VehicleService(vehicleController);
            await vehicleService.deleteRecordById({ params: {} }, next);
            next.called;
        });

        it('delete a record for valid id', async () => {
            const params = { id: 2 };

            vehicleController = {
                ...vehicleController,
                deleteRecords: sinon.spy(() => ({ nModified: 1 })),
            };

            vehicleService = new VehicleService(vehicleController);
            const success = await vehicleService.deleteRecordById({ params }, next);
            expect(success).to.have.ownProperty('payload').to.not.be.null;
        });
    });

    describe('Client Service: deleteRecords method', () => {
        it('throws an error when body object is empty', async () => {
            vehicleService = new VehicleService(vehicleController);
            await vehicleService.deleteRecords({ body: {} }, next);
            next.called;
        });

        it('throws an error when body id property is missing', async () => {
            vehicleService = new VehicleService(vehicleController);
            await vehicleService.deleteRecords({ body: { any: '' } }, next);
            next.called;
        });

        it('delete record on id available', async () => {
            vehicleController = {
                ...vehicleController,
                deleteRecords: sinon.spy(() => ({ ok: 1, nModified: 4, n: 4 })),
            };
            vehicleService = new VehicleService(vehicleController);
            await vehicleService.deleteRecords({ body: { id: '12, 13, 14, 15' } }, next);
            next.called;
        });
    });
});
