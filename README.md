# Gestor de Tareas con Firebase

Aplicación web simple que permite a los usuarios **registrarse, iniciar sesión y gestionar una lista de tareas** usando **Firebase Authentication** y **Cloud Firestore**.

---

## 🚀 Instrucciones de ejecución

1. Clona o descarga este repositorio.
2. Abre la carpeta en tu editor (por ejemplo **VSCode**).
3. Instala la extensión **Live Server** o usa un servidor local:
   ```bash

##  Tecnologías utilizadas

- HTML5 y CSS3 (con Bootstrap 5 para estilos rápidos).
- JavaScript ES6+ (módulos).
- Firebase 12 SDK:
- Authentication (registro/login/logout).
- Firestore (CRUD de tareas + tiempo real con onSnapshot).

## Funcionalidades

- Registro y login de usuarios con Firebase Authentication.
- Manejo de errores en pantalla.
- Crear nuevas tareas asociadas al usuario autenticado.
- Listar tareas en tiempo real (solo las del usuario actual).
- Eliminar tareas individuales.
- Persistencia en Firestore con reglas de seguridad recomendadas.

  ## Estructura del proyecto
  📦Modulo 5 UNAB EvFinalM5
├── index.html                # Página principal de la aplicación
└── assets/                   # Recursos estáticos
    ├── css/                  # Estilos
    │   └── style.css         # Hoja de estilos principal
    └── js/                   # Lógica de la aplicación
        └── index.js          # Script principal con la lógica de Firebase y tareas
