const RootService = require('../_root');
const EventEmitter = require('events');
const { buildQuery, buildWildcardOptions } = require('../../utilities/query');
const { date } = require('@hapi/joi');
const generatePdfEmitter = require('../../events/generateQuote');
const axios = require('axios');
class QuoteService extends RootService {
    constructor(quoteController, schemaValidator) {
        /** */
        super();
        this.quoteController = quoteController;
        this.schemaValidator = schemaValidator;
        this.serviceName = 'QuoteService';
    }

    async createRecord(request, next) {
        try {
            const { body } = request;
            const { error } = this.schemaValidator.validate(body);
            if (error) {
                const err = this.processFailedResponse(`${error.message}`, 400);
                return next(err);
            }

            console.log(request);
            delete body.id;
            body['createdById'] = request.id;
            body['createdByName'] = request.name;
            console.log(request.token);
            const token = request.token;

            const {
                data: { payload },
            } = await axios.get(
                `https://lightup-auto-care.herokuapp.com/vehicles/${body.vehicleId}`,
                { headers: { Authorization: `${token}` } }
            );

            body['vehicleName'] = payload.vehicleName;
            body['clientName'] = payload.client[0].name;
            const result = await this.quoteController.createRecord({ ...body });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                generatePdfEmitter.emit('createQuote', result);
                return this.processSingleRead(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] createRecord: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readRecordById(request, next) {
        try {
            const { id } = request.params;
            if (!id) throw new Error('Invalid ID supplied.');

            const result = await this.quoteController.readRecords({ id, isActive: true });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processSingleRead(result[0]);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] updateRecordById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readRecordsByFilter(request, next) {
        try {
            const { query } = request;

            let result;
            query
                ? (result = await this.quoteController.readRecords({
                      ...query,
                      isActive: true,
                  }))
                : (result = await this.quoteController.readRecords({
                      isActive: true,
                  }));
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processMultipleReadResults(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] readRecordsByFilter: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readRecordsByWildcard(request, next) {
        try {
            const { params, query } = request;

            if (!params.keys || !params.keys) {
                throw new Error('Invalid key/keyword', 400);
            }

            const wildcardConditions = buildWildcardOptions(params.keys, params.keyword);
            const result = await this.handleDatabaseRead(
                this.quoteController,
                query,
                wildcardConditions
            );
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processMultipleReadResults(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] readRecordsByWildcard: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async updateRecordById(request, next) {
        try {
            const { id } = request.params;
            const data = request.body;

            if (!id) throw new Error('Invalid ID supplied.');
            if (Object.keys(data).length === 0)
                throw new Error('Please specify a field/property to be updated');

            const record = await this.quoteController.readRecords({ id, isActive: true });

            if (!record[0].isPending) {
                throw new Error('This record is being processed to generate invoice');
            }

            if (record[0].isApproved && (request.role !== 'admin' || request.role !== 'approver')) {
                throw new Error('Requires admin or approver privilege');
            }

            let arrayToPush = {
                items: { ...data },
                quoteHistory: {
                    updatedById: request.id,
                    updatedByName: request.name,
                    updatedOn: new Date(),
                },
            };

            let conditions = { id };

            const result = await this.quoteController.updateAndPushRecords(
                conditions,
                data,
                arrayToPush
            );
            if (result.failed) {
                throw new Error(result.error);
            } else {
                generatePdfEmitter.emit('createQoute', result);
                return this.processUpdateResult(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] updateRecordById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async updateRecords(request, next) {
        try {
            const { options, data } = request.body;
            const { seekConditions } = buildQuery(options);

            const result = await this.quoteController.updateRecords(
                { ...seekConditions },
                { ...data }
            );
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processUpdateResult({ ...data, ...result });
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] updateRecords: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async deleteRecordById(request, next) {
        try {
            const { id } = request.params;
            if (!id) throw new Error('Invalid ID supplied.');

            const result = await this.quoteController.deleteRecords({ id });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processDeleteResult(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] deleteRecordById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async deleteRecords(request, next) {
        try {
            const { options } = request.body;
            const { seekConditions } = buildQuery(options);

            const result = await this.quoteController.deleteRecords({ ...seekConditions });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processDeleteResult({ ...result });
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] deleteRecords: ${e.message}`,
                500
            );
            return next(err);
        }
    }
}

module.exports = QuoteService;

// module.exports = quoteEmitter;
