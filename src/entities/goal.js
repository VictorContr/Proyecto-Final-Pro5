import { BolaAzul_vc_jc } from "../blueball.js";
import { Entity } from "./entity.js";
export class Meta_vc_jc extends BolaAzul_vc_jc.Entity {
    constructor(game, x, y, key, frame, options) {
        super(game, x, y, key, frame, options);
        this.level.onPlayerMoved.add(this.verificarPosicionJugador, this);
    }

    verificarPosicionJugador(jugador) {
        if (this.cellPosition.x === jugador.cellPosition.x &&
            this.cellPosition.y === jugador.cellPosition.y) {
            this.alEntrarJugador_vc_jc(jugador);
        }
    }

    alEntrarJugador_vc_jc(jugador) {
        // Para implementar en las subclases
    }

    destruir() {
        this.level.onPlayerMoved.remove(this.verificarPosicionJugador, this);
        super.destroy(...arguments);
    }
}

BolaAzul_vc_jc.Meta_vc_jc = Meta_vc_jc;
