import { BolaAzul_vc_jc } from "../../blueball.js";
import { Mobile } from "../mobile.js";
export class Egg extends BolaAzul_vc_jc.Mobile {
    static tilesThatCollideWithOutWater = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsTiles_vc_jc('Rock', 'Bush', 'Lava', 'Wall', 'Arrow');
    static tilesThatCollideWithWater = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsTiles_vc_jc('Rock', 'Bush', 'Lava', 'Wall', 'Water', 'Bridge', 'Arrow', 'LavaBridge');

    constructor(target) {
        // Validación de parámetros
        if (!target || !target.game) {
            throw new Error("Egg requires a valid target entity");
        }
        
        super(target.game, target.cellPosition.x, target.cellPosition.y, 'eggSprites', 2, {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.Egg
        });

        // Validar existencia de level
        if (!this.level) {
            console.error("Egg created without level reference");
            return;
        }
        
        this.level.onPhaseChanged.add(this.phaseChanged, this);
        this.level.entities.addAt(this, 0);
        
        this.target = target;
        target.kill();
        
        // Configurar temporizador para romper huevo
        this.event = this.game.time.events.add(Phaser.Timer.SECOND * 5, this.breakEgg, this);
    }

    get tilesThatCollide() {
        return (this.level.waterEgg instanceof BolaAzul_vc_jc.WaterEgg)
            ? Egg.tilesThatCollideWithWater
            : Egg.tilesThatCollideWithOutWater;
    }

    breakEgg() {
        this.frameName = 'eggBroken';
        this.event = this.game.time.events.add(Phaser.Timer.SECOND * 2, this.open, this);
    }

    open() {
        this.clearEvents();
        
        if (this.target && this.target.setCellPosition && this.target.revive) {
            this.target.setCellPosition(this.cellPosition.x, this.cellPosition.y);
            this.target.revive();
        }
        
        this.toDestroy = true;
    }

    die() {
        this.clearEvents();
        this.event = this.game.time.events.add(Phaser.Timer.SECOND * 10, this.respawn, this);
        this.kill();
    }

    respawn() {
        this.clearEvents();
        
        if (this.target && this.target.respawn) {
            this.target.respawn();
        }
        
        this.toDestroy = true;
    }

    isInWater() {
        if (!this.level?.map) return false;
        
        const positions = [
            { x: this.cellPosition.x >> 1,     y: this.cellPosition.y >> 1 },
            { x: this.cellPosition.x >> 1,     y: (this.cellPosition.y + 1) >> 1 },
            { x: (this.cellPosition.x + 1) >> 1, y: this.cellPosition.y >> 1 },
            { x: (this.cellPosition.x + 1) >> 1, y: (this.cellPosition.y + 1) >> 1 }
        ];

        // Verificar si todas las posiciones son agua
        return positions.every(pos => {
            const tile = this.level.map.getTile(pos.x, pos.y, 'environment', true);
            return tile && BolaAzul_vc_jc.Global_vc_jc.Tiles.Water.includes(tile.index);
        });
    }

    nextAction() {
        if (this.isInWater() && !this.level.waterEgg) {
            try {
                new BolaAzul_vc_jc.WaterEgg(this);
                this.toDestroy = true;
            } catch (error) {
                console.error("Error creating WaterEgg:", error);
            }
        }
    }

    destroy() {
        this.clearEvents();
        
        if (this.level) {
            this.level.onPhaseChanged.remove(this.phaseChanged, this);
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

    // Método auxiliar para limpiar eventos
    clearEvents() {
        if (this.event) {
            this.game.time.events.remove(this.event);
            this.event = null;
        }
    }
}

BolaAzul_vc_jc.Egg = Egg;