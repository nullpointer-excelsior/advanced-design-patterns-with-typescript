import { DomainEvent, EventBus, RxjsEventBus } from './events';


type WarehouseEvents = "PRODUCT_CREATED" | "CATEGORY_CREATED"

class ProductCreated extends DomainEvent<{ sku: string }, WarehouseEvents> {
    name: WarehouseEvents = "PRODUCT_CREATED"
}

class CategoryCreated extends DomainEvent<string, WarehouseEvents> {
    name: WarehouseEvents = "CATEGORY_CREATED"
}

describe('RxjsEventBus', () => {
    let eventbus: EventBus<WarehouseEvents>;

    beforeEach(() => {
        eventbus = new RxjsEventBus<WarehouseEvents>();
    });

    it('should dispatch and listen to all events', (done) => {
        const productEvent = new ProductCreated({ sku: "9978363737" });
        const categoryEvent = new CategoryCreated("ELECTRONICS");

        const allEventsSubscription = eventbus.onEvent().subscribe({
            next: (event) => {
                expect(event).toEqual(expect.any(DomainEvent));
                if (event.name === productEvent.name) {
                    expect(event.data.sku).toBe(productEvent.data.sku);
                } else if (event.name === categoryEvent.name) {
                    expect(event.data).toBe(categoryEvent.data);
                }
                allEventsSubscription.unsubscribe()
                done()
            },
            complete: () => {
                allEventsSubscription.unsubscribe();
                done();
            },
            error: (error) => {
                allEventsSubscription.unsubscribe();
                done(error);
            },
        });

        eventbus.dispatch(productEvent);
        eventbus.dispatch(categoryEvent);

    });

    it('should dispatch and listen to specific events', (done) => {
        const categoryEvent = new CategoryCreated("ELECTRONICS");

        const categoryEventSubscription = eventbus.onEvent("CATEGORY_CREATED").subscribe({
            next: (event) => {
                expect(event.name).toEqual(categoryEvent.name);
                categoryEventSubscription.unsubscribe()
                done()
            },
            complete: () => {
                categoryEventSubscription.unsubscribe();
                done();
            },
            error: (error) => {
                categoryEventSubscription.unsubscribe();
                done(error);
            },
        });

        eventbus.dispatch(categoryEvent);
    });
});
