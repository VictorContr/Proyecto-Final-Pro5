import { BolaAzul_vc_jc } from "../../blueball.js";
import { Mobile } from "../mobile.js";
export class WaterEgg extends BolaAzul_vc_jc.Mobile {
    static tilesThatCollide = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsTiles_vc_jc(
        'Rock', 'Bush', 'Lava', 'Wall', 'Bridge', 
        'Arrow', 'LavaBridge', 'Floor', 'Sand', 'Grass'
    );
    static entitiesThatCollide = [];

    constructor(target) {
        // Validación de parámetros
        if (!target || !target.game || !target.target) {
            throw new Error("WaterEgg requires a valid target entity");
        }
        
        super(target.game, target.cellPosition.x, target.cellPosition.y, 'eggSprites', 2, {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.WaterEgg
        });

        // Validar existencia de level
        if (!this.level) {
            console.error("WaterEgg created without level reference");
            return;
        }
        
        this.movementDuration *= 4;
        this.level.onPhaseChanged.add(this.phaseChanged, this);
        this.level.entities.addAt(this, 0);
        
        // Configurar estado inicial
        this.level.waterEgg = this;
        this.target = target.target;
        this.swampLevel = 3;
        
        // Configurar temporizador de pantano
        this.swampTimer = this.game.time.create(false);
        this.swampTimer.repeat(Phaser.Timer.SECOND * 1, this.swampLevel + 1, this.swampEgg, this);
        this.swampTimer.start();
        this.swampTimer.pause();
    }

    die() {
        this.clearEvents();
        this.swampTimer?.stop();
        
        this.event = this.game.time.events.add(Phaser.Timer.SECOND * 8, this.respawn, this);
        
        if (this.level.waterEgg === this) {
            this.level.waterEgg = null;
        }
        
        this.kill();
    }

    swampEgg() {
        if (!this.level) return;
        
        if (this.swampLevel === 0) {
            if (this.isPlayerInWater()) {
                this.level.player.die?.();
            } else {
                this.die();
            }
        } else {
            // Reducir tamaño gradualmente
            const scaleFactor = 1 / (4.1 - this.swampLevel);
            this.width = this.level.tileSize.width * scaleFactor;
            this.height = this.level.tileSize.height * scaleFactor;
            this.swampLevel--;
        }
    }

    isPlayerInWater() {
        if (!this.level?.player || !this.level.map) return false;
        
        const { cellPosition } = this.level.player;
        const positions = [
            { x: cellPosition.x >> 1,         y: cellPosition.y >> 1 },
            { x: cellPosition.x >> 1,         y: (cellPosition.y + 1) >> 1 },
            { x: (cellPosition.x + 1) >> 1,   y: cellPosition.y >> 1 },
            { x: (cellPosition.x + 1) >> 1,   y: (cellPosition.y + 1) >> 1 }
        ];

        // Verificar si el jugador está en cualquier tile de agua
        return positions.some(pos => {
            const tile = this.level.map.getTile(pos.x, pos.y, 'environment', true);
            return tile && BolaAzul_vc_jc.Global_vc_jc.Tiles.Water.includes(tile.index);
        });
    }

    isPlayerAbove() {
        if (!this.level?.player) return 0;
        
        const dx = Math.abs(this.level.player.cellPosition.x - this.cellPosition.x);
        const dy = Math.abs(this.level.player.cellPosition.y - this.cellPosition.y);

        if (dx === 0 && dy === 0) return 2; // Full above
        if (dx <= 1 && dy <= 1) return 1;   // Partially above
        return 0;                            // Not above
    }

    getWaterDirection() {
        if (!this.level?.map) return null;
        
        const positions = [
            { x: this.cellPosition.x,     y: this.cellPosition.y },
            { x: this.cellPosition.x,     y: this.cellPosition.y + 1 },
            { x: this.cellPosition.x + 1, y: this.cellPosition.y },
            { x: this.cellPosition.x + 1, y: this.cellPosition.y + 1 }
        ];
        
        // Obtener direcciones válidas de las propiedades de los tiles
        const directions = positions
            .map(pos => {
                const tile = this.level.map.getTile(pos.x >> 1, pos.y >> 1, 'environment', true);
                return tile?.properties?.direction;
            })
            .filter(dir => 
                typeof dir === 'number' && 
                this.canMoveTo(dir)
            );
        
        // Eliminar duplicados
        const uniqueDirections = [...new Set(directions)];
        
        if (uniqueDirections.length === 0) return null;
        if (uniqueDirections.length === 1) return uniqueDirections[0];
        
        // Preferir direcciones en tiles exactos (posición par)
        const exactDirections = uniqueDirections.filter(dir => {
            const pos = this.cellsAt(dir)[0];
            return pos && pos.x % 2 === 0 && pos.y % 2 === 0;
        });
        
        return exactDirections.length > 0 ? exactDirections[0] : uniqueDirections[0];
    }

    nextAction() {
        if (!this.level?.player) return;
        
        const playerAbove = this.isPlayerAbove();
        const waterDirection = this.getWaterDirection();
        let canMove = false;

        if (waterDirection !== null) {
            if (playerAbove === 0) {
                canMove = this.moveTo(waterDirection);
            } 
            else if (playerAbove === 2 && !this.level.player.isMoving) {
                this.level.player.nextAction?.();
                
                if (!this.level.player.isMoving) {
                    canMove = this.moveTo(waterDirection);
                    
                    if (canMove) {
                        this.level.player.moveTo(waterDirection, true, this.movementDuration);
                        this.level.player.isMoving = true;
                        this.level.player.wasPushed = true;
                        this.level.player.cellPosition = { ...this.cellPosition };
                    }
                }
            }
        }

        // Controlar el temporizador de pantano
        if (!canMove && !this.isMoving && playerAbove !== 1) {
            this.swampTimer?.resume();
        } else {
            this.swampTimer?.pause();
        }
    }

    respawn() {
        this.clearEvents();
        
        if (this.target?.respawn) {
            this.target.respawn();
        }
        
        this.destroy();
    }

    destroy() {
        this.clearEvents();
        
        if (this.level) {
            this.level.onPhaseChanged.remove(this.phaseChanged, this);
            if (this.level.waterEgg === this) {
                this.level.waterEgg = null;
            }
        }
        
        this.swampTimer?.destroy();
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

    // Método auxiliar para limpiar eventos
    clearEvents() {
        if (this.event) {
            this.game.time.events.remove(this.event);
            this.event = null;
        }
    }
}

BolaAzul_vc_jc.WaterEgg = WaterEgg;