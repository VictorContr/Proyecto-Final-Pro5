import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export const loloHTML_vc_jc = document.getElementById("loloHTML");
// Configuración compartida
const firebaseConfig = {
  apiKey: "AIzaSyAy3cfWU67kHJPztxUCRsycWqGeCSu4GaI",
  authDomain: "login-progv-proyecto-jc-vc.firebaseapp.com",
  projectId: "login-progv-proyecto-jc-vc",
  storageBucket: "login-progv-proyecto-jc-vc.appspot.com",
  messagingSenderId: "719108033580",
  appId: "1:719108033580:web:2bb76b1e1004c5a5789589"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Función para cargar datos del usuario
const cargarDatosUsuario = async (usuario, modal_vc_jc) => {
  try {
    const docRef = doc(db, "usuarios", usuario.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("No se encontró documento del usuario");
      return null;
    }

    return docSnap.data();
  } catch (error) {
    console.error("Error obteniendo datos:", error);
    modal_vc_jc.showError_vc_jc("Error","Error al Cargar los Datos");
    return null;
  }
};

// Función para manejar el estado de autenticación
const configurarAuthState = (modal_vc_jc, elementosUI) => {
  let estaCerrandoSesion = false;

  onAuthStateChanged(auth, async (usuario) => {
    if (estaCerrandoSesion) return;

    if (!usuario) {
      location.replace('./login.html');
      return;
    }

    const datosUsuario = await cargarDatosUsuario(usuario, modal_vc_jc);
    if (!datosUsuario) return;

    // Actualizar UI
    if (elementosUI.nombrePerfil) elementosUI.nombrePerfil.textContent = datosUsuario.nombre;
    if (elementosUI.correoPerfil) elementosUI.correoPerfil.textContent = datosUsuario.correo;
    if (elementosUI.nombreUsuario) elementosUI.nombreUsuario.textContent = datosUsuario.nombre;
    if (elementosUI.correoUsuario) elementosUI.correoUsuario.textContent = datosUsuario.correo;
    if (elementosUI.telefonoUsuario) elementosUI.telefonoUsuario.textContent = datosUsuario.telefono;
    if (elementosUI.fechaRegistro) elementosUI.fechaRegistro.textContent = datosUsuario.fechaRegistro?.toDate?.().toLocaleDateString() || datosUsuario.fechaRegistro;
  });

  return {
    setCerrandoSesion: (valor) => { estaCerrandoSesion = valor; }
  };
};

// Función para configurar el cierre de sesión
export const configurarCerrarSesion_vc_jc = (modal_vc_jc) => {
  const botonCerrarSesion = document.getElementById('cerrarSesion');
  if (!botonCerrarSesion) return;

  const authState = configurarAuthState(modal_vc_jc, {
    nombrePerfil: document.getElementById('nombrePerfil'),
    correoPerfil: document.getElementById('correoPerfil'),
    nombreUsuario: document.getElementById('nombreUsuario'),
    correoUsuario: document.getElementById('correoUsuario'),
    telefonoUsuario: document.getElementById('telefonoUsuario'),
    fechaRegistro: document.getElementById('fechaRegistro')
  });

  botonCerrarSesion.addEventListener('click', async () => {
    try {
      authState.setCerrandoSesion(true);
      await signOut(auth);
      modal_vc_jc.showSuccess_vc_jc("Se cerro la Sesión Correctamente", "Hasta Luego");
      setTimeout(() => location.replace('index.html'), 3000);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      modal_vc_jc.showError_vc_jc("Error","Error al Cerrar Sesión");
    }
  });
};