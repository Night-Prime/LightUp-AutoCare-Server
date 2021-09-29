const RootService = require('../_root');
const { buildQuery, buildWildcardOptions } = require('../../utilities/query');
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

    async getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    async createRecord(request, next) {
        try {
            const { body } = request;

            const { error } = this.schemaValidator.validate(body);
            if (error) {
                const err = this.processFailedResponse(`${error.message}`, 400);
                return next(err);
            }

            delete body.id;
            const token = request.token;

            const randomId = await this.getRandomInt(1000, 2000);
            body['quoteId'] = randomId;

            body['createdById'] = request.id;
            body['createdByName'] = request.name;
            const {
                data: { payload },
            } = await axios.get(
                `https://lightup-auto-care.herokuapp.com/vehicles/${body.vehicleId}`,
                { headers: { Authorization: `${token}` } }
            );

            body['vehicleName'] = payload.vehicleName;
            body['clientName'] = payload.client[0].name;
            body['billingAddress'] = payload.client[0].billingAddress;

            const result = await this.quoteController.createQuote({ ...body });
            result['model'] = payload.model;
            const email = payload.client[0].email;
            if (result.failed) {
                throw new Error(result.error);
            } else {
                generatePdfEmitter.emit('createQuote', result, email);

                return this.processSingleRead(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] createQuote: ${e.message}`,
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
    async makeAxiosGetCall(api, id, token) {
        const {
            data: { payload },
        } = await axios.get(`https://lightup-auto-care.herokuapp.com/${api}/${id}`, {
            headers: { Authorization: `${token}` },
        });

        return payload;
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
            const token = request.token;

            const payload = await this.makeAxiosGetCall('vehicles', result.vehicleId, token);
            const { quoteId } = await this.makeAxiosGetCall('quotes', id, token);
            result['quoteId'] = quoteId;
            result['vehicleName'] = payload.vehicleName;
            result['clientName'] = payload.client[0].name;
            result['billingAddress'] = payload.client[0].billingAddress;

            result['model'] = payload.model;
            const email = payload.client[0].email;
            if (result.failed) {
                throw new Error(result.error);
            } else {
                generatePdfEmitter.emit('createQuote', result, email);
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
