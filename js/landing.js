import { ModalDialog_vc_jc } from "./modal.js";

const modal_vc_jc = new ModalDialog_vc_jc();
export const landing_vc_jc = document.getElementById("landing");
// Función para la animación del juego
export const animateLolo_vc_jc=()=> {
    const lolo_vc_jc = document.querySelector('.lolo');
    let pos_vc_jc = 1;
    
    setInterval(() => {
        lolo_vc_jc.parentElement.classList.remove('lolo');
        const cells_vc_jc = document.querySelectorAll('.game-cell:not(.wall)');
        
        // Move to a new random position
        let newPos_vc_jc;
        do {
            newPos_vc_jc = Math.floor(Math.random() * cells_vc_jc.length);
        } while (cells_vc_jc[newPos_vc_jc].classList.contains('wall') || cells_vc_jc[newPos_vc_jc].classList.contains('enemy'));
        
        cells_vc_jc[newPos_vc_jc].classList.add('lolo');
        pos_vc_jc = newPos_vc_jc;
    }, 3000);
}


// Función para manejar el menú móvil
export const setupMobileMenu_vc_jc=()=> {
    const menuToggle_vc_jc = document.getElementById('menu-toggle');
    const mobileMenu_vc_jc = document.getElementById('mobile-menu');
    const hamburger_vc_jc = document.querySelector('.hamburger');
    
    // Función para alternar el menú
    const toggleMenu_vc_jc=()=> {
        mobileMenu_vc_jc.classList.toggle('open');
        hamburger_vc_jc.classList.toggle('active');
        
        // Desplazar al menú si está abierto
        if (mobileMenu_vc_jc.classList.contains('open')) {
            mobileMenu_vc_jc.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // Función para cerrar el menú
    const closeMenu_vc_jc=()=> {
        mobileMenu_vc_jc.classList.remove('open');
        hamburger_vc_jc.classList.remove('active');
    }

    menuToggle_vc_jc.addEventListener('click', toggleMenu_vc_jc);
    // Cerrar menú al hacer clic en un enlace
    const menuLinks_vc_jc = document.querySelectorAll('#mobile-menu a');
    menuLinks_vc_jc.forEach(link_vc_jc => {
        link_vc_jc.addEventListener('click', closeMenu_vc_jc);
    });

}

export const cargarTestimonios_vc_jc = async () => {
  const contenedor_vc_jc = document.getElementById('testimonios-contenedor_vc_jc');
  contenedor_vc_jc.innerHTML = '';

  // Fetch de 3 tareas como placeholder
  const todosRes_vc_jc = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=3');
  const todos_vc_jc = await todosRes_vc_jc.json();

  // Fetch de todos los usuarios
  const usersRes_vc_jc = await fetch('https://jsonplaceholder.typicode.com/users');
  const users_vc_jc = await usersRes_vc_jc.json();

  // Selección de N usuarios aleatorios
  const obtenerUsuariosAleatorios_vc_jc = (lista_vc_jc, n_vc_jc) => {
    const copia_vc_jc = [...lista_vc_jc];
    const seleccionados_vc_jc = [];
    for (let i_vc_jc = 0; i_vc_jc < n_vc_jc; i_vc_jc++) {
      const idx_vc_jc = Math.floor(Math.random() * copia_vc_jc.length);
      seleccionados_vc_jc.push(copia_vc_jc.splice(idx_vc_jc, 1)[0]);
    }
    return seleccionados_vc_jc;
  };
  const usuariosAleatorios_vc_jc = obtenerUsuariosAleatorios_vc_jc(users_vc_jc, 3);

  // Pool de testimonios
  const testimoniosPool_vc_jc = [
    "¡Me ha devuelto la nostalgia de NES directamente al navegador!",
    "Los puzzles son adictivos y la interfaz es impecable.",
    "¡Genial que guarde mi progreso en la nube!",
    "La estética pixel y los controles responden de lujo.",
    "Revivir Adventures of Lolo nunca fue tan fácil."
  ];
  const obtenerTestimoniosAleatorios_vc_jc = (n_vc_jc) => {
    const copiaTest_vc_jc = [...testimoniosPool_vc_jc];
    const seleccion_vc_jc = [];
    for (let i_vc_jc = 0; i_vc_jc < n_vc_jc; i_vc_jc++) {
      const idxTest_vc_jc = Math.floor(Math.random() * copiaTest_vc_jc.length);
      seleccion_vc_jc.push(copiaTest_vc_jc.splice(idxTest_vc_jc, 1)[0]);
    }
    return seleccion_vc_jc;
  };
  const textos_vc_jc = obtenerTestimoniosAleatorios_vc_jc(3);

  usuariosAleatorios_vc_jc.forEach((user_vc_jc, i_vc_jc) => {
    const avatar_vc_jc = `https://i.pravatar.cc/150?img=${user_vc_jc.id}`;
    const card_vc_jc = document.createElement('div');
    card_vc_jc.className = 'bg-ge-gray bg-opacity-20 p-6 rounded-2xl shadow-ge flex flex-col items-center text-center';
    card_vc_jc.innerHTML = `
      <img src="${avatar_vc_jc}" alt="Avatar de ${user_vc_jc.name}"
           class="w-24 h-24 rounded-full mb-4 border-4 border-ge-pink shadow-ge object-cover">
      <p class="font-courier italic text-white mb-4">"${textos_vc_jc[i_vc_jc]}"</p>
      <h3 class="font-press-start text-ge-yellow mb-1">${user_vc_jc.name}</h3>
      <p class="font-vt323 text-ge-blue text-sm">${user_vc_jc.company.name}</p>
    `;
    contenedor_vc_jc.appendChild(card_vc_jc);
  });
};

export const setupFormSubmission_vc_jc = (options_vc_jc = {}) => {
    const {
        formId: formId_vc_jc = 'contactForm',
        submitBtnSelector: submitBtnSelector_vc_jc = 'button[type="submit"]',
        actionUrl: actionUrl_vc_jc = 'php/contact.php',
        spinnerHtml: spinnerHtml_vc_jc = '<span class="animate-spin">⏳</span> Enviando...',
        resetOnSuccess: resetOnSuccess_vc_jc = true,
        successTitle: successTitle_vc_jc = 'Éxito',
        errorTitle: errorTitle_vc_jc = 'Error'
    } = options_vc_jc;

    const form_vc_jc = document.getElementById(formId_vc_jc);
    if (!form_vc_jc) return;


    form_vc_jc.addEventListener('submit', async (e_vc_jc) => {
        e_vc_jc.preventDefault();

        const submitBtn_vc_jc = form_vc_jc.querySelector(submitBtnSelector_vc_jc);
        if (!submitBtn_vc_jc) return;

        const originalBtnText_vc_jc = submitBtn_vc_jc.innerHTML;
        submitBtn_vc_jc.disabled = true;
        submitBtn_vc_jc.innerHTML = spinnerHtml_vc_jc;

        try {
            const response_vc_jc = await fetch(actionUrl_vc_jc, {
                method: 'POST',
                body: new FormData(form_vc_jc)
            });

            if (!response_vc_jc.ok) {
                throw new Error(`HTTP error! status: ${response_vc_jc.status}`);
            }

            const result_vc_jc = await response_vc_jc.json();
            if (result_vc_jc.success) {
              console.log("succes")
                modal_vc_jc.showSuccess_vc_jc(successTitle_vc_jc, result_vc_jc.message);
                if (resetOnSuccess_vc_jc) form_vc_jc.reset();
            } else {
                modal_vc_jc.showError_vc_jc(errorTitle_vc_jc + result_vc_jc.message);
            }
        } catch (error_vc_jc) {
            console.error('Error:', error_vc_jc);
            modal_vc_jc.showError_vc_jc(errorTitle_vc_jc, 'Error de conexión. Intenta de nuevo.');
        } finally {
            submitBtn_vc_jc.disabled = false;
            submitBtn_vc_jc.innerHTML = originalBtnText_vc_jc;
        }
    });
};

        // Función para mostrar el mapa con un pin
export const mostrarMapaConPin_vc_ga = (latitud, longitud, popupTexto = "¡Ubicación!")=> {
    // 1. Crear mapa
    const mapa_vc_ga = L.map('map').setView([latitud, longitud], 15);
    
    // 2. Añadir capa de OpenStreetMap (OBLIGATORIO: incluir atribución)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa_vc_ga);

    // 3. Añadir marcador (pin)
    L.marker([latitud, longitud])
        .addTo(mapa_vc_ga)
        .bindPopup(popupTexto)
        .openPopup(); 
  }