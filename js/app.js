import { configurarCerrarSesion_vc_jc, loloHTML_vc_jc } from "../firebase/firebaseCerrarSesion.js";
import { configurarLogin_vc_jc, login_vc_jc, toggleEye_vc_jc } from "../firebase/firebaseLogin.js";
import { configurarRegistro_vc_jc, register_vc_jc } from "../firebase/firebaseRegister.js";
import { animateLolo_vc_jc, cargarTestimonios_vc_jc, landing_vc_jc, mostrarMapaConPin_vc_ga, setupFormSubmission_vc_jc, setupMobileMenu_vc_jc } from "./landing.js";
import { ModalDialog_vc_jc } from "./modal.js";
import { BolaAzul_vc_jc, gameHTML_vc_ga } from "../src/blueball.js";
import { Global_vc_jc } from "../src/global.js";
import { Configurar_vc_jc } from "../src/config.js";
import { Entity } from "../src/entities/entity.js";
import { Meta_vc_jc } from "../src/entities/goal.js";
import { Mobile } from "../src/entities/mobile.js";
import { Boot } from "../src/core/boot.js";
import { Loader } from "../src/core/loader.js";
import { Menu } from "../src/core/menu.js";
import { Level } from "../src/core/level.js";
export const modal_vc_jc = new ModalDialog_vc_jc();
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'ge-blue': '#1E90FF',
            'ge-pink': '#FF69B4',
            'ge-green': '#2ECC71',
            'ge-gray': '#555555',
            'ge-yellow': '#F1C40F',
            'ge-dark': '#222222'
          },
          fontFamily: {
            'press-start': ['"Press Start 2P"', 'cursive'],
            'vt323': ['VT323', 'monospace'],
            'courier': ['Courier Prime', 'monospace']
          },
          boxShadow: {
            'ge': '4px 4px 0px rgba(0,0,0,0.3)',
          }
        }
      }
    }
    if (landing_vc_jc) {
      animateLolo_vc_jc();
      setupMobileMenu_vc_jc();
      cargarTestimonios_vc_jc();
      setupFormSubmission_vc_jc({
        modalInstance: modal_vc_jc
      });
      mostrarMapaConPin_vc_ga(10.488658, -66.815661, "¡Game Enjoyers.Co!");

    }
    if (login_vc_jc) {
      toggleEye_vc_jc();
      configurarLogin_vc_jc(modal_vc_jc);
    }
    if (register_vc_jc) {
      toggleEye_vc_jc();
      configurarRegistro_vc_jc(modal_vc_jc);
    }

    if (loloHTML_vc_jc) {
        configurarCerrarSesion_vc_jc(modal_vc_jc);
    }
    if (gameHTML_vc_ga) {
      
      BolaAzul_vc_jc.Boot = BolaAzul_vc_jc.Boot || class {};
      BolaAzul_vc_jc.Loader = BolaAzul_vc_jc.Loader || class {};
      BolaAzul_vc_jc.Menu = BolaAzul_vc_jc.Menu || class {};
      BolaAzul_vc_jc.Level = BolaAzul_vc_jc.Level || class {};
      BolaAzul_vc_jc.Global_vc_jc = BolaAzul_vc_jc.Global_vc_jc || { Tiles: {}, Entities: {} };
      BolaAzul_vc_jc.Configurar_vc_jc = BolaAzul_vc_jc.Configurar_vc_jc || { world: { levels: [] } }
      
      window.addEventListener('load', function () {
          BolaAzul_vc_jc.iniciar_vc_jc();
      });
    }