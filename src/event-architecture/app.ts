import { DomainEvent, EventBus, RxjsEventBus } from "./events"

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

const eventbus: EventBus<WarehouseEvents> = new RxjsEventBus<WarehouseEvents>()

eventbus.onEvent()
    .subscribe({
        next: event => console.log("all-events", event),
        error: error => console.log(error)
    })

eventbus.onEvent("CATEGORY_CREATED")
    .subscribe({
        next: event => console.log("category-event", event.data),
        error: error => console.log(error)
    })

eventbus.dispatch(new ProductCreated({ sku: "9978363737" }))
eventbus.dispatch(new CategoryCreated("ELECTRONICS"))
eventbus.dispatch(new StockUpdated({ sku: "6453993", stock: 7 }))