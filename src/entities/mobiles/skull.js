import { BolaAzul_vc_jc } from "../../blueball.js";
import { Mobile } from "../mobile.js";
export class Skull extends BolaAzul_vc_jc.Mobile {
    static entitiesThatCollide = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsEntidades_vc_jc(
        'Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leeper', 
        'Medusa', 'Rocky', 'Skull', 'Snakey', 'Cofre_vc_jc', 
        'PuertaCerrada_vc_jc', 'PuertaAbierta_vc_jc', 'Heart'
    );

    constructor(game, x, y) {
        // Validar instanciación
        if (!new.target) throw new TypeError("Class constructor Skull cannot be invoked without 'new'");
        
        super(game, x, y, 'mobSprites', 'skullDown1', {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.Skull
        });

        // Animaciones
        this.animations.add('Top', Phaser.Animation.generateFrameNames('skullUp', 1, 2, '', 1), 5, true);
        this.animations.add('Right', Phaser.Animation.generateFrameNames('skullRight', 1, 2, '', 1), 5, true);
        this.animations.add('Down', Phaser.Animation.generateFrameNames('skullDown', 1, 2, '', 1), 5, true);
        this.animations.add('Left', Phaser.Animation.generateFrameNames('skullLeft', 1, 2, '', 1), 5, true);

        // Estado inicial
        this.lastDirection = null;
        this.isAwaken = false;
        
        // Validar existencia de level antes de suscribir eventos
        if (!this.level) {
            console.error("Skull created without level reference");
            return;
        }
        
        this.level.onPhaseChanged.add(this.phaseChanged, this);
    }

    get lookingAt() {
        return this._lookingAt;
    }

    set lookingAt(value) {
        this._lookingAt = value;
        this.lastDirection = value;
    }

    performMovement(playerPosition) {
        if (!playerPosition || !this.level?.player) return;
        
        const turnback = (this.lastDirection + 2) % 4;
        const { principal, secondary } = playerPosition;

        if (this.canMoveTo(principal) && principal !== turnback) {
            this.lastDirection = principal;
            this.moveTo(principal);
            return;
        }

        if (this.canMoveTo(secondary) && secondary !== turnback) {
            this.lastDirection = secondary;
            this.moveTo(secondary);
            return;
        }

        if (this.canMoveTo(this.lastDirection)) {
            this.moveTo(this.lastDirection);
            return;
        }

        let thirdDirection = 6 - (principal + secondary);
        if ([principal, secondary].includes(this.lastDirection)) {
            thirdDirection -= turnback;
        } else {
            thirdDirection -= this.lastDirection;
        }

        this.lastDirection = this.canMoveTo(thirdDirection) ? thirdDirection : turnback;
        this.moveTo(this.lastDirection);
    }

    nextAction() {
        if (!this.isAwaken || !this.alive || !this.level?.player) return;
        
        const directionToPlayer = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerDireccionHacia_vc_jc(this, this.level.player);
        const touchStatus = this.canTouch(this.level.player);
        
        if (touchStatus > 0 && this.canMoveTo(directionToPlayer?.principal)) {
            this.level.player.die?.();
        } else {
            this.lastDirection = this.lastDirection || directionToPlayer?.principal;
            if (this.lastDirection !== null) {
                this.performMovement(directionToPlayer);
            }
        }
    }

    destroy() {
        if (this.level) {
            this.level.onPhaseChanged.remove(this.phaseChanged, this);
        }
        super.destroy(...arguments);
    }

    respawn() {
        super.respawn(...arguments);
        this.lastDirection = this.lookingAt;
    }

    phaseChanged(currentPhase) {
        switch (currentPhase) {
            case BolaAzul_vc_jc.Level.PHASES.PEARLS:
                this.isAwaken = true;
                break;
            case BolaAzul_vc_jc.Level.PHASES.EXITS:
            case BolaAzul_vc_jc.Level.PHASES.ENDED:
                this.toDestroy = true;
                break;
        }
    }
}

BolaAzul_vc_jc.Skull = Skull;