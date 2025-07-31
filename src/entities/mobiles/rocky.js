import { BolaAzul_vc_jc } from "../../blueball.js";
import { Global_vc_jc } from "../../global.js";
import { Mobile } from "../mobile.js";
export class Rocky extends BolaAzul_vc_jc.Mobile {
    Global_vc_jc = BolaAzul_vc_jc.Global_vc_jc;
    static entitiesThatCollide = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsEntidades_vc_jc(
        'Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leeper', 
        'Medusa', 'Rocky', 'Skull', 'Snakey', 'Cofre_vc_jc', 
        'PuertaCerrada_vc_jc', 'PuertaAbierta_vc_jc', 'Heart'
    );
    
    static entitiesThatCanPush = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsEntidades_vc_jc('Player');

    constructor(game, x, y) {
        // Validar instanciación
        if (!new.target) throw new TypeError("Class constructor Rocky cannot be invoked without 'new'");
        
        super(game, x, y, 'mobSprites', 'rockyDown2', {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.Rocky
        });

        // Animaciones
        this.animations.add('Top', Phaser.Animation.generateFrameNames('rockyUp', 1, 5, '', 1), 5, true);
        this.animations.add('Right', Phaser.Animation.generateFrameNames('rockyRight', 1, 4, '', 1), 5, true);
        this.animations.add('Down', Phaser.Animation.generateFrameNames('rockyDown', 1, 5, '', 1), 5, true);
        this.animations.add('Left', Phaser.Animation.generateFrameNames('rockyLeft', 1, 4, '', 1), 5, true);

        // Estado inicial
        this._isRunning = false;
        this._isWaiting = false;
         this.lastDirection = Phaser.Tilemap.SOUTH; // Valor por defecto
        this.currentOptions = null;
        this.isAwaken = false;
        this.normalMovementDuration = this.movementDuration;
        this.runMovementDuration = this.movementDuration * 0.75;
         this.lookingAt = Phaser.Tilemap.SOUTH; // Esto también actualiza lastDirection

        // Validar existencia de level antes de suscribir eventos
        if (!this.level) {
            console.error("Rocky created without level reference");
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

    get isRunning() {
        return this._isRunning;
    }

    set isRunning(value) {
        if (this._isRunning !== value) {
            this._isRunning = value;
            this.movementDuration = value ? this.runMovementDuration : this.normalMovementDuration;
        }
    }

    get isWaiting() {
        return this._isWaiting;
    }

    set isWaiting(value) {
        if (this._isWaiting !== value) {
            if (!value) {
                this.animations.stop();
            }
            this._isWaiting = value;
        }
    }

    checkIfCanRunToPlayer() {
        if (!this.isRunning && !this.isWaiting) {
            if (this.canTouch(this.level.player) === 0 && 
                this.cellPosition.x === this.level.player.cellPosition.x) {
                
                this.lastDirection = this.cellPosition.y > this.level.player.cellPosition.y ? 
                    Phaser.Tilemap.NORTH : Phaser.Tilemap.SOUTH;
                this.isRunning = true;
            }
        }
    }

    checkIfCanWaitForPlayer() {
        if (!this.isRunning) {
            const verticalDiff = Math.abs(this.cellPosition.y - this.level.player.cellPosition.y);
            const horizontalDiff = Math.abs(this.cellPosition.x - this.level.player.cellPosition.x);
            
            if (verticalDiff > 1 || horizontalDiff > 6) {
                this.isWaiting = false;
            } else if (verticalDiff <= 1 && horizontalDiff <= 6) {
                this.isWaiting = true;
            }

            if (this.canTouch(this.level.player)) {
                this.isWaiting = true;
            }
        }
    }

    performMovement() {
        const changeDirections = [0, 1, 2, -1];
        let directionFound = false;

        if (this.isRunning) {
            // VERIFICAR QUE lastDirection TENGA UN VALOR VÁLIDO
            if (typeof this.lastDirection === 'number' && this.lastDirection >= 0 && this.lastDirection <= 3) {
                if (!this.moveTo(this.lastDirection)) {
                    this.isRunning = false;
                    this.checkIfCanWaitForPlayer();
                }
            } else {
                console.warn("Intento de movimiento con dirección inválida:", this.lastDirection);
                this.isRunning = false;
                this.checkIfCanWaitForPlayer();
            }
        } else if (!this.isWaiting) {
            // BUSCAR UNA DIRECCIÓN VÁLIDA
            let validDirectionFound = false;
            for (let i = 0; i < changeDirections.length; i++) {
                let direction = this.lastDirection + changeDirections[i];
                direction = (direction >= 4) ? direction - 4 : (direction < 0) ? direction + 4 : direction;

                if (this.canMoveTo(direction)) {
                    this.lastDirection = direction;
                    validDirectionFound = true;
                    break;
                }
            }

            // SOLO MOVER SI SE ENCONTRÓ UNA DIRECCIÓN VÁLIDA
            if (validDirectionFound) {
                this.moveTo(this.lastDirection);
            } else {
                console.warn("No se encontró dirección válida para movimiento. lastDirection:", this.lastDirection);
            }
        }
    }   

    nextAction() {
        if (this.isAwaken === true) {
           // ASEGURAR QUE lastDirection TENGA UN VALOR VÁLIDO
            if (this.lastDirection === null || this.lastDirection === undefined) {
                console.warn("lastDirection era nulo, asignando valor por defecto");
                this.lastDirection = this.lookingAt || Phaser.Tilemap.SOUTH;
            }


            this.checkIfCanRunToPlayer();
            this.checkIfCanWaitForPlayer();

            this.performMovement();
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

BolaAzul_vc_jc.Rocky = Rocky;