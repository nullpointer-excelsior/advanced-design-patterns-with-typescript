import { State, Transition, StateMachineConfig, InvalidStateError, StateMachine } from './state-machine';

describe('StateMachine', () => {
  const initialState: State<string> = { name: 'A', data: null };
  const validTransition: Transition<string> = { from: 'A', to: ['B'] };
  
  let stateMachine: StateMachine<string>;

  beforeEach(() => {
    const config: StateMachineConfig<string> = {
      initialState: initialState,
      transitions: [validTransition]
    };

    stateMachine = new StateMachine(config);
  });

  it('should initialize with the initial state', () => {
    expect(stateMachine.stateValue()).toEqual(initialState);
  });

  it('should transition to a valid state', () => {
    const newState: State<string> = { name: 'B', data: null };

    stateMachine.transition(newState);
    expect(stateMachine.stateValue()).toEqual(newState);
  });

  it('should throw an error when transitioning to an invalid state', () => {
    const newState: State<string> = { name: 'C', data: null };

    expect(() => stateMachine.transition(newState)).toThrow(InvalidStateError);
  });

  it('should emit the data for a specific state', (done) => {
    const newState: State<string> = { name: 'B', data: 'Some data' };

    stateMachine.stateFor('B').subscribe((data) => {
      expect(data).toEqual('Some data');
      done();
    });

    stateMachine.transition(newState);
  });
});
