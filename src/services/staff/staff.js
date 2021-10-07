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
            const { body } = request;
            let { confirmPassword, password } = body;
            if (confirmPassword !== password) {
                const err = this.processFailedResponse(`Passwords do not match`, 400);
                return next(err);
            }
            password = await hashObject(password);
            const result = await this.sampleController.updateStaffPassword(request.email, {
                password: password,
            });
            if (result.failed) {
                throw new Error(result.error);
            }
            return this.processUpdateResult(result);
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
            if (error) {
                const err = this.processFailedResponse(`${error.message}`, 400);
                return next(err);
            }
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
            if (!user) {
                const err = this.processFailedResponse(`User doesn't exist`, 404);
                return next(err);
            }
            if (user.isDeleted) {
                const err = this.processFailedResponse(`User doesn't exist again`, 404);
                return next(err);
            }
            if (!user.password) {
                const err = this.processFailedResponse(
                    `This user doesn't have a password yet`,
                    404
                );
                return next(err);
            }
            const validPassword = await verifyObject(password, user.password);
            if (!validPassword) {
                const err = this.processFailedResponse(`Invalid Password`, 400);
                return next(err);
            }
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
            console.log(e);
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
            if (!id) {
                const err = this.processFailedResponse(`Invalid Id`, 400);
                return next(err);
            }

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
            let result;
            query
                ? (result = await this.sampleController.readRecords({ ...query, isActive: true }))
                : (result = await this.sampleController.readRecords({ isActive: true }));
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
            const data = request.body;

            if (!id) throw new Error('Invalid ID supplied.');
            if (Object.keys(data).length === 0)
                throw new Error('Please specify a field/property to be updated');

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
