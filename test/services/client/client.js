const sinon = require('sinon');
const { expect, assert } = require('chai');

const Controller = require('../../controller/mock');
const ClientService = require('../../../src/services/client/client');

describe('Client Service', () => {
    let clientController = null,
        clientService = null,
        next = null;

    beforeEach(() => {
        clientController = { ...Controller };
        next = sinon.spy((e) => e);
    });

    afterEach(() => {
        clientController = null;
        clientService = null;
        next = null;
    });

    describe('CLient Service: createRecord method', () => {
        it('throws an error when body is not specified', async () => {
            clientService = new ClientService(clientController);
            await clientService.readRecordById({}, next);
            next.called;
        });

        it('throws an error for empty body for client', async () => {
            clientService = new ClientService(clientController);
            let body = {};
            await clientService.createRecord({ body, next });
        });

        it('imcomplete client schema throws an error', async () => {
            clientService = new ClientService(clientController);
            let body = {
                name: 'Stanley',
                email: 'stanley@SpeechGrammarList.com',
            };
            await clientService.createRecord({ body }, next);
            next.called;
        });

        it('imcomplete client schema throws an error', async () => {
            clientService = new ClientService(clientController);
            let body = {
                name: 'Stanley',
                email: 'stanley@SpeechGrammarList.com',
                telephone: 08131654376,
            };
            clientController = {
                ...clientController,
                createRecord: sinon.spy((body) => ({ ...body, id: 1, _id: '1samplecompany2345' })),
            };

            clientService = new ClientService(clientController);
            const success = await clientService.createRecord({ body }, next);
            expect(success).to.have.ownProperty('payload').to.not.be.null;
        });
    });

    describe('Client Service: readRecordById method', () => {
        it('throws an error when id is not specified', async () => {
            clientService = new ClientService(clientController);
            await clientService.readRecordById({ params: {} }, next);
            next.called;
        });

        it('get a record for valid id', async () => {
            const params = { id: 2 };

            clientController = {
                ...clientController,
                readRecords: sinon.spy((params) => [{ ...params, is_active: true }]),
            };

            clientService = new ClientService(clientController);
            const success = await clientService.readRecordById({ params }, next);
            expect(success).to.have.ownProperty('payload').to.not.be.null;
        });
    });

    describe('Client Service: updateRecordById method', () => {
        it('throws an error when id is not specified', async () => {
            clientService = new ClientService(clientController);
            await clientService.updateRecordById({ params: {} }, next);
            next.called;
        });

        it('throws an error when body is not specified', async () => {
            clientService = new ClientService(clientController);
            await clientService.createRecord({ params: { id: 87 }, body: {} }, next);
            next.called;
        });

        it('throws error on unspecified type', async () => {
            clientService = new ClientService(clientController);
            let body = {};
            await clientService.createRecord({ params: { id: 87 }, body }, next);
            next.called;
        });

        it('throws error on invalid type', async () => {
            clientService = new ClientService(clientController);
            let body = {
                type: 'any',
            };
            await clientService.createRecord({ params: { id: 87 }, body }, next);
            next.called;
        });

        it('throws error on invalid client schema', async () => {
            clientService = new ClientService(clientController);
            let body = {
                name: 'Stanley',
                email: 'stanley@SpeechGrammarList.com',
            };

            await clientService.updateRecordById({ params: { id: 3 }, body }, next);
            next.called;
        });

        it('update client for valid data', async () => {
            let body = {
                name: 'Stanley',
                email: 'stanley@SpeechGrammarList.com',
                telephone: 08131654376,
            };

            clientController = {
                ...clientController,
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

            clientService = new ClientService(clientController);
            const success = await clientService.updateRecordById({ params: { id: 3 }, body }, next);
            expect(success).to.have.ownProperty('payload').to.not.be.null;
        });
    });

    describe('Client Service: deleteRecordById method', () => {
        it('throws an error when id is not specified', async () => {
            clientService = new ClientService(clientController);
            await clientService.deleteRecordById({ params: {} }, next);
            next.called;
        });

        it('delete a record for valid id', async () => {
            const params = { id: 2 };

            clientController = {
                ...clientController,
                deleteRecords: sinon.spy(() => ({ nModified: 1 })),
            };

            clientService = new ClientService(clientController);
            const success = await clientService.deleteRecordById({ params }, next);
            expect(success).to.have.ownProperty('payload').to.not.be.null;
        });
    });

    describe('Client Service: deleteRecords method', () => {
        it('throws an error when body object is empty', async () => {
            clientService = new ClientService(clientController);
            await clientService.deleteRecords({ body: {} }, next);
            next.called;
        });

        it('throws an error when body id property is missing', async () => {
            clientService = new ClientService(clientController);
            await clientService.deleteRecords({ body: { any: '' } }, next);
            next.called;
        });

        it('delete record on id available', async () => {
            clientController = {
                ...clientController,
                deleteRecords: sinon.spy(() => ({ ok: 1, nModified: 4, n: 4 })),
            };
            clientService = new ClientService(clientController);
            await clientService.deleteRecords({ body: { id: '12, 13, 14, 15' } }, next);
            next.called;
        });
    });
});
