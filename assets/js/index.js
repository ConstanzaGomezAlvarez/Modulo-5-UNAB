document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalCliente");
    const nombreCliente = document.getElementById("nombreCliente");
    const mensajeBienvenida = document.getElementById("mensajeBienvenida");
    const btnGuardar = document.getElementById("btnGuardarCliente");

    const nombre = localStorage.getItem("nombre");
    const apellido = localStorage.getItem("apellido");

    if (nombre && apellido) {
        nombreCliente.textContent = `${nombre} ${apellido}`;
        mensajeBienvenida.textContent = `¡Bienvenido/a ${nombre} ${apellido}!`;
        modal.classList.add("oculto");
    }

    btnGuardar.addEventListener("click", () => {
        const inputNombre = document.getElementById("inputNombre");
        const inputApellido = document.getElementById("inputApellido");

        const nombreInput = inputNombre.value.trim();
        const apellidoInput = inputApellido.value.trim();

        if (!nombreInput || !apellidoInput) {
            alert("Por favor complete ambos campos");
            return;
        }

        localStorage.setItem("nombre", nombreInput);
        localStorage.setItem("apellido", apellidoInput);

        nombreCliente.textContent = `Cliente: ${nombreInput} ${apellidoInput}`;
        mensajeBienvenida.textContent = `¡Bienvenido/a ${nombreInput} ${apellidoInput}!`;

        modal.classList.add("oculto");
    });
});
