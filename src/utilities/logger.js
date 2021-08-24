/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */
const { createWriteStream } = require('fs');
const { resolve } = require('path');

const morgan = require('morgan');
const { createLogger, format, transports } = require('winston');
require('dotenv').config();

const { NODE_ENV } = process.env;

/** MORGAN */
const devFormat =
    '[:date[web] :remote-addr :remote-user ] :method :url HTTP/:http-version | :status :response-time ms';
const prodFormat =
    '[:date[web] :remote-addr :remote-user ] :method :url HTTP/:http-version :referrer - :user-agent | :status :response-time ms';
const morganFormat = NODE_ENV === 'production' ? prodFormat : devFormat;

// eslint-disable-next-line object-curly-newline
const requestLogStream = createWriteStream(resolve(__dirname, '../../logs/request.log'), {
    flags: 'a',
    // eslint-disable-next-line object-curly-newline
});

exports.morgan = morgan(morganFormat, { stream: requestLogStream });

/** WINSTON */
const { colorize, combine, printf, timestamp } = format;

const logTransports = {
    console: new transports.Console({ level: 'warn' }),
    combinedLog: new transports.File({ level: 'info', filename: 'logs/combined.log' }),
    errorLog: new transports.File({ level: 'error', filename: 'logs/error.log' }),
    exceptionLog: new transports.File({ filename: 'logs/exception.log' }),
};

const logFormat = printf(
    // eslint-disable-next-line no-shadow
    ({ level, message, timestamp }) => `[${timestamp} : ${level}] - ${message}`
);

const logger = createLogger({
    transports: [logTransports.console, logTransports.combinedLog, logTransports.errorLog],
    exceptionHandlers: [logTransports.exceptionLog],
    exitOnError: false,
    format: combine(colorize(), timestamp(), logFormat),
});

exports.logger = logger;
