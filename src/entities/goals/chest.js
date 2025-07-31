import { BolaAzul_vc_jc } from "../../blueball.js";
import { Global_vc_jc } from "../../global.js";
export class Cofre_vc_jc extends BolaAzul_vc_jc.Meta_vc_jc {
    Global_vc_jc = BolaAzul_vc_jc.Global_vc_jc;
    static CLOSED = 'closed';
    static OPENED = 'opened';
    static EMPTY = 'empty';

    constructor(game, x, y) {
        super(game, x, y, 'chestSprites', Cofre_vc_jc.CLOSED, {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.Cofre_vc_jc
        });

        this.esCofre_vc_jc = true;
        this.anchor.set(0.5, 0.33);
        
        // Ajustar altura y posición
        this.height = this.level.tileSize.height + this.level.cellSize.height;
        this.y_vc_jc -= this.level.cellSize.height;
    }

    get estaVacio_vc_jc() {
        return this.frameName === Cofre_vc_jc.EMPTY;
    }

    // Viene del metodo BolaAzul_vc_jc.Ayudante_vc_jc.abrirEntidad_vc_jc()
    abrir_vc_jc() {
        this.frameName = Cofre_vc_jc.OPENED;
    }

    obtenerPerla_vc_jc() {
        this.frameName = Cofre_vc_jc.EMPTY;
    }

    alEntrarJugador_vc_jc() {
        if (this.frameName === Cofre_vc_jc.OPENED) {
            this.obtenerPerla_vc_jc();
        }
    }
}

BolaAzul_vc_jc.Cofre_vc_jc = Cofre_vc_jc;