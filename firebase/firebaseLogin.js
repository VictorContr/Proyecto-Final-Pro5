import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

export const login_vc_jc = document.getElementById("login");

export const toggleEye_vc_jc =() =>{
const togglePassword_vc_jc = document.getElementById('togglePassword');
const password_vc_jc = document.getElementById('clave');
togglePassword_vc_jc.addEventListener('click', ()=> {
    const type_vc_jc = password_vc_jc.getAttribute('type') === 'password' ? 'text' : 'password';
    password_vc_jc.setAttribute('type', type_vc_jc);
        // Cambiar el icono del ojo
    const eyeIcon_vc_jc = document.querySelector('svg');
    if (type_vc_jc === 'password') {
        eyeIcon_vc_jc.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />';
    } else {
        eyeIcon_vc_jc.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />';
    }
});
}

// Configuración de Firebase (compartida con register.js)
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

// Función para iniciar sesión
const iniciarSesion = async (correo, clave, modal_vc_jc) => {
  try {
    await signInWithEmailAndPassword(auth, correo, clave);
    modal_vc_jc.showSuccess_vc_jc("Éxito","Inicio de Sesión Exitoso");
    return true;
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    modal_vc_jc.showError_vc_jc("Error", "El correo o la  son incorrectos");
    return false;
  }
};

// Configurar el evento de login
export const configurarLogin_vc_jc = (modal_vc_jc) => {
  const formularioLogin = document.querySelector('form');
  
  if (!formularioLogin) return;

  formularioLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const correo = document.getElementById('correo').value.trim();
    const clave = document.getElementById('clave').value;

    const exito = await iniciarSesion(correo, clave, modal_vc_jc);
    
    if (exito) {
      formularioLogin.reset();
      setTimeout(() => {
        location.href = './lolo.html';
      }, 3000);
    } else {
      formularioLogin.reset();
    }
  });
};