let catalogo = [];

document.addEventListener('DOMContentLoaded', async () => {
  await cargarProductos();
  // Asocia el submit del formulario de edición
  document.getElementById('formEditarProducto').onsubmit = guardarCambiosProducto;
  document.getElementById('formNuevo').onsubmit = agregarNuevoProducto; // <--- Agregado
});

async function cargarProductos() {
  try {
    const res = await fetch('http://localhost:3000/api/productos');
    const data = await res.json();
    catalogo = data;
    renderInventario();
  } catch (e) {
    console.error("Error cargando productos:", e);
    document.querySelector('#tabla-inventario tbody').innerHTML = `<tr><td colspan="6" class="text-danger">Error al cargar productos</td></tr>`;
  }
}

//  Renderizar tabla
function renderInventario() {
  const tabla = document.querySelector('#tabla-inventario tbody');
  tabla.innerHTML = '';

  if (!catalogo.length) {
    tabla.innerHTML = `<tr><td colspan="6" class="text-center">No hay productos para mostrar</td></tr>`;
    return;
  }

  catalogo.forEach((product, i) => {
    tabla.innerHTML += `
      <tr>
        <td>${product.id}</td>
        <td>${product.nombre || ''}</td>
        <td>$${Number(product.precio).toLocaleString()}</td>
        <td>${product.categoria || ''}</td>
        <td>${product.stock}</td>
        <td>${product.description || ''}</td>
        <td>
          <img src="${product.imagen || 'https://via.placeholder.com/50'}" alt="img" style="max-width:50px;max-height:50px">
        </td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editarProducto(${i})"><i class="bi bi-pencil-square"></i></button>
          <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${i})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `;
  });
}

// Abre el modal y carga los datos del producto seleccionado
window.editarProducto = function (index) {
  const p = catalogo[index];
  document.getElementById('edit-id').value = p.id;
  document.getElementById('edit-nombre').value = p.nombre || '';
  document.getElementById('edit-precio').value = p.precio;
  document.getElementById('edit-categoria').value = p.categoria || '';
  document.getElementById('edit-stock').value = p.stock;
  document.getElementById('edit-imagen').value = p.imagen || '';
  document.getElementById('edit-description').value = p.description || '';
  // Muestra el modal usando Bootstrap 5
  const modal = new bootstrap.Modal(document.getElementById('modalEditarProducto'));
  modal.show();
};

// Envía los cambios a la API y actualiza la tabla
async function guardarCambiosProducto(e) {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const productoActualizado = {
    nombre: document.getElementById('edit-nombre').value,
    precio: Number(document.getElementById('edit-precio').value),
    categoria: document.getElementById('edit-categoria').value,
    stock: Number(document.getElementById('edit-stock').value),
    imagen: document.getElementById('edit-imagen').value,
    description: document.getElementById('edit-description').value
  };

  try {
    const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productoActualizado)
    });
    if (!res.ok) throw new Error('Error al actualizar producto');
    // Cierra el modal
    bootstrap.Modal.getInstance(document.getElementById('modalEditarProducto')).hide();
    // Recarga productos y tabla
    await cargarProductos();
  } catch (err) {
    alert('Error al actualizar producto');
    console.error(err);
  }
}

// Función para eliminar producto
window.eliminarProducto = async function (index) {
  const producto = catalogo[index];
  if (!producto) return;

  if (!confirm(`¿Seguro que deseas eliminar el producto "${producto.nombre}"?`)) return;

  try {
    const res = await fetch(`http://localhost:3000/api/productos/${producto.id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar producto');
    await cargarProductos(); // Recarga la tabla después de eliminar
  } catch (err) {
    alert('No se pudo eliminar el producto');
    console.error(err);
  }
}

async function agregarNuevoProducto(e) {
  e.preventDefault();

  // Obtén los valores del formulario
  const nombre = document.getElementById('nuevoNombre').value;
  const precio = Number(document.getElementById('nuevoPrecio').value);
  categoria = document.getElementById('nuevoCategoria').value;
  const description = document.getElementById('nuevoDescripcion').value;
  const imagen = document.getElementById('nuevoImagen').value;
  const stock = Number(document.getElementById('nuevoCantidad').value);

  // Validación mínima
  if (!nombre || !precio) {
    alert('Nombre y precio son obligatorios');
    return;
  }

  // Construye el objeto para la API
  const nuevoProducto = {
    nombre,
    precio,
    categoria,
    description,
    imagen,
    stock
  };

  try {
    const res = await fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto)
    });
    if (!res.ok) throw new Error('Error al agregar producto');
    // Limpia el formulario
    e.target.reset();
    // Recarga la tabla
    await cargarProductos();
  } catch (err) {
    alert('No se pudo agregar el producto');
    console.error(err);
  }
}