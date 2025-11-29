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


// Asignar el evento de clic al enlace de Google en el inicio de sesión
document.getElementById('googleLoginLogin').addEventListener('click', (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del enlace
    signInWithGoogle();
});
