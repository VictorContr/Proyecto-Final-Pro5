import { BolaAzul_vc_jc } from "../../blueball.js";
import { Mobile } from "../mobile.js";
export class Snakey extends BolaAzul_vc_jc.Mobile {
    constructor(game, x, y) {
        // Asegurar instanciación correcta
        if (!new.target) throw new TypeError("Class constructor Snakey cannot be invoked without 'new'");
        
        super(game, x, y, 'mobSprites', 'snakey4', {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.Snakey
        });

        // Validar existencia de level antes de suscribir eventos
        if (!this.level) {
            console.error("Snakey created without level reference");
            return;
        }

        this.level.onPhaseChanged.add(this.phaseChanged, this);
        this.level.onPlayerMoved.add(this.lookAt, this);
    }

    lookAt(player) {
        if (!player || !player.cellPosition) return;
        
        const diffX = this.cellPosition.x - player.cellPosition.x;
        const diffY = this.cellPosition.y - player.cellPosition.y;

        if (diffY >= 0) {
            this.frameName = (diffX >= 0) ? 'snakey1' : 'snakey6';
        } 
        else if (diffX < 0) {
            this.frameName = (diffX < diffY) ? 'snakey5' : 'snakey4';
        } 
        else {
            this.frameName = (diffX > -diffY) ? 'snakey2' : 'snakey3';
        }
    }

    destroy() {
        // Limpieza segura de eventos
        if (this.level) {
            this.level.onPhaseChanged.remove(this.phaseChanged, this);
            this.level.onPlayerMoved.remove(this.lookAt, this);
        }
        
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

BolaAzul_vc_jc.Snakey = Snakey;