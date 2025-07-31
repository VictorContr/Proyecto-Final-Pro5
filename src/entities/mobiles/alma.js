import { BolaAzul_vc_jc } from "../../blueball.js";
import { Mobile } from "../mobile.js";
export class Alma extends BolaAzul_vc_jc.Mobile {
    static entitiesThatCollide = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsEntidades_vc_jc(
        'Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leeper', 'Medusa', 
        'Rocky', 'Skull', 'Snakey', 'Cofre_vc_jc', 'PuertaCerrada_vc_jc', 'PuertaAbierta_vc_jc', 'Heart'
    );

    constructor(game, x, y) {
        super(game, x, y, 'mobSprites', 'alma1', {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.Alma
        });

        // Animation setup
        this.animations.add('Walking', Phaser.Animation.generateFrameNames('alma', 1, 3, '', 1), 5, true);
        this.animations.add('Running', Phaser.Animation.generateFrameNames('almaRunning', 1, 2, '', 1), 5, true);

        // State initialization
        this._isRunning = false;
        this.lastDirection = null;
        this.currentOptions = null;
        this.isAwaken = false;

        // Movement timing
        this.normalMovementDuration = this.movementDuration;
        this.runMovementDuration = this.movementDuration * 0.75;

        // Initial animation setup
        this.setAnimationNames(false);

        // Event handling
        this.level.onPhaseChanged.add(this.phaseChanged, this);
    }

    get lookingAt() {
        return this._lookingAt;
    }

    set lookingAt(value) {
        this._lookingAt = value;
        this.lastDirection = value;
    }

    get isRunning() {
        return this._isRunning;
    }

    set isRunning(value) {
        if (this._isRunning !== value) {
            this._isRunning = value;
            this.movementDuration = value ? this.runMovementDuration : this.normalMovementDuration;
            this.setAnimationNames(value);
        }
    }

    setAnimationNames(isRunning) {
        const animation = isRunning ? 'Running' : 'Walking';
        this.animationNames = {
            [Phaser.Tilemap.NORTH]: animation,
            [Phaser.Tilemap.EAST]: animation,
            [Phaser.Tilemap.SOUTH]: animation,
            [Phaser.Tilemap.WEST]: animation
        };
    }

    checkIfCanRunToPlayer() {
        if (this.isRunning) return;

        const { player } = this.level;
        if (this.cellPosition.y === player.cellPosition.y) {
            const direction = this.cellPosition.x > player.cellPosition.x 
                ? Phaser.Tilemap.WEST 
                : Phaser.Tilemap.EAST;
            
            if (this.canMoveTo(direction)) {
                this.lastDirection = direction;
                this.isRunning = true;
            }
        }
    }

    performMovement(playerPosition) {
        if (this.isRunning) {
            if (!this.moveTo(this.lastDirection)) {
                this.isRunning = false;
            }
            return;
        }

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
        if (!this.isAwaken || !this.alive) return;

        const { player } = this.level;
        const playerPosition = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerDireccionHacia_vc_jc(this, player);

        if (this.canTouch(player) > 0 && this.canMoveTo(playerPosition.principal)) {
            player.die();
        } else {
            this.lastDirection = this.lastDirection || this.lookingAt;
            this.checkIfCanRunToPlayer();
            this.lastDirection = this.lastDirection || playerPosition.principal;
            this.performMovement(playerPosition);
        }
    }

    destroy() {
        this.level.onPhaseChanged.remove(this.phaseChanged, this);
        super.destroy(...arguments);
    }

    respawn() {
        super.respawn(...arguments);
        this.lastDirection = this.lookingAt;
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

BolaAzul_vc_jc.Alma = Alma;