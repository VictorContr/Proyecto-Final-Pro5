// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export const register_vc_jc = document.getElementById("register")
// Configuración de Firebase
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

// Funciones de validación
const correoValido = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
const claveValida = (clave) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(clave);

// Función para registrar usuario
const registrarUsuario = async (nombre, telefono, correo, clave, modal_vc_jc) => {
  try {
    const metodos = await fetchSignInMethodsForEmail(auth, correo);
    if (metodos.length > 0) {
      modal_vc_jc.showError_vc_jc("Error","Correo Repetido");
      return false;
    }

    const cred = await createUserWithEmailAndPassword(auth, correo, clave);
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nombre,
      telefono,
      correo,
      fechaRegistro: new Date()
    });

    modal_vc_jc.showSuccess_vc_jc("Exitoso","Registro Exitoso");
    return true;
    
  } catch (error) {
    const codigo = error.code;
    if (codigo === 'auth/email-already-in-use') {
      modal_vc_jc.showError_vc_jc("Error","Correo Repetido");
    } else if (codigo === 'auth/weak-password') {
      modal_vc_jc.showError_vc_jc("Error","Clave Invalida");
    } else if (codigo === 'auth/invalid-email') {
      modal_vc_jc.showError_vc_jc("Error","Correo Invalido");
    } else {
      console.error("Error al registrar:", error.message);
    }
    return false;
  }
};

// Configurar el evento de registro
export const configurarRegistro_vc_jc = (modal_vc_jc) => {
  const formularioRegister = document.querySelector('form');
  
  if (!formularioRegister) return;

  formularioRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('tlf').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const clave = document.getElementById('clave').value;
    const terminos = document.getElementById('terms').checked;

    // Validaciones
    if (!nombre || !telefono || !correo || !clave) {
      modal_vc_jc.showError_vc_jc("Error","Campos Vacios");
      return;
    }

    if (!correoValido(correo)) {
      modal_vc_jc.showError_vc_jc("Error","Correo Invalido");
      return;
    }

    if (!claveValida(clave)) {
      modal_vc_jc.showError_vc_jc("Error","Clave Invalida");
      return;
    }

    if (!terminos) {
      modal_vc_jc.showError_vc_jc("Error","Acepta los Términos");
      return;
    }

    // Intentar registro
    const exito = await registrarUsuario(nombre, telefono, correo, clave, modal_vc_jc);
    
    if (exito) {
      formularioRegister.reset();
      setTimeout(() => window.location.href = './login.html', 3000);
    } else {
      formularioRegister.reset();
    }
  });
};