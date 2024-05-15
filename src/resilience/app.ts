import { delay, from, of, switchMap, tap, throwError } from 'rxjs';
import { createLogger } from '../utils/create-logger';
import { addResilience } from './resilience';

const logger = createLogger()

const failedRequest$ = throwError(() => {
    logger.error('throwing a controlled error 😨')
    return new Error('controlled error')
})

const successRequest$ = of('success request 😎')

let intent = 0
const calculateDelay = (intent: number) => intent === 3 ? 100 : 3000

const retriedRequest$ = from(Promise.resolve()).pipe(
    tap(() => intent++),
    tap(() => {
        if (intent > 0) logger.info(`executing retry number: ${intent}`)
    }),
    switchMap(() => of("Retry example 🧐").pipe(delay(calculateDelay(intent))))
);

const options = {
    timeout: 1000,
    retry: {
        count: 3,
        delay: 3000
    },
    fallback: "Ops, something went wrong"
}

const successRequest = addResilience(successRequest$)
const successObservable$ = successRequest(options)

successObservable$.subscribe({
    next: (value) => logger.info(`success-response: ${JSON.stringify(value, null, 2)}`),
    error: (error) => logger.error(`resilience-error: ${error.message}`, error),
})

const fallbackRequest = addResilience(failedRequest$)
const fallbackObservable$ = fallbackRequest(options)

fallbackObservable$.subscribe({
    next: (value) => logger.info(`fallback-response: ${JSON.stringify(value, null, 2)}`),
    error: (error) => logger.error(`resilience-error: ${error.message}`, error),
})

const retryRequest = addResilience(retriedRequest$)
const retryObservable$ = retryRequest(options)
retryObservable$.subscribe({
    next: (value) => logger.info(`retry-response: ${JSON.stringify(value, null, 2)}`),
    error: (error) => logger.error(`resilience-error: ${error.message}`, error),
})


