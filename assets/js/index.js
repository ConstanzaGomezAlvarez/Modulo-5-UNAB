import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, fetchSignInMethodsForEmail, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBPvVZvvoiu20RN4HNkcCutXVTZVrVwDAU",
    authDomain: "firexample-e4b3f.firebaseapp.com",
    projectId: "firexample-e4b3f",
    storageBucket: "firexample-e4b3f.firebasestorage.app",
    messagingSenderId: "604008310768",
    appId: "1:604008310768:web:63fbc2e46e816da41cdf35"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const login = document.getElementById("login");
const email = document.getElementById("email");
const password = document.getElementById("password");

const btnLogin = document.getElementById("btn-login");
const btnRegister = document.getElementById("btn-register");
const btnLogout = document.getElementById("btn-logout");

const divApp = document.getElementById("app");
const userInfo = document.getElementById("user-info");
const inpNewTask = document.getElementById("new-task");
const btnAdd = document.getElementById("btn-add");
const divtask = document.getElementById("task");

btnRegister.addEventListener("click", async () => {
    try {
        //  Verificar si el correo ya está registrado
        const metodos = await fetchSignInMethodsForEmail(auth, email.value);

        if (metodos.length > 0) {
            console.log("El correo ya está en uso");
            alert("Este correo ya está registrado. Intenta iniciar sesión.");
            return;
        }

        //  Si no está registrado, crear la cuenta
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        console.log("Usuario registrado:", userCredential.user);

    } catch (error) {
        const errorMessage = document.getElementById("error-message");
        errorMessage.classList.add("text-danger");
        errorMessage.textContent = "Usuario ya registrado! Intenta iniciar sesión.";
    }
});

btnLogin.addEventListener("click", async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log("Inicio de sesión exitoso:", userCredential.user);
    } catch (error) {
        const errorMessage = document.getElementById("error-message");
        errorMessage.classList.add("text-danger");

        if (error.code === "auth/wrong-password") {
            errorMessage.textContent = "Contraseña incorrecta. Intenta nuevamente.";
        } else if (error.code === "auth/user-not-found") {
            errorMessage.textContent = "Usuario no encontrado. Regístrate primero.";
        } else {
            errorMessage.textContent = "Error al iniciar sesión. Revisa tus credenciales.";
        }
    }
});

btnLogout.addEventListener("click", () => {
    signOut(auth)
});

btnAdd.addEventListener("click", async () => {
    const userId = auth.currentUser.uid;
    const docRef = await addDoc(collection(db, "tasks"), {
        uid: userId,
        task: inpNewTask.value
    });
    inpNewTask.value = "";
    alert("Tarea agregada con el id: " + docRef.id);
    getTasks();
});

onAuthStateChanged(auth, (user => {
    if (user) {
        login.classList.add("hidden");
        divApp.classList.remove("hidden");
        userInfo.textContent = `Hola ${user.email} tu uid es ${user.uid}`;
        getTasks();
    } else {
        login.classList.remove("hidden");
        divApp.classList.add("hidden");
        userInfo.innerHTML = "";
        divtask.innerHTML = "";
    }
}
));

async function getTasks() {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    divtask.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const userId = auth.currentUser.uid;
        if (doc.data().uid === userId) {
            divtask.innerHTML += `<div class="list-group-item d-flex justify-content-between align-items-center">${doc.data().task} <button class="btn btn-danger btn-sm" data-id="${doc.id}">X</button></div>`;
        }
    });
    // Agregar event listeners para los botones de eliminar
    divtask.querySelectorAll('.btn-danger').forEach(button => {
        button.addEventListener('click', (e) => {
            const taskId = e.target.dataset.id;
            deleteTask(taskId);
        });
    });
}

async function deleteTask(id) {
    await deleteDoc(doc(db, "tasks", id));
    alert("Tarea eliminada");
    getTasks();
}