import { Observable, Subject, filter, iif } from 'rxjs';
import { v4 as uuid } from 'uuid';

/**
 * Represents a domain event with a specific data payload.
 */
export abstract class DomainEvent<D, E extends string> {
    readonly datetime: Date = new Date();
    readonly id = uuid()
    abstract name: E
    constructor(public readonly data: D) { }
}

/**
 * Defines the contract for an event dispatcher.
 */
export interface EventDispatcher<E extends string> {
    /**
     * Dispatches a domain event to appropriate listeners.
     * @param event The domain event to dispatch.
     */
    dispatch<T extends DomainEvent<any, E>>(event: T): void;
}

/**
 * Defines the contract for an event listener.
 */
export interface EventListener<E extends string> {
    /**
     * Subscribes to events of a specific name or all events.
     * @param name The name of the event to subscribe to (optional).
     * @returns An observable stream of events.
     */
    onEvent<T extends DomainEvent<any, E>>(name?: E): Observable<T>
}

/**
 * Defines the contract for an event bus that acts as both a dispatcher and a listener.
 */
export interface EventBus<E extends string> extends EventListener<E>, EventDispatcher<E> {

}

/**
 * An implementation of EventBus using RxJS.
 */
export class RxjsEventBus<E extends string> implements EventBus<E> {

    private events$ = new Subject<DomainEvent<any, E>>()

    onEvent<T extends DomainEvent<any, E>>(eventName?: E): Observable<T> {
        return iif(
            () => eventName !== undefined,
            this.events$.pipe(filter(event => eventName === event.name)),
            this.events$.asObservable()
        ) as Observable<T>;
    }

    dispatch<T extends DomainEvent<any, E>>(event: T): void {
        this.events$.next(event)
    }

}
