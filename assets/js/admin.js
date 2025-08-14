let catalogo = [];

document.addEventListener('DOMContentLoaded', async () => {
  const localData = localStorage.getItem('catalogo');
  if (localData) {
    catalogo = JSON.parse(localData);
  } else {
    try {
      const res = await fetch('productos.json');
      catalogo = await res.json();
      localStorage.setItem('catalogo', JSON.stringify(catalogo));
    } catch (e) {
      console.error("Error cargando productos:", e);
    }
  }
  renderInventario();
});

//  Renderizar tabla
function renderInventario() {
  const tabla = document.querySelector('#tabla-inventario tbody');
  tabla.innerHTML = '';

  catalogo.forEach((product, i) => {
    const categorias = (product.categoria || ['Sin categoría']).join(', ');
    tabla.innerHTML += `
      <tr>
        <td>${product.title}</td>
        <td>${product.brand || ''}</td>
        <td>${product.code || ''}</td>
        <td><img src="${product.image || ''}" alt="img" style="max-width:50px;max-height:50px"></td>
        <td>${product.description}</td>
        <td>$${Number(product.price).toLocaleString()}</td>
        <td>${categorias}</td>
        <td>${product.stock}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editarProducto(${i})"><i class="bi bi-pencil-square"></i></button>
          <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${i})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `;
  });
}

// Agregar producto
document.getElementById('formNuevo').addEventListener('submit', e => {
  e.preventDefault();

  const nuevo = {
    title: document.getElementById('nuevoNombre').value.trim(),
    brand: document.getElementById('nuevoMarca').value.trim(),
    code: document.getElementById('nuevoCodigo').value.trim(),
    image: document.getElementById('nuevoImagen').value.trim(),
    description: document.getElementById('nuevoDescripcion').value.trim(),
    price: Number(document.getElementById('nuevoPrecio').value),
    categoria: document.getElementById('nuevoCategoria').value.split(',').map(c => c.trim()),
    stock: Number(document.getElementById('nuevoCantidad').value)
  };

  catalogo.push(nuevo);
  localStorage.setItem('catalogo', JSON.stringify(catalogo));
  renderInventario();
  e.target.reset();
});

// Editar producto
window.editarProducto = index => {
  const product = catalogo[index];
  document.getElementById('editNombre').value = product.title;
  document.getElementById('editMarca').value = product.brand || '';
  document.getElementById('editCodigo').value = product.code || '';
  document.getElementById('editImagen').value = product.image || '';
  document.getElementById('editDescripcion').value = product.description;
  document.getElementById('editPrecio').value = product.price;
  document.getElementById('editCategoria').value = (product.categoria || []).join(', ');
  document.getElementById('editCantidad').value = product.stock;
  document.getElementById('editIndex').value = index;

  new bootstrap.Modal(document.getElementById('modalEditar')).show();
};

// Guardar edición
document.getElementById('formEditar').addEventListener('submit', e => {
  e.preventDefault();
  const index = Number(document.getElementById('editIndex').value);

  catalogo[index] = {
    title: document.getElementById('editNombre').value.trim(),
    brand: document.getElementById('editMarca').value.trim(),
    code: document.getElementById('editCodigo').value.trim(),
    image: document.getElementById('editImagen').value.trim(),
    description: document.getElementById('editDescripcion').value.trim(),
    price: Number(document.getElementById('editPrecio').value),
    categoria: document.getElementById('editCategoria').value.split(',').map(c => c.trim()),
    stock: Number(document.getElementById('editCantidad').value)
  };

  localStorage.setItem('catalogo', JSON.stringify(catalogo));
  renderInventario();
  bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
});

// 🗑️ Eliminar producto
window.eliminarProducto = index => {
  if (confirm('¿Seguro que deseas eliminar el producto?')) {
    catalogo.splice(index, 1);
    localStorage.setItem('catalogo', JSON.stringify(catalogo));
    renderInventario();
  }
};