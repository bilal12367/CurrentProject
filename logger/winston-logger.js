import winston from 'winston'

export const logger = () => {
    return winston.createLogger({
        level: 'debug',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json(),
            winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            winston.format.printf(({ level, message, label, timestamp }) => {
                return ` ${level}  ${timestamp} : ${message}`;
            })
        ),
        transports: [
            new winston.transports.Console()
        ],
        timestamp: true
    })
}