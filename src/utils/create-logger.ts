import pino from 'pino';

export function createLogger() {
    return pino({
        transport: {
            target: 'pino-pretty',
            options: {
                ignore: 'pid,hostname',
            }
        },
    })
}