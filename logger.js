
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),

  defaultMeta: {
    service: "day27-error-logging",
  },

  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    new winston.transports.File({
      filename: "app.log",
      level: "info",
    }),

    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
  ],
});

module.exports = logger;
