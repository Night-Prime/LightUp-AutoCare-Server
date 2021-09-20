// const sinon = require('sinon');
// const { expect, assert } = require('chai');

// const Controller = require('../../controller/mock');
// const QuoteService = require('../../../src/services/client/client');

// describe('Client Service', () => {
//     let quoteController = null,
//         quoteService = null,
//         next = null;

//     beforeEach(() => {
//         quoteController = { ...Controller };
//         next = sinon.spy((e) => e);
//     });

//     afterEach(() => {
//         quoteController = null;
//         quoteService = null;
//         next = null;
//     });

//     describe('Quote Service: createRecord method', () => {
//         it('throws an error when body is not specified', async () => {
//             quoteService = new QuoteService(quoteController);
//             awaitquoteService.readRecordById({}, next);
//             next.called;
//         });

//         it('throws an error for empty body for client', async () => {
//             quoteService = new QuoteService(quoteController);
//             let body = {};
//             awaitquoteService.createRecord({ body, next });
//         });

//         it('imcomplete client schema throws an error', async () => {
//             quoteService = new QuoteService(quoteController);
//             let body = {
//                 name: 'Stanley',
//                 email: 'stanley@SpeechGrammarList.com',
//             };
//             awaitquoteService.createRecord({ body }, next);
//             next.called;
//         });

//         it('imcomplete client schema throws an error', async () => {
//             quoteService = new QuoteService(quoteController);
//             let body = {
//                 name: 'Stanley',
//                 email: 'stanley@SpeechGrammarList.com',
//                 telephone: 08131654376,
//             };
//             quoteController = {
//                 ...quoteController,
//                 createRecord: sinon.spy((body) => ({ ...body, id: 1, _id: '1samplecompany2345' })),
//             };

//             quoteService = new QuoteService(quoteController);
//             const success = awaitquoteService.createRecord({ body }, next);
//             expect(success).to.have.ownProperty('payload').to.not.be.null;
//         });
//     });

//     describe('Client Service: readRecordById method', () => {
//         it('throws an error when id is not specified', async () => {
//             quoteService = new QuoteService(quoteController);
//             awaitquoteService.readRecordById({ params: {} }, next);
//             next.called;
//         });

//         it('get a record for valid id', async () => {
//             const params = { id: 2 };

//             quoteController = {
//                 ...quoteController,
//                 readRecords: sinon.spy((params) => [{ ...params, is_active: true }]),
//             };

//             quoteService = new QuoteService(quoteController);
//             const success = awaitquoteService.readRecordById({ params }, next);
//             expect(success).to.have.ownProperty('payload').to.not.be.null;
//         });
//     });

//     describe('Client Service: updateRecordById method', () => {
//         it('throws an error when id is not specified', async () => {
//             quoteService = new QuoteService(quoteController);
//             awaitquoteService.updateRecordById({ params: {} }, next);
//             next.called;
//         });

//         it('throws an error when body is not specified', async () => {
//             quoteService = new QuoteService(quoteController);
//             awaitquoteService.createRecord({ params: { id: 87 }, body: {} }, next);
//             next.called;
//         });

//         it('throws error on unspecified type', async () => {
//             quoteService = new QuoteService(quoteController);
//             let body = {};
//             awaitquoteService.createRecord({ params: { id: 87 }, body }, next);
//             next.called;
//         });

//         it('throws error on invalid type', async () => {
//             quoteService = new QuoteService(quoteController);
//             let body = {
//                 type: 'any',
//             };
//             awaitquoteService.createRecord({ params: { id: 87 }, body }, next);
//             next.called;
//         });

//         it('throws error on invalid client schema', async () => {
//             quoteService = new QuoteService(quoteController);
//             let body = {
//                 name: 'Stanley',
//                 email: 'stanley@SpeechGrammarList.com',
//             };

//             awaitquoteService.updateRecordById({ params: { id: 3 }, body }, next);
//             next.called;
//         });

//         it('update client for valid data', async () => {
//             let body = {
//                 name: 'Stanley',
//                 email: 'stanley@SpeechGrammarList.com',
//                 telephone: 08131654376,
//             };

//             quoteController = {
//                 ...quoteController,
//                 readRecords: sinon.spy(() => [{ info: body, is_active: true }]),
//                 updateRecords: sinon.spy(() => ({
//                     ...body,
//                     id: 1,
//                     _id: '1samplecompany2345',
//                     is_active: true,
//                     ok: 1,
//                     nModified: 1,
//                 })),
//             };

//             quoteService = new QuoteService(quoteController);
//             const success = awaitquoteService.updateRecordById({ params: { id: 3 }, body }, next);
//             expect(success).to.have.ownProperty('payload').to.not.be.null;
//         });
//     });

//     describe('Client Service: deleteRecordById method', () => {
//         it('throws an error when id is not specified', async () => {
//             quoteService = new QuoteService(quoteController);
//             awaitquoteService.deleteRecordById({ params: {} }, next);
//             next.called;
//         });

//         it('delete a record for valid id', async () => {
//             const params = { id: 2 };

//             quoteController = {
//                 ...quoteController,
//                 deleteRecords: sinon.spy(() => ({ nModified: 1 })),
//             };

//             quoteService = new QuoteService(quoteController);
//             const success = awaitquoteService.deleteRecordById({ params }, next);
//             expect(success).to.have.ownProperty('payload').to.not.be.null;
//         });
//     });

//     describe('Client Service: deleteRecords method', () => {
//         it('throws an error when body object is empty', async () => {
//             quoteService = new QuoteService(quoteController);
//             awaitquoteService.deleteRecords({ body: {} }, next);
//             next.called;
//         });

//         it('throws an error when body id property is missing', async () => {
//             quoteService = new QuoteService(quoteController);
//             awaitquoteService.deleteRecords({ body: { any: '' } }, next);
//             next.called;
//         });

//         it('delete record on id available', async () => {
//             quoteController = {
//                 ...quoteController,
//                 deleteRecords: sinon.spy(() => ({ ok: 1, nModified: 4, n: 4 })),
//             };
//             quoteService = new QuoteService(quoteController);
//             awaitquoteService.deleteRecords({ body: { id: '12, 13, 14, 15' } }, next);
//             next.called;
//         });
//     });
// });
