import { Observable, catchError, iif, of, retry, throwError, timeout } from "rxjs";

type ResilienceOptions<T> = {
    timeout: number,
    retry: {
        count: number,
        delay: number
    },
    fallback?: T
}

export function addResilience<T = any>(source$: Observable<T>) {
    return function <T = any>(options: ResilienceOptions<T>) {
        const { timeout: timeoutMilliseconds, retry: retryOptions, fallback } = options;
        return source$.pipe(
            timeout({
                each: timeoutMilliseconds,
            }),
            retry({
                count: retryOptions.count,
                delay: retryOptions.delay
            }),
            catchError(err => iif(() => fallback !== undefined, of(fallback), throwError(() => err)))
        )
    }
}


