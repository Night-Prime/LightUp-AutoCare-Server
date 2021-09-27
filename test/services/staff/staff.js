/** */
const sinon = require('sinon');
const { expect } = require('chai');
const StaffService = require('../../../src/services/staff/staff');
const Controller = require('../../controller/mock');
const validator = {
    validate: sinon.fake.returns({}),
};

let staffService = null;
describe('Tests staff Service:', () => {
    let next = null;
    beforeEach(() => {
        next = sinon.spy();
        staffService = new StaffService(Controller, validator);
    });

    afterEach(() => {
        next = null;
        staffService = null;
    });

    it('create a password', async () => {
        const body = {
            password: 'password',
            confirmPassword: 'password',
        };
        const query = {
            email: 'fake@email.com',
        };
        const data = { body, query };
        const result = await staffService.createPassword(data, next);
        expect(result.payload).to.have.property('ok');
    });

    it('throws an error when body is not specified', async () => {
        await staffService.createRecord({}, next);
        next.called;
    });

    it('creates a staff record', async () => {
        const data = { name: 'Nathan' };
        const result = await staffService.createRecord({ body: data }, next);
        expect(result).to.haveOwnProperty('payload');
    });

    it('throws error when no id is specified', async () => {
        const request = {};
        await staffService.readRecordById(request, next);
        next.called;
    });

    it('returns one record when id is specified', async () => {
        const params = { id: 1 };
        const response = await staffService.readRecordById({ params }, next);
        expect(response).to.have.property('payload');
    });

    it('throws an error when no query object is specified.', async () => {
        await staffService.readRecordsByFilter({}, next);
        next.called;
    });

    it('returns an array of data', async () => {
        const query = {};
        const response = await staffService.readRecordsByFilter({ query }, next);
        expect(response).to.have.property('payload').and.is.an('array');
    });

    it('throws an error when params is unspecified', async () => {
        const query = {};
        await staffService.readRecordsByWildcard({ query }, next);
        next.called;
    });

    it('throws an error when a key is not specified on params', async () => {
        const params = {},
            query = {};
        await staffService.readRecordsByWildcard({ params, query }, next);
        next.called;
    });

    it('throws an error when query os not specfied', async () => {
        const params = { key: '' };
        await staffService.readRecordsByWildcard({ params }, next);
        next.called;
    });

    it('returns an array when params.keys and query are specified', async () => {
        const params = { keys: 'name' },
            query = {};
        const response = await staffService.readRecordsByWildcard({ params, query }, next);
        expect(response).to.have.property('payload').to.be.an('array');
    });

    it('throw an error when params.id is not specified', async () => {
        const params = {},
            body = { data: {} };
        await staffService.updateRecordById({ params, body }, next);
        next.called;
    });

    it('throw an error when params is not specified', async () => {
        const body = { data: {} };
        await staffService.updateRecordById({ body }, next);
        next.called;
    });

    it('returns a valid response when params.id and data.body is specified', async () => {
        const params = { id: 1 },
            body = { data: {} };
        const response = await staffService.updateRecordById({ params, body }, next);
        expect(response).to.have.property('payload').to.not.be.null;
    });

    it('throws an error when body.options and body.data is not specified.', async () => {
        const body = {};
        await staffService.updateRecords({ body }, next);
        next.called;
    });

    it('returns valid response for valid', async () => {
        const body = {
            options: {
                firstname: 'Micheal',
            },
            data: {},
        };
        const response = await staffService.updateRecords({ body }, next);
        expect(response).to.have.property('payload').to.not.be.null;
    });

    it('throws an error when params is not specified', async () => {
        await staffService.deleteRecordById({}, next);
        next.called;
    });

    it('throws an error when params.id is not specified', async () => {
        const params = {};
        await staffService.deleteRecordById({ params }, next);
        next.called;
    });

    it('returns valid response when params.id is specified', async () => {
        const params = { id: 1 };
        const response = await staffService.deleteRecordById({ params }, next);
        expect(response).to.have.property('payload').to.not.be.null;
    });

    it('throws an error when body.options is not specified', async () => {
        const body = {};
        await staffService.deleteRecords({ body }, next);
        next.called;
    });

    it('it returns valid response when body.options is specified', async () => {
        const body = { options: {} };
        const response = await staffService.deleteRecords({ body }, next);
        expect(response).to.have.property('payload').to.not.be.null;
    });
});
