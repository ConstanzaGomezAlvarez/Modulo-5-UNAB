
# Modulo-5-UNAB

## Descripción
Este proyecto es una aplicación web para la gestión y visualización de un catálogo de productos, con funcionalidades de carrito de compras, administración de inventario y consumo de una API local (proxy-servers).

## Estructura del Proyecto

- `catalogo.html`: Catálogo de productos para clientes.
- `admin.html`: Panel de administración para CRUD de productos.
- `index.html`: Página principal.
- `proxy-servers/`: Servidor Node.js con API REST para productos.
  - `assets/`: Imágenes y recursos usados por la API.
  - `productos.json`: Base de datos local de productos.
  - `routes/`: Rutas de la API.
  - `index.js`: Entrada principal del servidor.
- `README.md`: Documentación del proyecto.

## Funcionalidades

- Visualización de productos con filtros por categoría, precio y búsqueda.
- Carrito de compras con agregar, modificar cantidad, eliminar y vaciar.
- Cálculo automático de totales, IVA y despacho.
- Boleta electrónica con detalle de compra y datos de despacho.
- Panel de administración para agregar, editar y eliminar productos.
- Persistencia de datos usando localStorage y API REST.
- API local con Node.js y Express para servir productos y actualizar stock.

## Instalación y Ejecución

1. Clona el repositorio:
	```sh
	git clone https://github.com/ConstanzaGomezAlvarez/Modulo-5-UNAB.git

	Rama M5-ABPRO3
	```
2. Instala dependencias del servidor:
	```sh
	cd proxy-servers
	npm install
	```
3. Inicia el servidor local:
	```sh
	npm start
	```
4. Abre `index.html` o `catalogo.html` en tu navegador. Asegúrate que el servidor esté corriendo para consumir la API.

## API

- Endpoint principal: `GET /productos` para obtener el catálogo.
- Endpoint de actualización: `POST /actualizar-stock` para modificar stock tras compra.
- Ver rutas y documentación en `proxy-servers/routes/productos.routes.js` y `proxy-servers/swagger.json`.

## Tecnologías
- HTML5, CSS3, Bootstrap
- JavaScript (ES6)
- Node.js, Express
- LocalStorage

## Autoría
Javiera Ampuero
Constanza Gómez Alvarez
Francisco Hidalgo
Fabian Jeldes

