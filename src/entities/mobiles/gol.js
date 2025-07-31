import { BolaAzul_vc_jc } from "../../blueball.js";
import { ProjectileGol } from "../projectiles/projectile-gol.js";
import { Mobile } from "../mobile.js";
export class Gol extends BolaAzul_vc_jc.Mobile {
    constructor(game, x, y) {
        // Validar instanciación
        if (!new.target) throw new TypeError("Class constructor Gol cannot be invoked without 'new'");
        
        super(game, x, y, 'mobSprites', 'gol1', {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.Gol
        });

        this.isAwaken = false;
        this.isPlayerVisible = false;
        this.projectile = null;

        // Validar existencia de level antes de suscribir eventos
        if (!this.level) {
            console.error("Gol created without level reference");
            return;
        }
        
        this.level.onPhaseChanged.add(this.phaseChanged, this);
        this.level.onPlayerMoved.add(this.checkShoot, this);

        // Inicializar dirección (activará el setter)
        this.lookingAt = Phaser.Tilemap.SOUTH;
    }

    get lookingAt() {
        return this._lookingAt;
    }

    set lookingAt(value) {
        this._lookingAt = value;

        // Actualizar ángulo según la dirección
        switch (value) {
            case Phaser.Tilemap.NORTH:
                this.angle = 180;
                break;
            case Phaser.Tilemap.EAST:
                this.angle = -90;
                break;
            case Phaser.Tilemap.SOUTH:
                this.angle = 0;
                break;
            case Phaser.Tilemap.WEST:
                this.angle = 90;
                break;
        }
    }

    shoot(direction) {
        if (this.projectile === null) {
            this.projectile = new BolaAzul_vc_jc.ProjectileGol(this, direction);
            return true;
        }
        return false;
    }

    checkShoot(player) {
        this.isPlayerVisible = false;

        const playerX = player.cellPosition.x;
        const playerY = player.cellPosition.y;
        const selfX = this.cellPosition.x;
        const selfY = this.cellPosition.y;

        switch (this.lookingAt) {
            case Phaser.Tilemap.NORTH:
                if (playerY < selfY && 
                    playerX >= selfX - 1 && 
                    playerX <= selfX + 1) {
                    this.isPlayerVisible = true;
                }
                break;
            case Phaser.Tilemap.EAST:
                if (playerX > selfX && 
                    playerY >= selfY - 1 && 
                    playerY <= selfY + 1) {
                    this.isPlayerVisible = true;
                }
                break;
            case Phaser.Tilemap.SOUTH:
                if (playerY > selfY && 
                    playerX >= selfX - 1 && 
                    playerX <= selfX + 1) {
                    this.isPlayerVisible = true;
                }
                break;
            case Phaser.Tilemap.WEST:
                if (playerX < selfX && 
                    playerY >= selfY - 1 && 
                    playerY <= selfY + 1) {
                    this.isPlayerVisible = true;
                }
                break;
        }
    }

    phaseChanged(currentPhase) {
        switch (currentPhase) {
            case BolaAzul_vc_jc.Level.PHASES.PEARLS:
                this.frameName = 'gol2';
                this.isAwaken = true;
                break;
            case BolaAzul_vc_jc.Level.PHASES.EXITS:
            case BolaAzul_vc_jc.Level.PHASES.ENDED:
                this.toDestroy = true;
                if (this.projectile !== null) {
                    this.projectile.destroy();
                }
                break;
        }
    }

    destroy() {
        if (this.level) {
            this.level.onPhaseChanged.remove(this.phaseChanged, this);
            this.level.onPlayerMoved.remove(this.checkShoot, this);
        }
        super.destroy(...arguments);
    }

    nextAction() {
        if (this.alive && this.isAwaken && this.isPlayerVisible) {
            this.shoot(this.lookingAt);
        }
    }
}

BolaAzul_vc_jc.Gol = Gol;