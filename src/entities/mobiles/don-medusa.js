import { BolaAzul_vc_jc } from "../../blueball.js";
import { ProjectileDonMedusa } from "../projectiles/projectile-don-medusa.js";
import { Mobile } from "../mobile.js";
export class DonMedusa extends BolaAzul_vc_jc.Mobile {
    constructor(game, x, y) {
        if (!new.target) {
            throw new TypeError("Class constructor DonMedusa cannot be invoked without 'new'");
        }
        
        super(game, x, y, 'mobSprites', 'donmedusa1', {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.DonMedusa
        });

        this.frameName = 'donmedusa1';
        this.playerTargeteableAt = null;
        this.projectile = null;
        this.lastDirection = Phaser.Tilemap.SOUTH;
        this.isAwaken = false;

        if (!this.level) {
            console.error("DonMedusa created without level reference");
            return;
        }
        
        this.level.onPhaseChanged.add(this.phaseChanged, this);
        this.level.onPlayerMoved.add(this.checkShoot, this);
    }

    get lookingAt() {
        return this._lookingAt;
    }

    set lookingAt(value) {
        this._lookingAt = value;
        this.lastDirection = value;
    }

    checkShoot(player) {
        if (!player || !player.alive || !player.cellPosition) {
            this.frameName = 'donmedusa1';
            return;
        }
        
        const diffX = this.cellPosition.x - player.cellPosition.x;
        const diffY = this.cellPosition.y - player.cellPosition.y;

        this.frameName = (Math.abs(diffX) <= 1 || Math.abs(diffY) <= 1) ? 'donmedusa2' : 'donmedusa1';

        // Solo disparar si no hay proyectil activo
        if (this.projectile === null) {
            this.projectile = BolaAzul_vc_jc.ProjectileDonMedusa.shootTo(this, player);
        }
    }

    nextAction() {
        if (this.isAwaken && this.level?.player?.alive) {
            this.checkShoot(this.level.player);

            if (this.projectile === null && this.lastDirection !== null) {
                if (typeof this.lastDirection === 'number' && this.lastDirection >= 0 && this.lastDirection <= 3) {
                    if (!this.moveTo(this.lastDirection)) {
                        this.lastDirection = (this.lastDirection + 2) % 4;
                    }
                } else {
                    console.warn("Intento de movimiento con dirección inválida:", this.lastDirection);
                    this.lastDirection = Phaser.Tilemap.SOUTH;
                }
            }
        }
    }

    destroy() {
        if (this.level) {
            this.level.onPhaseChanged.remove(this.phaseChanged, this);
            this.level.onPlayerMoved.remove(this.checkShoot, this);
        }
        super.destroy(...arguments);
    }

    phaseChanged(currentPhase) {
        switch (currentPhase) {
            case BolaAzul_vc_jc.Level.PHASES.HEARTS:
                this.isAwaken = true;
                break;
            case BolaAzul_vc_jc.Level.PHASES.EXITS:
            case BolaAzul_vc_jc.Level.PHASES.ENDED:
                this.toDestroy = true;
                break;
        }
    }
}

BolaAzul_vc_jc.DonMedusa = DonMedusa;
