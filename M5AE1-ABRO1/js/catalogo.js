// ==================== Clase Producto ES5 ====================
function Producto(data) {
    this.title = data.title;
    this.brand = data.brand;
    this.code = data.code;
    this.description = data.description;
    this.image = data.image;
    this.price = data.price;
    this.stock = data.stock;
    this.quantity = data.quantity || 0;
}

Producto.prototype.stockCritico = function () {
    return this.stock < 5 && this.stock > 1;
};

Producto.prototype.ultimaUnidad = function () {
    return this.stock === 1;
};

Producto.prototype.estaAgotado = function () {
    return this.stock === 0;
};

Producto.prototype.getTotal = function () {
    return this.price * this.quantity;
};

Producto.prototype.copiar = function () {
    var copia = new Producto(this);
    copia.quantity = this.quantity;
    return copia;
};

// ==================== Variables globales ====================
var catalogo = [];
var cart = [];
var productList = document.getElementById('product-list');
var cartItems = document.getElementById('cart-items');
var cartSummary = document.getElementById('cart-summary');

// ==================== Cargar productos desde JSON ====================
function cargarCatalogo(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'productos.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var arr = JSON.parse(xhr.responseText);
                    catalogo = [];
                    for (var i = 0; i < arr.length; i++) {
                        catalogo.push(new Producto(arr[i]));
                    }
                    callback();
                } catch (e) {
                    alert('Error al cargar productos. Error: ' + e.message);
                }
            }
        };
    }
    xhr.send();
}

// ==================== Renderizar productos ====================
function renderProducts(lista) {
    productList.innerHTML = '';
    for (var i = 0; i < lista.length; i++) {
        var product = lista[i];
        var agotado = product.estaAgotado();
        var stockCritico = product.stockCritico();
        var ultimaUnidad = product.ultimaUnidad();
        var productCard = document.createElement('div');
        productCard.className = 'col';
        productCard.innerHTML =
            '<div class="card h-100">' +
            '<img src="' + product.image + '" class="card-img-top" alt="' + product.title + '">' +
            '<div class="card-body d-flex flex-column">' +
            '<h5 class="card-title">' + product.title + '</h5>' +
            '<h6 class="card-subtitle mb-2 text-muted">' + product.brand + '</h6>' +
            '<h6 class="card-subtitle mb-2 text-muted">Código: #' + product.code + '</h6>' +
            '<p class="card-text">' + product.description + '</p>' +
            (agotado ? '<p class="text-danger mt-auto"><strong>Agotado</strong></p>' : '') +
            (ultimaUnidad ? '<p class="card-text text-warning mt-auto"><strong> ¡Solo una unidad restante!</strong></p>' : '') +
            (stockCritico ? '<p class="card-text text-info mt-auto"><strong> ¡Últimas Unidades!' : '') + '</strong></p>' +
            '<p class="card-text mt-auto">Stock: ' + product.stock + '</p>' +
            '</div>' +
            '<div class="card-footer bg-transparent border-0">' +
            '<h4 class="card-subtitle mb-2">Precio: $' + product.price + '</h4>' +
            '<input type="number" id="qty-' + i + '" class="form-control mb-2" placeholder="Cantidad" min="1" max="' + product.stock + '"' + (agotado ? ' disabled' : '') + '>' +
            '<input type="checkbox" class="btn-check" id="chk-' + i + '" autocomplete="off"' + (agotado ? ' disabled' : '') + '>' +
            '<label class="btn btn-outline-primary mb-4" for="chk-' + i + '">' + (agotado ? 'Sin stock' : 'Agregar al carrito') + '</label>' +
            '<button class="btn btn-primary w-100 bg-1" onclick="addToCart(' + i + ')"' + (agotado ? ' disabled' : '') + '>Agregar</button>' +
            '</div>' +
            '</div>';
        productList.appendChild(productCard);
    }
}

// ==================== Filtrar productos ====================
function filtroProductos() {
    var input = document.getElementById('filtroProductos');
    if (!input) return;

    var aplicarFiltro = function () {
        var termino = input.value.trim().toLowerCase();

        if (termino === '') {
            renderProducts(catalogo);
            return;
        }

        var productosFiltrados = [];
        for (var i = 0; i < catalogo.length; i++) {
            var producto = catalogo[i];
            if (
                producto.title.toLowerCase().indexOf(termino) !== -1 ||
                producto.brand.toLowerCase().indexOf(termino) !== -1 ||
                producto.code.toLowerCase().indexOf(termino) !== -1 ||
                producto.description.toLowerCase().indexOf(termino) !== -1
            ) {
                productosFiltrados.push(producto);
            }
        }

        productList.innerHTML = '';
        if (productosFiltrados.length > 0) {
            renderProducts(productosFiltrados);
        } else {
            productList.innerHTML = '<div class="col text-center text-muted py-4">No se encontraron productos.</div>';
        }
    };
    input.addEventListener('input', aplicarFiltro);
}

// ==================== Agregar al carrito ====================
function addToCart(index) {
    var product = catalogo[index];
    var checkbox = document.getElementById('chk-' + index);
    var qtyInput = document.getElementById('qty-' + index);
    var quantity = parseInt(qtyInput.value, 10);

    if (!checkbox.checked || isNaN(quantity) || quantity <= 0) {
        alert('Selecciona una cantidad válida y marca el producto antes de agregar.');
        return;
    }
    if (quantity > product.stock) {
        alert('No hay suficiente stock disponible.');
        return;
    }

    var existingProduct = null;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].code === product.code) {
            existingProduct = cart[i];
            break;
        }
    }

    if (existingProduct) {
        if (existingProduct.quantity + quantity > product.stock) {
            alert('No puedes agregar más de lo disponible en stock.');
            return;
        }
        existingProduct.quantity += quantity;
    } else {
        var prodCopy = product.copiar();
        prodCopy.quantity = quantity;
        cart.push(prodCopy);
    }

    qtyInput.value = '';
    checkbox.checked = false;
    renderCart();
}

// ==================== Eliminar del carrito ====================
function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

// ==================== Modificar cantidad en carrito ====================
function updateCartQuantity(index, newQty) {
    var product = cart[index];
    var qty = parseInt(newQty, 10);

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

// ==================== Renderizar carrito ====================
function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>El carrito está vacío.</p>';
        cartSummary.innerHTML = '';
        return;
    }

    var tableHtml =
        '<table class="table table-striped">' +
        '<thead>' +
        '<tr>' +
        '<th>Nombre</th><th>Cantidad</th><th>Valor</th><th>Total</th><th>Acción</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';

    for (var i = 0; i < cart.length; i++) {
        var product = cart[i];
        tableHtml +=
            '<tr>' +
            '<td>' + product.title + '</td>' +
            '<td><input type="number" min="0" max="' + product.stock + '" value="' + product.quantity + '" onchange="updateCartQuantity(' + i + ', this.value)" class="form-control" style="width:80px"></td>' +
            '<td>' + product.price + '</td>' +
            '<td>' + product.getTotal().toLocaleString() + '</td>' +
            '<td><button class="btn btn-danger" onclick="removeFromCart(' + i + ')">Eliminar</button></td>' +
            '</tr>';
    }

    tableHtml += '</tbody></table>';

    tableHtml +=
        '<div class="text-end mt-3">' +
        '<button class="btn btn-danger" onclick="clearCart()">Vaciar carrito</button>' +
        '</div>';

    cartItems.innerHTML = tableHtml;
    calculateTotals();
}

// ==================== Vaciar carrito ====================
function clearCart() {
    if (cart.length === 0) {
        alert("El carrito ya está vacío.");
        return;
    }

    if (confirm("¿Seguro que quieres vaciar el carrito?")) {
        cart.length = 0;
        renderCart();
    }
}

// ==================== Calcular Totales ====================
function calculateTotals() {
    var neto = 0;
    for (var i = 0; i < cart.length; i++) {
        neto += cart[i].getTotal();
    }
    var iva = neto * 0.19;
    var total = neto + iva;
    var despacho = total > 100000 ? total * 0.05 : 0;
    total += despacho;

    cartSummary.innerHTML =
        '<p><strong>Valor neto:</strong> ' + neto.toLocaleString() + '.-</p>' +
        '<p><strong>IVA 19%:</strong> ' + iva.toLocaleString() + '.-</p>' +
        (despacho > 0 ? '<p><strong>Despacho:</strong> ' + despacho.toLocaleString() + '.-</p>' : '') +
        '<p><strong>Valor Total:</strong> ' + total.toLocaleString() + '.-</p>';
}

// ==================== Formulario: Generar boleta ====================
var formCompra = document.getElementById('formCompra');
if (formCompra) {
    formCompra.addEventListener('submit', function (e) {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Agrega productos antes de confirmar.');
            return;
        }

        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            for (var j = 0; j < catalogo.length; j++) {
                if (catalogo[j].code === item.code) {
                    catalogo[j].stock -= item.quantity;
                    if (catalogo[j].stock < 0) catalogo[j].stock = 0;
                    break;
                }
            }
        }
        renderProducts(catalogo);

        var htmlDetalle = '<h4>Detalle de Productos</h4><ul class="list-group">';
        var totalNeto = 0;

        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            var totalItem = item.getTotal();
            totalNeto += totalItem;
            htmlDetalle += '<li class="list-group-item">' + item.code + ' - ' + item.title + ': $' + item.price + ' x ' + item.quantity + ' = $' + totalItem + '</li>';
        }

        htmlDetalle += '</ul>';
        document.getElementById('detalleProductos').innerHTML = htmlDetalle;

        var impuesto = totalNeto * 0.19;
        var totalBruto = totalNeto + impuesto;

        document.getElementById('resumenCompra').innerHTML =
            '<h4>Resumen</h4>' +
            '<p><strong>Monto Neto:</strong> $' + totalNeto.toLocaleString() + '</p>' +
            '<p><strong>IVA (19%):</strong> $' + impuesto.toLocaleString() + '</p>' +
            '<p><strong>Total Bruto:</strong> $' + totalBruto.toLocaleString() + '</p>';

        var nombre = document.getElementById('nombre').value;
        var direccion = document.getElementById('direccion').value;
        var comuna = document.getElementById('comuna').value;
        var region = document.getElementById('region').value;
        var correo = document.getElementById('correo').value;

        document.getElementById('infoDespacho').innerHTML =
            '<h4>Datos del Despacho</h4>' +
            '<p><strong>Nombre:</strong> ' + nombre + '</p>' +
            '<p><strong>Dirección:</strong> ' + direccion + ', ' + comuna + ', ' + region + '</p>' +
            '<p><strong>Email:</strong> ' + correo + '</p>';

        document.getElementById('boleta').style.display = 'block';

        alert('Compra confirmada. Se enviará una copia de la boleta al correo.');
    });
}

// ==================== Inicialización ====================
cargarCatalogo(function () {
    renderProducts(catalogo);
    filtroProductos();
});
