# Laboratorio (Herramienta para trabajar interactivamente con las aplicaciones)

El **Laboratorio** es el entorno de diseño interactivo basado en diagramas de flujo (*FlowCharts*) diseñado para modelar, configurar y desplegar la topología de tus aplicaciones de infraestructura. Su objetivo es abstraer la complejidad de la gestión de archivos de configuración manuales mediante una interfaz visual reactiva de nivel corporativo.

---

## 1. Modos de Inicio del Ciclo de Diseño

Al inicializar una sesión en el Laboratorio, el sistema despliega el **Gestor de Inicialización de Plantillas (Template Manager)**, permitiendo dos flujos de trabajo diferenciados:

![Interfaz del lienzo interactivo del Laboratorio con un flujo de microservicios](/docs/templates.png)

### A. Estructuras Preconfiguradas (Templates)
Permite instanciar topologías pre-validadas de arquitecturas comunes (ej. *MERN stack*, *Microservicios*, *Sistemas balanceados con Nginx*). 

* **Ventajas:** Reduce el *Time-to-Deploy* al incluir variables de entorno por defecto y mapeos de red óptimos.

### B. Lienzo en Blanco (Greenfield Development)
Provee un viewport limpio sin dependencias inyectadas para arquitectos de software que requieran diseñar infraestructuras personalizadas desde el nivel físico-lógico base.

---

## 2. Diagrama de estructura

La infraestructura se modela a través de nodos interconectados. Cada nodo encapsula lógica específica que se traduce directamente en especificaciones de contenedores y orquestación:

### 📦 Aplicaciones (`App`)
Solo puede haber uno por proyecto, define variables de entorno de la misma, cantidad de instancias maximas y minimas. Solo pueden asignarsele servicios

### 🐳 Servicios (`Services`)
Representa las unidades de cómputo y procesos core de tu aplicación. 
* **Parámetros Configurables:** Imagen base (Docker Registry compatible), políticas de reinicio (*restart policies*), variables de entorno e inyección de secretos.

### 🌐 Redes Virtuales Aisladas (`Networks`)
Capas de red lógica que aíslan o comunican componentes.
* **Seguridad:** Permite estructurar topologías de múltiples capas (ej. redes privadas para bases de datos y redes públicas expuestas vía proxy inverso).

### 💾 Volúmenes de Almacenamiento Persistente (`Volumes`)
Abstracciones de almacenamiento que garantizan la persistencia del estado de los datos más allá del ciclo de vida de los contenedores individuales.
* **Casos de uso:** Directorios de datos para bases de datos relacionales, almacenamiento de logs permanentes y carga de archivos estáticos.

---

## 3. Gestor de alertas

El editor de alertas permite definir politicas o reglas de escalado que estaran en continue funcionamiento cuando la aplicacion este corriendo. Cada alerta es definida por una funcion en PromQL que de ser de resultado verdadero la alerta sera disparada. 

Las templates al no ser instanciadas, las alertas definidas sobre ellas no seran creadas.

## 4. Ciclo de Vida: Del Canvas al Despliegue

Una vez que la arquitectura visual es consistente y las conexiones entre puertos y redes han pasado la validación de tipado del canvas, el flujo de ejecución sigue estos pasos:

1.  **Validación Estática:** El motor del Laboratorio comprueba que no existan bucles infinitos en las redes o puertos duplicados.
2.  **Compilación de Manifiestos:** El diagrama visual se traduce automáticamente a un archivo de configuración unificado (infraestructura como código).
3.  **Provisionamiento:** Se notifican a los daemons correspondientes para levantar los servicios en tiempo real.

> 💡 **Recomendación Profesional:** Puedes importar aplicaciones previamente construidas por ti o reutilizar e integrar componentes validados disponibles en el **Repositorio Comunitario** para acelerar el desarrollo distribuido.

## 4. Anatomía y Configuración de un Servicio (`Nodes`)

El Laboratorio permite modelar la interacción entre múltiples contenedores (por ejemplo, una arquitectura clásica de un servicio de **Node.js** conectado a una base de datos **MySQL**). Cada nodo de servicio cuenta con un ciclo de configuración dinámico basado en la procedencia de su imagen.

### A. Inyección de Configuración por Defecto (`dockerDefaults`)
Para optimizar el tiempo de configuración, el sistema integra un motor de emparejamiento basado en `dockerDefaults`. 
* **Imágenes Oficiales/Conocidas:** Si el usuario selecciona una imagen estándar (ej. `mysql`, `postgres`, `redis`), el sistema inyecta automáticamente las variables de entorno mandatorias, comandos de inicialización (`CMD`) y **volúmenes predefinidos** necesarios para su persistencia correcta.
* **Imágenes Personalizadas:** En caso de utilizar una imagen propia o no registrada, el sistema deshabilita las plantillas automáticas y expone un formulario de configuración manual avanzada.

### B. Parámetros de Control del Contenedor
El usuario tiene gobernanza absoluta sobre los siguientes descriptores del ciclo de vida del servicio:

* **Puertos (`Ports`):** Mapeo de puertos entre el host y el contenedor (`HOST:CONTAINER`) para la exposición de servicios.
* **Imagen (`Image`):** Especificación del tag del contenedor apuntando a registros públicos o privados.
* **Variables de Entorno (`ENV`):** Key-values esenciales para la configuración en runtime.
* **Comando de Inicio (`CMD`):** Sobrescritura del *entrypoint* o comando por defecto del contenedor.
* **Archivos de Inicialización Automática (`Init Files`):** Capacidad de montar archivos de código o scripts de inicialización de manera automatizada. 

> 💡 **Caso de Uso:** Esta funcionalidad permite inyectar una estructura base (ej. rutas de una API en Node.js o scripts `.sql` de migración en MySQL) para que el servicio inicie con lógica de negocio pre-cargada sin intervención manual posterior.

---

## 5. Topología de Ejemplo: Stack Node.js + MySQL

Para comprender la interacción de todos estos componentes (Servicios, Redes, Volúmenes y Defaults), observa el siguiente esquema de arquitectura visual modelado directamente en la plataforma:

![Esquema de arquitectura visual que muestra la interconexión entre un servicio Node.js, una base de datos MySQL, volúmenes de datos y la red interna del sistema.](/docs/appcreada.png)