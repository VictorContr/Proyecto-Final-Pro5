import { BolaAzul_vc_jc } from "../../blueball.js";
import { Meta_vc_jc } from "../goal.js";
export class Escaleras_vc_jc extends BolaAzul_vc_jc.Meta_vc_jc {
    constructor(game, x, y) {
        super(game, x, y, 'stairs', 0, {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.Escaleras_vc_jc
        });

        this.esSalida_vc_jc = true;
        this.estaAbierta_vc_jc = false;
    }

    get visible() {
        return this.estaAbierta_vc_jc;
    }
    
    // Viene del metodo BolaAzul_vc_jc.Ayudante_vc_jc.abrirEntidad_vc_jc()
    abrir_vc_jc() {
        this.estaAbierta_vc_jc = true;
    }

    alEntrarJugador_vc_jc() {
        if (this.estaAbierta_vc_jc) {
            this.level.catchExit();
        }
    }
}

BolaAzul_vc_jc.Escaleras_vc_jc = Escaleras_vc_jc;