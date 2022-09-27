/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */
const mongoose = require('mongoose');

class Controller {
    constructor(modelName) {
        this.model = mongoose.model(modelName);
    }

    static deleteRecordMetadata(record) {
        const recordToMutate = { ...record };

        delete recordToMutate.timeStamp;
        delete recordToMutate.createdOn;
        delete recordToMutate.updatedOn;
        delete recordToMutate._v;

        return { ...recordToMutate };
    }

    static jsonize(data) {
        return JSON.parse(JSON.stringify(data));
    }

    static processError(error) {
        return { ...Controller.jsonize({ failed: true, error: `Controller ${error}` }) };
    }

    async createRecord(data) {
        try {
            const n = (await this.model.estimatedDocumentCount()) + 1;

            const recordToCreate = new this.model({ id: n, _id: n, ...data });
            const createdRecord = await recordToCreate.save();

            return { ...Controller.jsonize(createdRecord) };
        } catch (e) {
            return Controller.processError(e.message);
        }
    }

    async findAndModify({ filter, data, options = { upsert: true, returnNewDocument: true } }) {
        try {
            const n = (await this.model.estimatedDocumentCount()) + 1;
            // eslint-disable-next-line no-param-reassign
            data = { ...data, id: n + 1 };
            const recordToCreate = await this.model.findOneAndUpdate(filter, data, options);
            return { ...Controller.jsonize(recordToCreate) };
        } catch (e) {
            return Controller.processError(e.message);
        }
    }

    async createInvoice(data) {
        try {
            const n = (await this.model.estimatedDocumentCount()) + 1;
            data.invoiceId = `INV-${data.invoiceId}${n}`;
            const recordToCreate = new this.model({ id: n, _id: n, ...data });
            const createdRecord = await recordToCreate.save();

            return { ...Controller.jsonize(createdRecord) };
        } catch (e) {
            return Controller.processError(e.message);
        }
    }

    async createQuote(data) {
        try {
            const n = (await this.model.estimatedDocumentCount()) + 1;
            data.quoteId = `QUO-${data.quoteId}${n}`;
            const recordToCreate = new this.model({ id: n, _id: n, ...data });
            const createdRecord = await recordToCreate.save();

            return { ...Controller.jsonize(createdRecord) };
        } catch (e) {
            return Controller.processError(e.message);
        }
    }

    async readRecords(
        conditions,
        fieldsToReturn = '',
        sortOptions = '',
        count = false,
        skip = 0,
        limit = Number.MAX_SAFE_INTEGER
    ) {
        try {
            let result = null;
            if (count) {
                result = await this.model
                    .countDocuments({ ...conditions })
                    .skip(skip)
                    .limit(limit)
                    .sort(sortOptions);
                return { count: result };
            }
            result = await this.model
                .find({ ...conditions }, fieldsToReturn)
                .skip(skip)
                .limit(limit)
                .sort(sortOptions);
            return Controller.jsonize([...result]);
        } catch (e) {
            return Controller.processError(e.message);
        }
    }

    async updateRecords(conditions, data) {
        try {
            const dataToSet = Controller.deleteRecordMetadata(data);

            const result = await this.model.updateMany(
                { ...conditions },
                {
                    ...dataToSet,
                    $currentDate: { updatedOn: true },
                }
            );
            return Controller.jsonize({ ...result, data });
        } catch (e) {
            return Controller.processError(e.message);
        }
    }

    async updateStaffPassword(email, data) {
        try {
            const dataToSet = Controller.deleteRecordMetadata(data);
            const result = await this.model.updateOne(
                { email },
                { ...dataToSet, $currentDate: { updatedOn: true } }
            );
            return Controller.jsonize({ ...result, data });
        } catch (e) {
            return Controller.processError(e.message);
        }
    }

    async updateAndPushRecords(conditions, data, arrayToPush) {
        try {
            const dataToSet = Controller.deleteRecordMetadata(data);
            const result = await this.model.updateMany(
                { ...conditions },
                {
                    $set: { ...dataToSet },
                    $push: { ...arrayToPush },
                }
            );

            return Controller.jsonize({ ...result, ...data, ...arrayToPush });
        } catch (e) {
            return Controller.processError(e.message);
        }
    }

    async deleteRecords(conditions) {
        try {
            const result = await this.model.updateMany(
                { ...conditions },
                {
                    isActive: false,
                    isDeleted: true,
                    $currentDate: { updatedOn: true },
                }
            );

            return Controller.jsonize(result);
        } catch (e) {
            return Controller.processError(e.message);
        }
    }

    async populateVirtually(id) {
        try {
            const a = await this.model.aggregate([
                {
                    $match: {
                        ...id,
                        isActive: true,
                    },
                },

                {
                    $lookup: {
                        from: 'clients',
                        localField: 'clientId',
                        foreignField: 'id',
                        as: 'client',
                    },
                },
            ]);

            return a;
        } catch (e) {
            console.log(e);
            return Controller.processError(e.message);
        }
    }

    async populateRecordVirtually(model) {
        try {
            return await this.model.findOne().populate(model);
        } catch (e) {
            return Controller.processError(e.message);
        }
    }

    async populateInvoice(conditions) {
        try {
            return await this.model
                .find({ ...conditions }, { _id: 0 })
                .populate({
                    path: 'clientId',
                    select: 'name email',
                    match: { $or: [{ isDeleted: false }, { isDeleted: true }] },
                })
                .populate({
                    path: 'vehicleId',
                    select: 'vehicleName model',
                    match: { $or: [{ isDeleted: false }, { isDeleted: true }] },
                })
                .exec();
        } catch (error) {
            return Controller.processError(error.message);
        }
    }
}

module.exports = Controller;
