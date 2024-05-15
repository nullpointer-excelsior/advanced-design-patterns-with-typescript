# Advanced design patterns with typescript

Este repositorio contiene uso de patrones de diseño avanzado con ejemplos puestos en producción. a continuación se listan 
los ejemplos disponibles:

* `state-machine`: ejemplo de implementación de una maquina de estados con validación de transiciones entre un estado a otro para mantener la consistencia interna de los datos.

* `event-arquitecture`: Ejemplo de implementación de arquitectura orientada a eventos con Rxjs. Uso para eventos de dominio, escucha de estados y eventos personalizados

* `resilience-patterns`: Ejemplos de patrones de resilencia combinados con RxJs. se encuentran los siguientes ejemplos: timeout, retry y fallback.


## Ejecutando los ejemplos 

Para ejecutar las pruebas unitarias

```bash
#!/bin/bash
npm run test
```

### `state-machine`:
```bash
#!/bin/bash

# running state-machine example 
npm run start:state-machine
```

### `resilience`:
```bash
#!/bin/bash

# running resilience example
npm run start:resilience
```

## Tecnologías

* Nodejs 18
* RxJs 7


`Autor`: Benjamín
