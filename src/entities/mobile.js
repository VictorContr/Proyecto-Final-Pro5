import { BolaAzul_vc_jc } from "../blueball.js";
import { Entity } from "./entity.js";
export class Mobile extends BolaAzul_vc_jc.Entity {
    static tilesThatCollide = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsTiles_vc_jc('Rock', 'Bush', 'Lava', 'Wall', 'Water', 'Grass');
    static entitiesThatCollide = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsEntidades_vc_jc('Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leeper', 'Medusa', 'Player', 'Rocky', 'Skull', 'Snakey', 'Cofre_vc_jc', 'DoorClosed', 'DoorOpened', 'Heart');
    static tilesThatSlowdown = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsTiles_vc_jc('Sand');
    static entitiesThatCanPush = [];
    static entitiesThatBridge = [];
    static tilesThatArrow = [];

    constructor(game, x, y, key, frame, options) {
        // Ensure proper instantiation
        if (!new.target) {
            throw new TypeError("Class constructor Mobile cannot be invoked without 'new'");
        }
        
        super(game, x, y, key, frame, options);

        this.movementDuration = Phaser.Timer.SECOND / BolaAzul_vc_jc.Configurar_vc_jc.gameSpeed;
        this.isMoving = false;
        this.wasPushed = false;

        this.animationNames = {
            [Phaser.Tilemap.NORTH]: 'Top',
            [Phaser.Tilemap.EAST]: 'Right',
            [Phaser.Tilemap.SOUTH]: 'Down',
            [Phaser.Tilemap.WEST]: 'Left'
        };
    }

    canMoveTo(direction) {
        // Verificar estado básico primero
        if (!this.exists || !this.alive || this.isMoving || !this.level) {
            return false;
        }

        const positions = this.cellsAt(direction);
        if (!positions || positions.length !== 2) return false;

        const [pos1, pos2] = positions;
        
        // Safely get entities and tiles
        const entities1 = this.level.getEntitesAt(pos1.x, pos1.y) || [];
        const entities2 = this.level.getEntitesAt(pos2.x, pos2.y) || [];
        
        const tile1 = this.level.map?.getTile?.(pos1.x >> 1, pos1.y >> 1, 'environment', true) || {index: -1, properties: {}};
        const tile2 = this.level.map?.getTile?.(pos2.x >> 1, pos2.y >> 1, 'environment', true) || {index: -1, properties: {}};

        // Check collision conditions
        const cls = this.constructor;
        
        const collisionConditions = [
            cls.tilesThatCollide.includes(tile1.index) && 
                BolaAzul_vc_jc.Ayudante_vc_jc.obtenerEntidadesDesdeIndices_vc_jc(cls.entitiesThatBridge, entities1).length === 0,
                
            cls.tilesThatCollide.includes(tile2.index) && 
                BolaAzul_vc_jc.Ayudante_vc_jc.obtenerEntidadesDesdeIndices_vc_jc(cls.entitiesThatBridge, entities2).length === 0,
                
            cls.tilesThatArrow.includes(tile1.index) && tile1.properties.direction === direction,
            
            cls.tilesThatArrow.includes(tile2.index) && tile2.properties.direction === direction,
            
            BolaAzul_vc_jc.Ayudante_vc_jc.obtenerEntidadesDesdeIndices_vc_jc(cls.entitiesThatCollide, entities1).length > 0,
            
            BolaAzul_vc_jc.Ayudante_vc_jc.obtenerEntidadesDesdeIndices_vc_jc(cls.entitiesThatCollide, entities2).length > 0
        ];

        if (collisionConditions.some(condition => condition)) return false;

        // Check pushable entities
        const pushing1 = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerEntidadesDesdeIndices_vc_jc(cls.entitiesThatCanPush, entities1);
        const pushing2 = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerEntidadesDesdeIndices_vc_jc(cls.entitiesThatCanPush, entities2);

        if (pushing1.length !== pushing2.length) return false;
        if (pushing1.length === 0) return true;

        const commonPushing = BolaAzul_vc_jc.Ayudante_vc_jc.interseccion_vc_jc(pushing1, pushing2);
        if (commonPushing.length !== pushing1.length) return false;

        return commonPushing.every(entity => 
            entity?.canBePushed && entity.canMoveTo?.(direction)
        );
    }

    moveTo(direction, wasPushed = false, movementDuration = null) {
        // Verificar estado básico primero
        if (!this.exists || !this.alive || !this.game) {
            return false;
        }

        if (!wasPushed && !this.animationNames[direction]) {
            console.warn(`No animation defined for direction: ${direction}`);
            return false;
        }

        if (!wasPushed) {
            this.animations.play(this.animationNames[direction]);
        }

        if (!wasPushed && !this.canMoveTo(direction)) return false;

        const positions = this.cellsAt(direction);
        if (!positions || positions.length !== 2) return false;
        
        // Direction to position update mapping
        const directionUpdates = {
            [Phaser.Tilemap.NORTH]: () => this.cellPosition.y--,
            [Phaser.Tilemap.EAST]: () => this.cellPosition.x++,
            [Phaser.Tilemap.SOUTH]: () => this.cellPosition.y++,
            [Phaser.Tilemap.WEST]: () => this.cellPosition.x--
        };
        
        // Apply position update
        if (directionUpdates[direction]) {
            directionUpdates[direction]();
        } else {
            console.warn(`Invalid direction: ${direction}`);
            return false;
        }

        // Safely get destination position
        const destPosition = this.level?.getCellPosition?.(this.cellPosition.x, this.cellPosition.y);
        if (!destPosition) {
            console.error("Couldn't get cell position");
            return false;
        }

        // Get entities to push
        const pushedEntities = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerEntidadesDesdeIndices_vc_jc(
            this.constructor.entitiesThatCanPush,
            this.level?.getEntitesAt?.(positions[0].x, positions[0].y) || []
        );

        // Check for slowdown
        const getTileIndex = (pos) => 
            this.level?.map?.getTile?.(pos.x >> 1, pos.y >> 1, 'environment', true)?.index || -1;
        
        const hasSlowdown = positions.some(pos => 
            this.constructor.tilesThatSlowdown.includes(getTileIndex(pos))
        );

        let duration = movementDuration || this.movementDuration;
        if (!wasPushed && hasSlowdown) duration *= 2;

        this.isMoving = true;
        this.wasPushed = wasPushed;

        // Move pushed entities
        pushedEntities.forEach(entity => {
            if (entity?.exists && entity.alive && entity.moveTo) {
                entity.moveTo(direction, true, duration);
            }
        });

        // VERIFICAR QUE EL JUEGO AÚN EXISTE ANTES DE CREAR TWEEN
        if (!this.game || !this.game.add || !this.game.add.tween) {
            console.warn("Cannot create tween - game reference lost");
            this.isMoving = false;
            this.wasPushed = false;
            return false;
        }

        // Create movement tween
        const tween = this.game.add.tween(this).to(destPosition, duration, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(() => {
            if (this.game && this.game.tweens) {
                this.game.tweens.remove(tween);
            }
            
            this.isMoving = false;
            this.wasPushed = false;
            
            // Solo llamar a nextAction si aún existe
            if (this.exists && this.alive) {
                this.nextAction();
            }
        }, this);

        return true;
    }

    canTouch(entity) {
        if (!this.exists || !this.alive || !entity || !entity.exists || !entity.alive || !entity.cellPosition) {
            return 0;
        }
        
        const dx = Math.abs(this.cellPosition.x - entity.cellPosition.x);
        const dy = Math.abs(this.cellPosition.y - entity.cellPosition.y);

        // Too far to touch
        if (dx > 2 || dy > 2) return 0;
        
        // Overlapping
        if (dx < 2 && dy < 2) return -1;
        
        // Full touches
        if ((dx === 0 && dy === 2) || (dx === 2 && dy === 0)) return 1;
        
        // Partial touches
        if ((dx === 1 && dy === 2) || (dx === 2 && dy === 1)) return 2;
        
        // No touch
        return 0;
    }

    update() {
        // Solo actualizar si la entidad aún existe
        if (this.exists && this.alive && !this.isMoving) {
            this.nextAction();
        }
    }

    nextAction() {
        // To be implemented by subclasses
    }

    destroy() {
        // Eliminar cualquier tween asociado primero
        if (this.game && this.game.tweens) {
            this.game.tweens.removeFrom(this);
        }
        
        // Luego llamar al destroy del padre
        super.destroy();
    }
}

BolaAzul_vc_jc.Mobile = Mobile;