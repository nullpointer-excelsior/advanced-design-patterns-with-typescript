import { QualityControlState } from './app';
import { StateMachine, StateMachineConfig, InvalidStateError } from './state-machine'; // Reemplaza './your-state-machine-file' con la ruta correcta a tu archivo de la máquina de estados

describe('productState', () => {
  let productState: StateMachine<QualityControlState>;

  beforeEach(() => {
    // Configuración de la instancia de la máquina de estados para cada prueba
    const config: StateMachineConfig<QualityControlState> = {
      initialState: {
        name: 'factory-proccess',
        data: 'Building product',
      },
      transitions: [
        { from: 'factory-proccess', to: ['visual-inspection'] },
        { from: 'visual-inspection', to: ['functional-inspection', 'rejected'] },
        { from: 'functional-inspection', to: ['rejected', 'approved'] },
        { from: 'rejected', to: ['factory-proccess'] },
      ],
    };
    productState = new StateMachine<QualityControlState>(config);
  });

  test('should initialize with the correct initial state', () => {
    const initialState = productState.stateValue();
    expect(initialState.name).toBe('factory-proccess');
    expect(initialState.data).toBe('Building product');
  });

  test('should transition to a valid state', () => {
    productState.transition({ name: 'visual-inspection', data: 'Performing visual inspection' });
    const currentState = productState.stateValue();
    expect(currentState.name).toBe('visual-inspection');
    expect(currentState.data).toBe('Performing visual inspection');
  });

  test('should throw InvalidStateError when transitioning to an invalid state', () => {
    const invalidTransition = () => {
      productState.transition({ name: 'rejected', data: 'Rejected due to defects' });
    };
    expect(invalidTransition).toThrow(InvalidStateError);
  });

  test('should emit the correct state value after transition', () => {
    const stateListener = jest.fn();
    productState.state().subscribe(stateListener);

    productState.transition({ name: 'visual-inspection', data: 'Performing visual inspection' });

    expect(stateListener).toHaveBeenCalledTimes(2); // El estado inicial + el estado después de la transición
    expect(stateListener).toHaveBeenCalledWith({ name: 'factory-proccess', data: 'Building product' });
    expect(stateListener).toHaveBeenCalledWith({ name: 'visual-inspection', data: 'Performing visual inspection' });
  });

  test('should filter and map state changes correctly using stateFor', () => {
    const functionalInspectionListener = jest.fn();
    const visualInspectionListener = jest.fn();
    const rejectedListener = jest.fn();
    productState.stateFor('functional-inspection').subscribe(functionalInspectionListener);
    productState.stateFor('visual-inspection').subscribe(visualInspectionListener);
    productState.stateFor('rejected').subscribe(rejectedListener);

    productState.transition({ name: 'visual-inspection', data: 'Performing visual inspection' });
    productState.transition({ name: 'functional-inspection', data: 'Performing functional inspection' });

    expect(visualInspectionListener).toHaveBeenCalledTimes(1);
    expect(functionalInspectionListener).toHaveBeenCalledTimes(1);
    expect(functionalInspectionListener).toHaveBeenCalledWith('Performing functional inspection');
    expect(visualInspectionListener).toHaveBeenCalledWith('Performing visual inspection');
    expect(rejectedListener).not.toHaveBeenCalled();
  });
});
