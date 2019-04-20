const appRoot = require('app-root-path');
// const winston = require('winston');
const { transports, format, createLogger } = require('winston');

// define the custom settings for each transport (file, console)
let options = {
    file: {
        level: 'info',
        format: format.combine(
          format.timestamp(),
          format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
        filename: `${appRoot}/logs/server.log`,
        handleExceptions: true,
    },
    console: {
        level: 'debug',
        format: format.combine(
          format.timestamp(),
          format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
        handleExceptions: true,
    },
};

// instantiate a new Winston Logger with the settings defined above
var logger = createLogger({
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that can be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;
