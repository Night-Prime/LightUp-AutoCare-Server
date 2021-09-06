const RootService = require('../_root');
const { buildQuery, buildWildcardOptions } = require('../../utilities/query');
const { generateToken, hashObject, verifyObject } = require('../../utilities/packages');
const createPasswordEmitter = require('../../events/createPassword');

class StaffService extends RootService {
    constructor(sampleController, schemaValidator) {
        /** */
        super();
        this.sampleController = sampleController;
        this.schemaValidator = schemaValidator;
        this.serviceName = 'StaffService';
    }

    async createPassword(request, next) {
        try {
            const { body, query } = request;
            let { confirmPassword, password } = body;
            if (confirmPassword !== password) throw new Error('Passwords do not match');
            password = await hashObject(password);
            const result = await this.sampleController.updateRecords(query.email, password);
            if (result.failed) {
                throw new Error(result.error);
            }
            return this.processSingleRead(result);
        } catch (error) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] createPassword: ${error.message}`,
                500
            );
            return next(err);
        }
    }

    async createRecord(request, next) {
        try {
            const { body } = request;
            const { error } = this.schemaValidator.validate(body);
            if (error) throw new Error(error);

            delete body.id;
            body.password ? (body.password = await hashObject(body.password)) : body;

            const result = await this.sampleController.createRecord({ ...body });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                if (!result.password) {
                    createPasswordEmitter.emit('createPassword', request, result);
                }
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

    async authenticateUser(request, next) {
        try {
            const { email, password } = request.body;

            const [user] = await this.sampleController.readRecords({ email });
            if (user.failed) throw new Error(user.error);
            if (user.isDeleted) throw new Error("User doesn't exist again");

            const validPassword = await verifyObject(password, user.password);
            if (!validPassword) throw new Error('Invalid Password');
            const token = await generateToken({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
            });
            const result = {
                message: 'Authentication successful',
                ...user,
                token,
            };
            return this.processSingleRead(result);
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] authenticateUser: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readRecordById(request, next) {
        try {
            const { id } = request.params;
            if (!id) throw new Error('Invalid ID supplied.');

            const result = await this.sampleController.readRecords({ id, isActive: true });
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

            const result = await this.sampleController.readRecords(query);
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
            const { data, role } = request.body;

            if (!id) throw new Error('Invalid ID supplied.');

            const result = await this.sampleController.updateRecords({ id }, { ...data });
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

module.exports = StaffService;
