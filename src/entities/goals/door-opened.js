import { BolaAzul_vc_jc } from "../../blueball.js";
import { Meta_vc_jc } from "../goal.js";
export class PuertaAbierta_vc_jc extends BolaAzul_vc_jc.Meta_vc_jc {
    Global_vc_jc = BolaAzul_vc_jc.Global_vc_jc;
    constructor(game, x, y) {
        super(game, x, y, 'tileSprites', 'doorOpened', {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.PuertaAbierta_vc_jc
        });

        this.esSalida_vc_jc = true;
    }

    alEntrarJugador_vc_jc() {
        if (this.gid === BolaAzul_vc_jc.Global_vc_jc.Entities.PuertaAbierta_vc_jc) {
            this.level.catchExit();
        }
    }
    
    // Viene del metodo BolaAzul_vc_jc.Ayudante_vc_jc.abrirEntidad_vc_jc()
    abrir_vc_jc() {
        // Implementación vacía como se requiere
    }
}

BolaAzul_vc_jc.PuertaAbierta_vc_jc = PuertaAbierta_vc_jc;