// Importar funciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCgRip-vOzkAVB9l4w-hoIZcm_zr3mAGaw",
    authDomain: "agriges-432cb.firebaseapp.com",
    databaseURL: "https://agriges-432cb-default-rtdb.firebaseio.com",
    projectId: "agriges-432cb",
    storageBucket: "agriges-432cb.appspot.com",
    messagingSenderId: "397829479377",
    appId: "1:397829479377:web:7a0b3181be45b603fb9ef0",
    measurementId: "G-XQ5BDMQ5GG"
  };
  
// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Obtener elementos del DOM
let Nuser = document.getElementById('username');
let registerEmail = document.getElementById('email');
let registerPassword = document.getElementById('password');
let registerForm = document.getElementById('formRegister');

// Función para registrar un usuario
const RegisterUser = async (e) => {
    e.preventDefault();

    // Limpiar errores anteriores
    document.getElementById('username-error').textContent = "";
    document.getElementById('email-error').textContent = "";
    document.getElementById('password-error').textContent = "";

    try {
        // Verificar si el nombre de usuario ya existe
        const usernameQuery = query(collection(db, 'users'), where('firstname', '==', Nuser.value));
        const usernameSnapshot = await getDocs(usernameQuery);

        if (!usernameSnapshot.empty) {
            document.getElementById('username-error').textContent = "Este nombre de usuario ya está en uso.";
            return; // Detener el registro
        }

        const credentials = await createUserWithEmailAndPassword(auth, registerEmail.value, registerPassword.value);

        // Agregar el usuario a Firestore
        await addDoc(collection(db, 'users'), {
            uid: credentials.user.uid,
            firstname: Nuser.value,
            email: registerEmail.value // Guardar también el email
        });

        console.log(credentials);
        // Reiniciar el formulario después del registro exitoso
        registerForm.reset();
        alert('¡Registro exitoso!');

    } catch (error) {
        // Manejo de errores en la interfaz de usuario
        if (error.code === 'auth/invalid-email') {
            document.getElementById('email-error').textContent = "Correo electrónico no válido.";
        } else if (error.code === 'auth/weak-password') {
            document.getElementById('password-error').textContent = "La contraseña debe tener al menos 6 caracteres.";
        } else if (error.code === 'auth/email-already-in-use') {
            document.getElementById('email-error').textContent = "Este correo electrónico ya está registrado.";
        } else {
            alert(error.message); // Manejo de otros errores
        }
    }
};

// Evento de envío del formulario de registro
registerForm.addEventListener('submit', RegisterUser);

// Elementos del formulario de inicio de sesión
let emailLogin = document.getElementById('emailLogin');
let passwordLogin = document.getElementById('passwordLogin');
let FormLogin = document.getElementById('loginForm');

// Función para iniciar sesión
const LoginUser = async (e) => {
    e.preventDefault();
    try {
        const credentials = await signInWithEmailAndPassword(auth, emailLogin.value, passwordLogin.value);

        // Consultar Firestore para obtener los datos del usuario
        const userQuery = query(collection(db, 'users'), where('uid', '==', credentials.user.uid));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            console.log('Todo bien');

            // Guardar datos en sessionStorage
            sessionStorage.setItem('info-user', JSON.stringify({ firstname: userData.firstname }));
            sessionStorage.setItem('user-credential', JSON.stringify(credentials.user));

            // Redirigir a la página si las credenciales son correctas
            if (credentials.user.email === 'leonelsaballos459@gmail.com') {
                window.location.href = './administrador.html'; // Redirigir al administrador
            } else {
                window.location.href = './panel_agricola.html'; // Redirigir a la página normal del panel
            }
            console.log('Redirigiendo página...');
        }
    } catch (error) {
        alert(error.message);
    }
};

// Evento de envío del formulario de inicio de sesión
FormLogin.addEventListener('submit', LoginUser);

// Función para iniciar sesión con Google
const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Agregar el usuario a Firestore si es nuevo
        const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
            // Agregar nuevo usuario a Firestore
            await addDoc(collection(db, 'users'), {
                uid: user.uid,
                firstname: user.displayName // Nombre del usuario de Google
            });
        }

        console.log('Usuario autenticado con Google:', user);
        // Guardar datos en sessionStorage
        sessionStorage.setItem('info-user', JSON.stringify({ firstname: user.displayName }));
        sessionStorage.setItem('user-credential', JSON.stringify(user));

        // Redirigir a la página después de iniciar sesión
        if (user.email === 'leonelsaballos459@gmail.com') {
            window.location.href = './administrador.html'; // Redirigir al administrador
        } else {
            window.location.href = './panel_agricola.html'; // Redirigir a la página normal del panel
        }
        console.log('Redirigiendo página...');
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
        alert(error.message);
    }
};

// Asignar el evento de clic al enlace de Google en el registro
document.getElementById('googleLogin').addEventListener('click', (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del enlace
    signInWithGoogle();
});

// Asignar el evento de clic al enlace de Google en el inicio de sesión
document.getElementById('googleLoginLogin').addEventListener('click', (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del enlace
    signInWithGoogle();
});
