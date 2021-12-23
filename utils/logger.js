const moment = require("moment");
var winston = require("winston");
const path = require("path");
const logFileExtension = ".log";
var date = new Date();

//Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    (info) =>
      `${moment(info.timestamp).format(
        "YYYY-MM-DD;HH:mm:ss.SSS"
      )};${info.level.toUpperCase()};${info.message}`
  )
);

var transport = new winston.transports.File({
  filename: `${moment(date).format("YYYYMMDDHHMMSS")}-db-comparison-tool`, //File name pattern to be made
  dirname: path.join(__dirname, "..", "logs"), //Directory to store log files
  extension: logFileExtension,
  handleExceptions: false,
});

var logger = winston.createLogger({
  format: logFormat,
  transports: [transport],
});

module.exports = logger;
