import { Observable, Subject, filter, iif } from 'rxjs';
import { v4 as uuid } from 'uuid';

//#region Contract definition

export abstract class DomainEvent<PAYLOAD, EVENTS extends string> {
    readonly datetime: Date = new Date();
    readonly id = uuid()
    abstract name: EVENTS
    constructor(public readonly payload: PAYLOAD) { }
}

export interface EventDispatcher<EVENTS extends string> {
    dispatch<T extends DomainEvent<any, EVENTS>>(event: T): void;
}

export interface EventListener<EVENTS extends string> {
    onEvent<T extends DomainEvent<any, EVENTS>>(...name: EVENTS[]): Observable<T>
}

export interface EventBus<EVENTS extends string> extends EventListener<EVENTS>, EventDispatcher<EVENTS> {

}

//#endregion


//#region Implementation

export type WarehouseEvents = "PRODUCT_CREATED" | "CATEGORY_CREATED" | "STOCK_UPDATED"

class ProductCreated extends DomainEvent<{ sku: string }, WarehouseEvents> {
    name: WarehouseEvents = "PRODUCT_CREATED"
}

class StockUpdated extends DomainEvent<{ sku: string, stock: number }, WarehouseEvents> {
    name: WarehouseEvents = "STOCK_UPDATED"
}

class CategoryCreated extends DomainEvent<string, WarehouseEvents> {
    name: WarehouseEvents = "CATEGORY_CREATED"
}

class RxjsEventBus implements EventBus<WarehouseEvents> {

    private events$ = new Subject<DomainEvent<any, WarehouseEvents>>()

    onEvent<T extends DomainEvent<any, WarehouseEvents>>(...eventNames: WarehouseEvents[]): Observable<T> {
        return iif(
            () => eventNames.length > 0,
            this.events$.pipe(filter(ev => eventNames.includes(ev.name))),
            this.events$.asObservable()
        ) as Observable<T>;
    }

    dispatch<T extends DomainEvent<any, WarehouseEvents>>(event: T): void {
        this.events$.next(event)
    }

}


const eventbus = new RxjsEventBus()

eventbus.onEvent()
    .subscribe({
        next: event => console.log("all-events",event),
        error: error => console.log(error)
    })

eventbus.onEvent("CATEGORY_CREATED", "PRODUCT_CREATED")
    .subscribe({
        next: event => console.log("creation-events",event),
        error: error => console.log(error)
    })

eventbus.dispatch(new ProductCreated({ sku: "9978363737" }))
eventbus.dispatch(new CategoryCreated("ELECTRONICS"))
eventbus.dispatch(new StockUpdated({ sku: "6453993", stock: 7 }))
    
//#endregion