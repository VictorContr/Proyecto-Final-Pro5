import { BolaAzul_vc_jc } from "../../blueball.js";
import { ProjectileMedusa } from "../projectiles/projectile-medusa.js";
import { Mobile } from "../mobile.js";
export class Medusa extends BolaAzul_vc_jc.Mobile {
    constructor(game, x, y) {
        // Validar instanciación
        if (!new.target) {
            throw new TypeError("Class constructor Medusa cannot be invoked without 'new'");
        }
        
        super(game, x, y, 'mobSprites', 'medusa1', {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.Medusa
        });

        // Estado inicial
        this.frameName = 'medusa1';
        this.playerTargeteableAt = null;
        this.projectile = null;

        // Validar existencia de level antes de suscribir eventos
        if (!this.level) {
            console.error("Medusa created without level reference");
            return;
        }
        
        this.level.onPhaseChanged.add(this.phaseChanged, this);
        this.level.onPlayerMoved.add(this.playerMoved, this);
    }

    playerMoved(player) {
        // Verificar que el jugador existe
        if (!player || !player.alive || !player.cellPosition) {
            this.frameName = 'medusa1';
            return;
        }
        
        const diffX = this.cellPosition.x - player.cellPosition.x;
        const diffY = this.cellPosition.y - player.cellPosition.y;

        this.frameName = (Math.abs(diffX) <= 1 || Math.abs(diffY) <= 1) ? 'medusa2' : 'medusa1';

        // Solo disparar si no hay proyectil activo
        if (this.projectile === null) {
            this.projectile = BolaAzul_vc_jc.ProjectileMedusa.shootTo(this, player);
        }
    }

    destroy() {
        // Desuscribir eventos
        if (this.level) {
            this.level.onPhaseChanged.remove(this.phaseChanged, this);
            this.level.onPlayerMoved.remove(this.playerMoved, this);
        }
        
        // Llamar al destroy del padre
        super.destroy(...arguments);
    }

    phaseChanged(currentPhase) {
        switch (currentPhase) {
            case BolaAzul_vc_jc.Level.PHASES.EXITS:
            case BolaAzul_vc_jc.Level.PHASES.ENDED:
                this.toDestroy = true;
                break;
        }
    }
}

BolaAzul_vc_jc.Medusa = Medusa;