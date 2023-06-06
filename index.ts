import { interval, map, take } from "rxjs"
import { State, StateMachine, StateMachineConfig } from "./state-machine"

export type QualityControlState = 'factory-proccess' | 'visual-inspection' | 'functional-inspection' | 'approved' | 'rejected'

const config: StateMachineConfig<QualityControlState> = {
    initialState: {
        name: 'factory-proccess',
        data: 'Building product'
    },
    transitions: [
        { from: 'factory-proccess', to: ['visual-inspection'] },
        { from: 'visual-inspection', to: ['functional-inspection', 'rejected'] },
        { from: 'functional-inspection', to: ['rejected', 'approved'] },
        { from: 'rejected', to: ['factory-proccess'] },
    ]
}

let productState = new StateMachine<QualityControlState>(config)

/**
 * Execute transitions by 1 second interval.
 * @param states 
 * @returns 
 */
const executeTransitions = (states: State<QualityControlState>[]) => {
    return interval(1000).pipe(
        take(states.length),
        map((index) => states[index])
    )
}

// Subscripcion al estado de un producto
productState
    .state()
    .subscribe(state => console.log('Product state', state))


const successTransitions = () => {
    const transitions: State<QualityControlState>[] = [
        { name: 'visual-inspection', data: 'Performing visual inspection' },
        { name: 'functional-inspection', data: 'Performing functional inspection' },
        { name: 'approved', data: 'Product approved' },
    ];
    executeTransitions(transitions)
        .subscribe((state: State<QualityControlState>) => productState.transition(state));
}

const failedTransition = () => {
    const transitions: State<QualityControlState>[] = [
        { name: 'visual-inspection', data: 'Performing visual inspection' },
        { name: 'rejected', data: 'Product rejected' },
    ];
    executeTransitions(transitions)
        .subscribe((state: State<QualityControlState>) => productState.transition(state));
}

const invalidTransitions = () => {
    const transitions: State<QualityControlState>[] = [
        { name: 'visual-inspection', data: 'Performing visual inspection' },
        { name: 'approved', data: 'Product approved' },
    ];
    executeTransitions(transitions)
        .subscribe({
            next: (state: State<QualityControlState>) => productState.transition(state),
            error: (err) => console.error(err.message)
        });
}


successTransitions()
// failedTransition()
// invalidTransitions()


