const RootService = require('../_root');
const { buildQuery, buildWildcardOptions } = require('../../utilities/query');
const generateInvoiceEmitter = require('../../events/generateInvoice');

class InvoiceService extends RootService {
    constructor(sampleController, schemaValidator) {
        super();
        this.sampleController = sampleController;
        this.schemaValidator = schemaValidator;
        this.serviceName = 'InvoiceService';
    }
    async getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
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
            const randomId = await this.getRandomInt(1000, 2000);
            body['invoiceId'] = randomId;
            const result = await this.sampleController.createInvoice({ ...body });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                const { id } = result;
                const populatedResult = await this.sampleController.populateInvoice({
                    id,
                    isActive: true,
                });
                const { email } = populatedResult[0].clientId;
                const { model, vehicleName } = populatedResult[0].vehicleId;
                result['model'] = model;
                result['vehicleName'] = vehicleName;
                generateInvoiceEmitter.emit('createInvoice', result, email);
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

            const result = await this.sampleController.populateInvoice({ id, isActive: true });
            if (result.length === 0) {
                const err = this.processFailedResponse(
                    `Invoice is deleted and cannot be found`,
                    404
                );
                next(err);
            } else {
                const [userDetails] = result.map((invoice) => {
                    const clientName = invoice.clientId.name;
                    const vehicleName = invoice.vehicleId.vehicleName;
                    const clientId = invoice.clientId._id;
                    const vehicleId = invoice.vehicleId._id;
                    return {
                        ...invoice.toObject(),
                        clientName,
                        vehicleName,
                        clientId,
                        vehicleId,
                    };
                });
                console.log(userDetails);
                return this.processSingleRead(userDetails);
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
            Object.keys(query).length !== 0
                ? (result = await this.sampleController.populateInvoice({
                      ...query,
                      isActive: true,
                  }))
                : (result = await this.sampleController.populateInvoice({
                      isActive: true,
                  }));
            if (result.failed) {
                throw new Error(result.error);
            } else {
                const userDetails = result.map((invoice) => {
                    const clientName = invoice.clientId.name;
                    const vehicleName = invoice.vehicleId.vehicleName;
                    const clientId = invoice.clientId._id;
                    const vehicleId = invoice.vehicleId._id;
                    return {
                        ...invoice.toObject(),
                        clientName,
                        vehicleName,
                        clientId,
                        vehicleId,
                    };
                });
                return this.processMultipleReadResults(userDetails);
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
                this.sampleController,
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
            const { body } = request;

            if (!id) throw new Error('Invalid ID supplied.');
            if (Object.keys(body).length === 0)
                throw new Error('Please specify a field/property to be updated');

            const result = await this.sampleController.updateRecords({ id }, { ...body });
            if (result.failed) {
                throw new Error(result.error);
            } else {
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

            const result = await this.sampleController.updateRecords(
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

            const result = await this.sampleController.deleteRecords({ id });
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

            const result = await this.sampleController.deleteRecords({ ...seekConditions });
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

module.exports = InvoiceService;
