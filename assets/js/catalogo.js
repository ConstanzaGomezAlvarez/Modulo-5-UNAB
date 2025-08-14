// ==================== Clase Producto ES6 ====================
class Producto {
  constructor({ title, brand, code, description, image, price, stock, quantity = 0, categoria, tags = [] }) {
    this.title = title;
    this.brand = brand;
    this.code = code;
    this.description = description;
    this.image = image;
    this.price = Number(price);
    this.stock = Number(stock);
    this.quantity = Number(quantity) || 0;
    this.categoria = Array.isArray(categoria) ? categoria : [categoria || "Sin categoría"];
    this.tags = Array.isArray(tags) ? tags : String(tags || "").split(",").map(t => t.trim()).filter(Boolean);
  }
  stockCritico() { return this.stock < 5 && this.stock > 1; }
  ultimaUnidad() { return this.stock === 1; }
  estaAgotado() { return this.stock === 0; }
  getTotal() { return this.price * this.quantity; }
  copiar() { return new Producto({ ...this }); }
}

// ==================== Variables globales ====================
let catalogo = [];
let cart = [];
const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const cartSummary = document.getElementById('cart-summary');

// ==================== Cargar productos ====================
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('productos.json');
    const data = await res.json();
    catalogo = data.map(p => new Producto(p));
    renderFilters();
    renderProducts(catalogo);
    renderCart();
  } catch (e) {
    console.error("Error cargando productos:", e);
  }
});

// ==================== Filtros ====================
function renderFilters() {
  const sel = document.getElementById('filter-category');
  const range = document.getElementById('filter-price');
  const priceValue = document.getElementById('price-value');
  const inputText = document.getElementById('filter-text');

  // Categorías únicas
  // Obtener todas las categorías únicas de todos los productos
  const allCats = catalogo.flatMap(p => p.categoria || ["Sin categoría"]);
  const cats = ['Todas', ...new Set(allCats)];
  sel.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');

  // Precio máximo dinámico
  const maxPrice = catalogo.length ? Math.max(...catalogo.map(p => p.price)) : 0;
  range.max = String(maxPrice);
  range.value = String(maxPrice);
  priceValue.textContent = `$${Number(range.value).toLocaleString()}`;

  // Listeners
  sel.addEventListener('change', applyFilters);
  range.addEventListener('input', () => {
    priceValue.textContent = `$${Number(range.value).toLocaleString()}`;
    applyFilters();
  });
  inputText.addEventListener('input', applyFilters);
}

function applyFilters() {
  const sel = document.getElementById('filter-category');
  const range = document.getElementById('filter-price');
  const inputText = document.getElementById('filter-text');
  const category = sel.value;
  const maxPrice = Number(range.value);
  const q = (inputText.value || '').trim().toLowerCase();

  const filtered = catalogo.filter(p => {
    const byCategory = category === 'Todas' || (p.categoria || ["Sin categoría"]).includes(category);
    const byPrice = Number(p.price) <= maxPrice;
    const haystack = [
      p.title, p.description,
      ...(Array.isArray(p.categoria) ? p.categoria : [p.categoria]),
      ...(Array.isArray(p.tags) ? p.tags : [])
    ].filter(Boolean).map(s => String(s).toLowerCase());
    const byText = !q || haystack.some(str => str.includes(q));
    return byCategory && byPrice && byText;
  });

  renderProducts(filtered);
}

// ==================== Renderizar productos ====================
function renderProducts(lista) {
  productList.innerHTML = '';
  if (!lista.length) {
    productList.innerHTML = `<div class="col text-center text-muted py-4">No se encontraron productos.</div>`;
    return;
  }

  lista.forEach((product, i) => {
    const agotado = product.estaAgotado();
    const stockCritico = product.stockCritico();
    const ultimaUnidad = product.ultimaUnidad();

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
      <div class="card h-100">
        <img src="${product.image || 'https://via.placeholder.com/600x400?text=Producto'}" class="card-img-top" alt="${product.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.title}</h5>
          <div class="mb-2">
            ${(product.categoria || ['Sin categoría']).map(c => `<span class="badge bg-primary">${c}</span>`).join(' ')}
          </div>
          <h6 class="card-subtitle mb-2 text-muted">${product.brand || ''}</h6>
          <h6 class="card-subtitle mb-2 text-muted">Código: #${product.code}</h6>
          <p class="card-text">${product.description || ''}</p>
          ${agotado ? '<p class="text-danger mt-auto"><strong>Agotado</strong></p>' : ''}
          ${ultimaUnidad ? '<p class="card-text text-warning mt-auto"><strong>¡Solo una unidad restante!</strong></p>' : ''}
          ${stockCritico ? '<p class="card-text text-info mt-auto"><strong>¡Últimas Unidades!</strong></p>' : ''}
          <p class="card-text mt-auto">Stock: ${product.stock}</p>
          <div class="mb-2">
            ${(product.tags || []).map(t => `<span class="badge bg-secondary">${t}</span>`).join(' ')}
          </div>
        </div>
        <div class="card-footer bg-transparent border-0">
          <h4 class="card-subtitle mb-2">Precio: $${Number(product.price).toLocaleString()}</h4>
          <input type="number" id="qty-${i}" class="form-control mb-2" placeholder="Cantidad" min="1" max="${product.stock}" ${agotado ? 'disabled' : ''}>
          <input type="checkbox" class="btn-check" id="chk-${i}" autocomplete="off" ${agotado ? 'disabled' : ''}>
          <label class="btn btn-outline-primary mb-2" for="chk-${i}">${agotado ? 'Sin stock' : 'Agregar al carrito'}</label>
          <button class="btn btn-primary w-100" ${agotado ? 'disabled' : ''} onclick="addToCart(${i})">Agregar</button>
        </div>
      </div>
    `;
    productList.appendChild(card);
  });
}

// ==================== Carrito ====================
function addToCart(index) {
  const product = catalogo[index];
  const checkbox = document.getElementById(`chk-${index}`);
  const qtyInput = document.getElementById(`qty-${index}`);
  const quantity = parseInt(qtyInput.value, 10);

  if (!checkbox || !checkbox.checked || isNaN(quantity) || quantity <= 0) {
    alert('Selecciona una cantidad válida y marca el producto antes de agregar.');
    return;
  }
  if (quantity > product.stock) {
    alert('No hay suficiente stock disponible.');
    return;
  }

  const existing = cart.find(p => p.code === product.code);
  if (existing) {
    if (existing.quantity + quantity > product.stock) {
      alert('No puedes agregar más de lo disponible en stock.');
      return;
    }
    existing.quantity += quantity;
  } else {
    const copy = product.copiar();
    copy.quantity = quantity;
    cart.push(copy);
  }

  qtyInput.value = '';
  checkbox.checked = false;
  renderCart();
}

function updateCartQuantity(index, newQty) {
  const product = cart[index];
  const qty = parseInt(newQty, 10);

  if (isNaN(qty) || qty < 0) {
    alert("La cantidad debe ser un número válido.");
    renderCart();
    return;
  }
  if (qty === 0) {
    if (confirm("¿Quieres eliminar este producto del carrito?")) {
      cart.splice(index, 1);
      renderCart();
    } else {
      renderCart();
    }
    return;
  }
  if (qty > product.stock) {
    alert("No hay suficiente stock para este producto.");
    renderCart();
    return;
  }
  product.quantity = qty;
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function clearCart() {
  if (!cart.length) {
    alert("El carrito ya está vacío.");
    return;
  }
  if (confirm("¿Seguro que quieres vaciar el carrito?")) {
    cart = [];
    renderCart();
  }
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = '<p>El carrito está vacío.</p>';
    cartSummary.innerHTML = '';
    return;
  }

  let tableHtml = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nombre</th><th>Cantidad</th><th>Valor</th><th>Total</th><th>Acción</th>
        </tr>
      </thead>
      <tbody>
  `;

  cart.forEach((product, i) => {
    tableHtml += `
      <tr>
        <td>${product.title}</td>
        <td><input type="number" min="0" max="${product.stock}" value="${product.quantity}" onchange="updateCartQuantity(${i}, this.value)" class="form-control" style="width:80px"></td>
        <td>$${Number(product.price).toLocaleString()}</td>
        <td>$${product.getTotal().toLocaleString()}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${i})">Eliminar</button></td>
      </tr>
    `;
  });

  tableHtml += `</tbody></table>
  <div class="text-end mt-3">
    <button class="btn btn-danger" onclick="clearCart()">Vaciar carrito</button>
  </div>`;

  cartItems.innerHTML = tableHtml;
  calculateTotals();
}

function calculateTotals() {
  const neto = cart.reduce((acc, p) => acc + p.getTotal(), 0);
  const iva = neto * 0.19;
  let total = neto + iva;
  const despacho = total > 100000 ? total * 0.05 : 0;
  total += despacho;

  cartSummary.innerHTML = `
    <p><strong>Valor neto:</strong> $${neto.toLocaleString()}.-</p>
    <p><strong>IVA 19%:</strong> $${iva.toLocaleString()}.-</p>
    ${despacho > 0 ? `<p><strong>Despacho:</strong> $${despacho.toLocaleString()}.-</p>` : ''}
    <p><strong>Valor Total:</strong> $${total.toLocaleString()}.-</p>
  `;
}

