# ABPRO4

## Tecnologías utilizadas

Este proyecto está desarrollado con los siguientes lenguajes y tecnologías:

- **HTML5**: Estructura de las páginas web (`index.html`, `catalogo.html`).
- **CSS3**: Estilos personalizados y uso de Bootstrap para diseño responsivo (`css/style.css`, `css/stylesconbootstrap.css`).
- **JavaScript**: Lógica de interacción y dinamismo en el catálogo (`js/index.js`, `js/catalogo.js`).

## Funcionalidades principales

- Visualización de un catálogo de productos con imágenes y descripciones.
- Navegación entre la página principal y el catálogo.
- Filtros dinámicos por categoría, precio máximo y búsqueda de texto libre.
- Carrito de compras con agregar, actualizar cantidad, eliminar y vaciar.
- Cálculo automático de totales, IVA y despacho según condiciones.
- Boleta electrónica que muestra detalle de productos y datos de despacho.
- Persistencia del carrito usando localStorage para mantener los productos al recargar la página.
- Diseño responsivo para adaptarse a distintos dispositivos.
- Uso de recursos gráficos e íconos personalizados.

## Descripción

En este proyecto utilizamos ambas formas de realizar peticiones HTTP: fetch() y XHR(XMLHttpRequest) 
La principal diferencia entre XMLHttpRequest (XHR) y fetch() radica en su enfoque y facilidad de uso. 
XHR es más antiguo, con una sintaxis verbosa y basada en callbacks, lo que puede complicar el manejo de errores
y la lectura del código. En cambio, fetch() utiliza promesas, lo que permite escribir código más limpio y moderno, 
especialmente con async/await. Aunque ambos métodos permiten realizar peticiones HTTP, fetch() ofrece una 
experiencia más intuitiva y eficiente para desarrolladores actuales, mientras que XHR puede ser útil en casos
específicos como el seguimiento de progreso o compatibilidad con navegadores antiguos. En términos de rendimiento,
no hay diferencias significativas, pero fetch() facilita el desarrollo y mantenimiento de aplicaciones web modernas.


## Estructura

Modulo-5-UNAB-M5-ABPRO4/
-├─ README.md
-├─ index.html
-├─ catalogo.html
-├─ admin.html
-├─ productos.json
-├─ assets/
-│   ├─ css/
-│   │   ├─ style.css
-│   │   └─ stylesconbootstrap.css
-│   ├─ favicon.ico
-│   ├─ img/
-│   └─ js/
-│       ├─ admin.js
-│       ├─ catalogo.js
-│       └─ index.js


## Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, etc.)
- Conexión local para leer productos.json o servidor local (ej. Live Server en VS Code).

## Instalación

1. Clona el repositorio:
	```bash
	git clone https://github.com/ConstanzaGomezAlvarez/Modulo-5-UNAB/tree/M5-ABPRO4
	```
2. Abre la carpeta `M5-ABPRO4`.
3. Abre `index.html` en tu navegador.

## Contribuidores

- Francisco Hidalgo
- Constanza Gómez
- Fabián Jeldes
- Javiera Ampuero
