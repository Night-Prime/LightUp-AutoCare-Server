/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 */

const { Readable } = require('stream');

class SampleReadStream extends Readable {
    constructor(source, options = {}) {
        super(options);
        this.source = [];
        this.sourceKeys = [];
        SampleReadStream.formatSource(source);
    }

    static formatSource(source) {
        const asString = Buffer.from(source).toString().trim();
        const asArray = asString.split('\n');
        this.sourceKeys = asArray[0].split(',');
        this.source = asArray.slice(1);
    }

    read() {
        Object.entries(this.source).forEach((e) => {
            const asArray = e[1].split(',');
            const chunk = JSON.stringify({
                [this.sourceKeys[0]]: asArray[0],
                [this.sourceKeys[1]]: asArray[1],
            });
            this.push(chunk);
        });
        this.push(null);
    }
}
module.exports = SampleReadStream;
