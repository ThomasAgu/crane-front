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

## 3. Ciclo de Vida: Del Canvas al Despliegue

Una vez que la arquitectura visual es consistente y las conexiones entre puertos y redes han pasado la validación de tipado del canvas, el flujo de ejecución sigue estos pasos:

1.  **Validación Estática:** El motor del Laboratorio comprueba que no existan bucles infinitos en las redes o puertos duplicados.
2.  **Compilación de Manifiestos:** El diagrama visual se traduce automáticamente a un archivo de configuración unificado (infraestructura como código).
3.  **Provisionamiento:** Se notifican a los daemons correspondientes para levantar los servicios en tiempo real.

> 💡 **Recomendación Profesional:** Puedes importar aplicaciones previamente construidas por ti o reutilizar e integrar componentes validados disponibles en el **Repositorio Comunitario** para acelerar el desarrollo distribuido.