const { NODE_ENV } = process.env;
const winston = require('winston');
const { existsSync, mkdirSync } = require('fs');

const LOG_DIR = 'logs';

if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR);
}

let level, transports;
switch (NODE_ENV) {
  case 'development':
    level = 'verbose';
    transports = [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'logs/dev.log',
        level: 'verbose',
      }),
    ];
    break;
  case 'production':
    level = 'verbose';
    transports = [
      new winston.transports.File({
        filename: 'error.log',
        level: 'error',
        maxsize: 10000000,
      }),
      new winston.transports.File({
        filename: 'combined.log',
        level: 'verbose',
        maxsize: 10000000,
      }),
    ];
    break;
}

module.exports = winston.createLogger({
  level,
  transports,
});
