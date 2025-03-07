import winston from 'winston';

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ level, message, timestamp }) => `[${timestamp}]\n${level}: ${message}\n`)
            ),
            level: 'error',
            handleExceptions: true
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(
                    ({ level, message }) => `${new Date().toLocaleTimeString()} [${level}] ${message}`
                )
            ),
            level: 'info',
            stderrLevels: ['error'],
            handleExceptions: true
        })
    ]
});

export default logger;
