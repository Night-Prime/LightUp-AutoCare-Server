const { Transform } = require('stream');

class SampleTransformStream extends Transform {
    constructor(ContactController, tenantId, options = {}) {
        super(options);
        this.contactController = ContactController;
        this.tenantId = tenantId;
    }

    async _transform(chunk, encoding, callback) {
        const asString = Buffer.from(chunk).toString();
        const asObject = JSON.parse(asString);
        const record = await this.contactController.createRecord({
            ...asObject,
            tenantId: this.tenantId,
        });
        this.push(JSON.stringify(record));
        callback();
    }
}

module.exports = SampleTransformStream;
