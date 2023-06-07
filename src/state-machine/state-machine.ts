import { BehaviorSubject } from "rxjs";
import { filter, map } from 'rxjs/operators';


export interface State<T> {
    name: T;
    data: any;
}

export interface Transition<T> {
    from: T;
    to: T[];
}

export interface StateMachineConfig<T> {
    initialState: State<T>;
    transitions?: Transition<T>[];
}

export class InvalidStateError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'InvalidStateError'
        this.stack = ''
    }
}

export class StateMachine<T> {

    private currentState: BehaviorSubject<State<T>>;
    private transitions: Transition<T>[];

    constructor(config: StateMachineConfig<T>) {
        this.currentState = new BehaviorSubject(config.initialState)
        this.transitions = config.transitions ? config.transitions : []
    }

    state() {
        return this.currentState.asObservable()
    }

    stateValue(){
        return this.currentState.getValue()
    }

    stateFor(stateName: T) {
        return this.currentState.asObservable().pipe(
            filter(state => state.name === stateName),
            map(state => state.data)
        )
    }

    transition(state: State<T>) {
        const currentState = this.currentState.getValue().name
        const transitionToValidate = this.transitions
            .filter(t => t.from === currentState)
            .map(t => t.to)
            .reduce((result, element) => result.concat(element), [])
        if (!transitionToValidate.includes(state.name)) {
            throw new InvalidStateError(`The transition from "${currentState}" to "${state.name}" is invalid. The valid transitions for "${currentState}" are "${transitionToValidate}".`)
        }
        this.currentState.next(state)
    }

}