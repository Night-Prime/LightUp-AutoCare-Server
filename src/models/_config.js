/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */
const { resolve } = require('path');

require('dotenv').config();
const glob = require('glob');
const mongoose = require('mongoose');

const { APP_DB_URI } = process.env;

module.exports.connect = () => {
    try {
        mongoose.connect(
            APP_DB_URI,
            {
                autoIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: true,
            },
            (err) => {
                if (err) {
                    console.log('Could not connect to database');
                    return;
                }
                console.log('Database connection established.');
            }
        );
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
    }
};

module.exports.loadModels = () => {
    const basePath = resolve(__dirname, '../models/');
    const files = glob.sync('*.js', { cwd: basePath });
    files.forEach((file) => {
        if (file.toLocaleLowerCase().includes('_config')) return;
        // eslint-disable-next-line security/detect-non-literal-require
        require(resolve(basePath, file));
    });
};
