import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { 
  getAuth, fetchSignInMethodsForEmail, onAuthStateChanged, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { 
  getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Config Firebase
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

// Elementos DOM
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

// ================== Registro ==================
btnRegister.addEventListener("click", async () => {
  try {
    const metodos = await fetchSignInMethodsForEmail(auth, email.value);
    // Obtener nombre de usuario
    const nombre = document.getElementById("nombre").value.trim();
    if (!nombre) {
      alert("Debes ingresar un nombre de usuario.");
      return;
    }
    if (metodos.length > 0) {
      console.log("El correo ya está en uso");
      alert("Este correo ya está registrado. Intenta iniciar sesión.");
      return;
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    // Guardar el nombre en el perfil del usuario y esperar la actualización
    if (userCredential.user) {
      const { updateProfile } = await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js');
      await updateProfile(userCredential.user, { displayName: nombre });
      await auth.currentUser.reload();
    }
    console.log("Usuario registrado:", userCredential.user);
  } catch (error) {
    document.getElementById("error-message").textContent = "Error al registrar: " + error.message;
  }
});

// ================== Login ==================
btnLogin.addEventListener("click", async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log("Inicio de sesión exitoso:", userCredential.user);
  } catch (error) {
    const errorMessage = document.getElementById("error-message");
    if (error.code === "auth/wrong-password") {
      errorMessage.textContent = "Contraseña incorrecta.";
    } else if (error.code === "auth/user-not-found") {
      errorMessage.textContent = "Usuario no encontrado. Regístrate primero.";
    } else {
      errorMessage.textContent = "Error al iniciar sesión.";
    }
  }
});

// ================== Logout ==================
btnLogout.addEventListener("click", () => signOut(auth));

// ================== Agregar tarea ==================
btnAdd.addEventListener("click", async () => {
  if (inpNewTask.value.trim() === "") return alert("Escribe una tarea");
  const userId = auth.currentUser.uid;
  await addDoc(collection(db, "tasks"), {
    uid: userId,
    task: inpNewTask.value,
    completed: false
  });
  inpNewTask.value = "";
  getTasks();
});

// ================== Estado de usuario ==================
onAuthStateChanged(auth, (user) => {
  if (user) {
    login.classList.add("hidden");
    divApp.classList.remove("hidden");
    userInfo.textContent = `Hola ${user.displayName ? user.displayName : user.email}!`;
    // Verificar si el usuario tiene tareas, si no, cargar desde la API
    getTasks().then(async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const userTasks = [];
      querySnapshot.forEach((docSnap) => {
        if (docSnap.data().uid === auth.currentUser.uid) {
          userTasks.push(docSnap);
        }
      });
      if (userTasks.length === 0) {
        await loadInitialTasks();
      }
    });
  } else {
    login.classList.remove("hidden");
    divApp.classList.add("hidden");
    userInfo.innerHTML = "";
    divtask.innerHTML = "";
  }
});

// ================== Obtener tareas ==================
async function getTasks() {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  divtask.innerHTML = "";
  const tasks = [];

  querySnapshot.forEach((docSnap) => {
    if (docSnap.data().uid === auth.currentUser.uid) {
      tasks.push({ id: docSnap.id, ...docSnap.data() });
    }
  });

  tasks.forEach((t) => {
    divtask.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <input type="checkbox" class="form-check-input me-2 task-check" data-id="${t.id}" ${t.completed ? "checked" : ""}>
          <span class="${t.completed ? 'text-decoration-line-through' : ''}">${t.task}</span>
        </div>
        <div>
          <button class="btn btn-warning btn-sm me-2 btn-edit" data-id="${t.id}" data-task="${t.task}">Editar</button>
          <button class="btn btn-danger btn-sm btn-delete" data-id="${t.id}">X</button>
        </div>
      </li>`;
  });

  // Listeners: eliminar
  divtask.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', (e) => deleteTask(e.target.dataset.id));
  });

  // Listeners: editar
  divtask.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', async (e) => {
      const newTask = prompt("Editar tarea:", e.target.dataset.task);
      if (newTask) {
        await updateDoc(doc(db, "tasks", e.target.dataset.id), { task: newTask });
        getTasks();
      }
    });
  });

  // Listeners: marcar completada
  divtask.querySelectorAll('.task-check').forEach(checkbox => {
    checkbox.addEventListener('change', async (e) => {
      await updateDoc(doc(db, "tasks", e.target.dataset.id), { completed: e.target.checked });
      getTasks();
    });
  });

  // ================== Estadísticas ==================
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  document.getElementById("task-stats").textContent = `${completed} completadas de ${total} tareas`;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  document.getElementById("progress-bar").style.width = `${progress}%`;
  document.getElementById("progress-bar").textContent = `${progress}%`;
}

// ================== Eliminar tarea ==================
async function deleteTask(id) {
  await deleteDoc(doc(db, "tasks", id));
  getTasks();
}

// ================== Carga inicial de API ==================
async function loadInitialTasks() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=3");
  const tasks = await res.json();
  const userId = auth.currentUser.uid;
  for (let t of tasks) {
    await addDoc(collection(db, "tasks"), {
      uid: userId,
      task: t.title,
      completed: t.completed
    });
  }
  getTasks();
}
