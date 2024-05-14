import axios from "axios";
import { Observable, catchError, defer, from, iif, of, pipe, retry, throwError, timeout } from "rxjs";
import { createLogger } from "../utils/create-logger";


type ResilenceOptions<T> = {
    timeout: number,
    retry: {
        count: number,
        delay: number
    },
    fallback?: T
}


export function addResilence<T = any>(source$: Observable<T>) {
    return function <T = any>(options: ResilenceOptions<T>) {
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


