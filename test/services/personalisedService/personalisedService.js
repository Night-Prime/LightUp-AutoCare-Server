/** */
const sinon = require('sinon');
const { expect } = require('chai');
const PersonalisedService = require('../../../src/services/personalisedService/personalisedService');
const Controller = require('../../controller/mock');
const validator = {
    validate: sinon.fake.returns({}),
};

let personalisedService = null;
describe('Tests Sample Service:', () => {
    let next = null;
    beforeEach(() => {
        next = sinon.spy();
        personalisedService = new PersonalisedService(Controller, validator);
    });

    afterEach(() => {
        next = null;
        personalisedService = null;
    });

    it('throws an error when body is not specified', async () => {
        await personalisedService.createRecord({}, next);
        next.called;
    });

    it('creates a sample record', async () => {
        const data = { name: 'Nathan' };
        const result = await personalisedService.createRecord({ body: data }, next);
        expect(result.payload).to.haveOwnProperty('id');
    });

    it('throws error when no id is specified', async () => {
        const request = {};
        await personalisedService.readRecordById(request, next);
        next.called;
    });

    it('returns one record when id is specified', async () => {
        const params = { id: 1 };
        const response = await personalisedService.readRecordById({ params }, next);
        expect(response).to.have.property('payload');
    });

    it('throws an error when no query object is specified.', async () => {
        await personalisedService.readRecordsByFilter({}, next);
        next.called;
    });

    it('returns an array of data', async () => {
        const query = {};
        const response = await personalisedService.readRecordsByFilter({ query }, next);
        expect(response).to.have.property('payload').and.is.an('array');
    });

    it('throws an error when params is unspecified', async () => {
        const query = {};
        await personalisedService.readRecordsByWildcard({ query }, next);
        next.called;
    });

    it('throws an error when a key is not specified on params', async () => {
        const params = {},
            query = {};
        await personalisedService.readRecordsByWildcard({ params, query }, next);
        next.called;
    });

    it('throws an error when query os not specfied', async () => {
        const params = { key: '' };
        await personalisedService.readRecordsByWildcard({ params }, next);
        next.called;
    });

    it('returns an array when params.keys and query are specified', async () => {
        const params = { keys: 'name' },
            query = {};
        const response = await personalisedService.readRecordsByWildcard({ params, query }, next);
        expect(response).to.have.property('payload').to.be.an('array');
    });

    it('throw an error when params.id is not specified', async () => {
        const params = {},
            body = { data: {} };
        await personalisedService.updateRecordById({ params, body }, next);
        next.called;
    });

    it('throw an error when params is not specified', async () => {
        const body = { data: {} };
        await personalisedService.updateRecordById({ body }, next);
        next.called;
    });

    it('returns a valid response when params.id and data.body is specified', async () => {
        const params = { id: 1 },
            body = { data: {} };
        const response = await personalisedService.updateRecordById({ params, body }, next);
        expect(response).to.have.property('payload').to.not.be.null;
    });

    it('throws an error when body.options and body.data is not specified.', async () => {
        const body = {};
        await personalisedService.updateRecords({ body }, next);
        next.called;
    });

    it('returns valid response for valid', async () => {
        const body = {
            options: {
                firstname: 'Micheal',
            },
            data: {},
        };
        const response = await personalisedService.updateRecords({ body }, next);
        expect(response).to.have.property('payload').to.not.be.null;
    });

    it('throws an error when params is not specified', async () => {
        await personalisedService.deleteRecordById({}, next);
        next.called;
    });

    it('throws an error when params.id is not specified', async () => {
        const params = {};
        await personalisedService.deleteRecordById({ params }, next);
        next.called;
    });

    it('returns valid response when params.id is specified', async () => {
        const params = { id: 1 };
        const response = await personalisedService.deleteRecordById({ params }, next);
        expect(response).to.have.property('payload').to.not.be.null;
    });

    it('throws an error when body.options is not specified', async () => {
        const body = {};
        await personalisedService.deleteRecords({ body }, next);
        next.called;
    });

    it('it returns valid response when body.options is specified', async () => {
        const body = { options: {} };
        const response = await personalisedService.deleteRecords({ body }, next);
        expect(response).to.have.property('payload').to.not.be.null;
    });
});
