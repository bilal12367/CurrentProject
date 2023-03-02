import Log4js from 'log4js'

Log4js.configure({
    appenders: { console: { type: "console" }, filelogger: {type: "file", filename: 'server.log'} },
    categories: { default: { appenders: ["console"], level: "all" } },
})

export const logger = Log4js.getLogger();