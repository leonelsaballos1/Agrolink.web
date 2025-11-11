  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCo9NUCzbSoGp1O2Vloh_qJt9Snu6FLaMc",
    authDomain: "cultigest-19dde.firebaseapp.com",
    projectId: "cultigest-19dde",
    storageBucket: "cultigest-19dde.appspot.com",
    messagingSenderId: "794697801536",
    appId: "1:794697801536:web:e54821715631a774e364a5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  //conexion con la base de datos
  const db = getFirestore(app)

  //guardado de datos
  export const GuardarSiembra = async (userId, Semilla, TipoSuelo, Area, fecha) => {
    // Verificar si ya existe una siembra idéntica para este usuario
    const q = query(
      collection(db, "Siembra"),
      where("userId", "==", userId),
      where("Semilla", "==", Semilla),
      where("TipoSuelo", "==", TipoSuelo),
      where("Area", "==", Area),
      where("fecha", "==", fecha)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log("Siembra idéntica ya existe para este usuario.");
      return { success: false, message: "Siembra idéntica ya existe para este usuario." };
    }

    await addDoc(collection(db, "Siembra"), { userId, Semilla, TipoSuelo, Area, fecha });
    return { success: true, message: "Siembra guardada exitosamente." };
  }

  export const GuardarSemilla = async (userId, Nombre, SueloRecomendado, EpocaRecomendada, TiempoCosecha, Fertilizante, Insecticida) => {
    // Verificar si ya existe una semilla idéntica para este usuario
    const q = query(
      collection(db, "Semilla"),
      where("userId", "==", userId),
      where("Nombre", "==", Nombre),
      where("SueloRecomendado", "==", SueloRecomendado),
      where("EpocaRecomendada", "==", EpocaRecomendada),
      where("TiempoCosecha", "==", TiempoCosecha),
      where("Fertilizante", "==", Fertilizante),
      where("Insecticida", "==", Insecticida)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log("Semilla idéntica ya existe para este usuario.");
      return { success: false, message: "Semilla idéntica ya existe para este usuario." };
    }

    await addDoc(collection(db, "Semilla"), { userId, Nombre, SueloRecomendado, EpocaRecomendada, TiempoCosecha, Fertilizante, Insecticida });
    return { success: true, message: "Semilla guardada exitosamente." };
  }

  export const GuardarSuelo = async (userId, TipoSuelo, color, PH) => {
    // Verificar si ya existe un suelo idéntico para este usuario
    const q = query(
      collection(db, "Suelo"),
      where("userId", "==", userId),
      where("TipoSuelo", "==", TipoSuelo),
      where("color", "==", color),
      where("PH", "==", PH)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log("Suelo idéntico ya existe para este usuario.");
      return { success: false, message: "Suelo idéntico ya existe para este usuario." };
    }

    await addDoc(collection(db, "Suelo"), { userId, TipoSuelo, color, PH });
    return { success: true, message: "Suelo guardado exitosamente." };
  }

  //obtener datos
  export const VerSiembras = ()=> getDocs(collection(db, 'Siembra'))

  export const  onGetSiembra = (callback) => onSnapshot(collection(db, 'Siembra', callback))