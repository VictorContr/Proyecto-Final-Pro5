import { BolaAzul_vc_jc } from "../../blueball.js";
import { Global_vc_jc } from "../../global.js";
import { Meta_vc_jc } from "../goal.js";
export class PuertaCerrada_vc_jc extends BolaAzul_vc_jc.Meta_vc_jc {
    Global_vc_jc = BolaAzul_vc_jc.Global_vc_jc;
    constructor(game, x, y) {
        super(game, x, y, 'tileSprites', 'doorClosed', {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.PuertaCerrada_vc_jc
        });

        this.esSalida_vc_jc = true;
    }
    
    // Viene del metodo BolaAzul_vc_jc.Ayudante_vc_jc.abrirEntidad_vc_jc()
    abrir_vc_jc() {
        this.toDestroy = true;
        
        // Crear nueva puerta abierta en la posición actual
        const puertaAbierta_vc_jc = new BolaAzul_vc_jc.PuertaAbierta_vc_jc(
            this.game, 
            this.cellPosition.x, 
            this.cellPosition.y, 
            'tileSprites', 
            'doorOpened'
        );
        
        // Añadir nueva puerta en el índice de posición del jugador
        const indiceJugador_vc_jc = this.level.entities.getChildIndex(this.level.player);
        this.level.entities.addAt(puertaAbierta_vc_jc, indiceJugador_vc_jc, true);
    }
}

BolaAzul_vc_jc.PuertaCerrada_vc_jc = PuertaCerrada_vc_jc;