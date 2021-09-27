/** */
const sinon = require('sinon');
const { expect } = require('chai');
const InvoiceService = require('../../../src/services/invoice/invoice');
const Controller = require('../../controller/mock');
const validator = {
    validate: sinon.fake.returns({}),
};
const generateInvoiceEmitter = require('../../../src/events/generateInvoice');

let invoiceService = null;
describe('Tests Sample Service:', () => {
    let next = null;
    beforeEach(() => {
        next = sinon.spy();
        invoiceService = new InvoiceService(Controller, validator);
    });

    afterEach(() => {
        next = null;
        invoiceService = null;
        sinon.restore();
    });

    // it('throws an error when body is not specified', async () => {
    //     await invoiceService.createRecord({}, next);
    //     let stub = sinon.stub(generateInvoiceEmitter, 'on');
    //     stub.withArgs('createInvoice')
    //         .onFirstCall()
    //         .returns(Promise.resolve())
    //         .onSecondCall()
    //         .returns(Promise.reject());
    //     next.called;
    // });

    // it('creates a sample record', async () => {
    //     const data = {
    //         id: '5',
    //         name: 'Client Name',
    //         clientId: '2',
    //         vehicleId: '4',
    //         model: 'Fake Model',
    //         vehicleName: 'Fake',
    //         billingAddress: {
    //             name: 'ATB TECHSOFT',
    //             address: '8 CMD ROAD',
    //             city: 'IKOSI KETU ',
    //             postalCode: 100248,
    //             state: 'LAGOS',
    //         },
    //         dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    //         items: [
    //             {
    //                 item: 'Steering Wheel',
    //                 unit: 5,
    //                 rate: 400,
    //                 amount: 2000,
    //             },
    //             {
    //                 item: 'Premium Service',
    //                 unit: 1,
    //                 rate: 5000,
    //                 amount: 5000,
    //             },
    //         ],
    //     };

    //     let stub = sinon.stub(generateInvoiceEmitter, 'on');
    //     const result = await invoiceService.createRecord({ body: data }, next);
    //     stub.withArgs('createInvoice', result, 'test@email.com')
    //         .onFirstCall()
    //         .returns(Promise.resolve())
    //         .onSecondCall.returns(Promise.resolve());
    //     expect(result.payload).to.haveOwnProperty('id');
    //     next.called;
    // });

    it('throws error when no id is specified', async () => {
        const request = {};
        await invoiceService.readRecordById(request, next);
        next.called;
    });

    it('returns one record when id is specified', async () => {
        const params = { id: 1 };
        const response = await invoiceService.readRecordById({ params }, next);
        expect(response).to.have.property('payload');
    });

    it('throws an error when no query object is specified.', async () => {
        await invoiceService.readRecordsByFilter({}, next);
        next.called;
    });

    it('returns an array of data', async () => {
        const query = {};
        const response = await invoiceService.readRecordsByFilter({ query }, next);
        expect(response).to.have.property('payload').and.is.an('array');
    });

    it('throws an error when params is unspecified', async () => {
        const query = {};
        await invoiceService.readRecordsByWildcard({ query }, next);
        next.called;
    });

    it('throws an error when a key is not specified on params', async () => {
        const params = {},
            query = {};
        await invoiceService.readRecordsByWildcard({ params, query }, next);
        next.called;
    });

    it('throws an error when query os not specfied', async () => {
        const params = { key: '' };
        await invoiceService.readRecordsByWildcard({ params }, next);
        next.called;
    });

    it('returns an array when params.keys and query are specified', async () => {
        const params = { keys: 'name' },
            query = {};
        const response = await invoiceService.readRecordsByWildcard({ params, query }, next);
        expect(response).to.have.property('payload').to.be.an('array');
    });

    it('throw an error when params.id is not specified', async () => {
        const params = {},
            body = { data: {} };
        await invoiceService.updateRecordById({ params, body }, next);
        next.called;
    });

    it('throw an error when params is not specified', async () => {
        const body = { data: {} };
        await invoiceService.updateRecordById({ body }, next);
        next.called;
    });

    it('returns a valid response when params.id and data.body is specified', async () => {
        const params = { id: 1 },
            body = { data: {} };
        const response = await invoiceService.updateRecordById({ params, body }, next);
        expect(response).to.have.property('payload').to.not.be.null;
    });

    it('throws an error when body.options and body.data is not specified.', async () => {
        const body = {};
        await invoiceService.updateRecords({ body }, next);
        next.called;
    });

    it('returns valid response for valid', async () => {
        const body = {
            options: {
                firstname: 'Micheal',
            },
            data: {},
        };
        const response = await invoiceService.updateRecords({ body }, next);
        expect(response).to.have.property('payload').to.not.be.null;
    });

    it('throws an error when params is not specified', async () => {
        await invoiceService.deleteRecordById({}, next);
        next.called;
    });

    it('throws an error when params.id is not specified', async () => {
        const params = {};
        await invoiceService.deleteRecordById({ params }, next);
        next.called;
    });

    it('returns valid response when params.id is specified', async () => {
        const params = { id: 1 };
        const response = await invoiceService.deleteRecordById({ params }, next);
        expect(response).to.have.property('payload').to.not.be.null;
    });

    it('throws an error when body.options is not specified', async () => {
        const body = {};
        await invoiceService.deleteRecords({ body }, next);
        next.called;
    });

    it('it returns valid response when body.options is specified', async () => {
        const body = { options: {} };
        const response = await invoiceService.deleteRecords({ body }, next);
        expect(response).to.have.property('payload').to.not.be.null;
    });
});
