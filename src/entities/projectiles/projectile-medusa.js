import { BolaAzul_vc_jc } from "../../blueball.js";
import { Projectile } from "../projectile.js";
export class ProjectileMedusa extends BolaAzul_vc_jc.Projectile {
    static tilesThatCollide = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsTiles_vc_jc('Rock', 'Bush', 'Lava', 'Wall', 'Water', 'Grass');
    static entitiesThatCollide = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsEntidades_vc_jc(
        'Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leeper', 
        'Medusa', 'Player', 'Rocky', 'Skull', 'Snakey', 'Cofre_vc_jc', 
        'PuertaCerrada_vc_jc', 'DoorOpened', 'Heart'
    );

    constructor(shooter, direction) {
        // Validar instanciación
        if (!new.target) {
            throw new TypeError("Class constructor ProjectileMedusa cannot be invoked without 'new'");
        }
        
        super(shooter, direction, 'mobSprites', 8);

        // Configuración según dirección
        switch (direction) {
            case Phaser.Tilemap.NORTH:
                this.frameName = 'projectileMedusa1';
                this.angle = 0;
                break;
            case Phaser.Tilemap.EAST:
                this.frameName = 'projectileMedusa2';
                this.angle = 0;
                break;
            case Phaser.Tilemap.SOUTH:
                this.frameName = 'projectileMedusa1';
                this.angle = 180;
                break;
            case Phaser.Tilemap.WEST:
                this.frameName = 'projectileMedusa2';
                this.angle = 180;
                break;
        }

        // Iniciar animación
        this.animations.play('anim');
    }

    impact(target) {
        if (target instanceof BolaAzul_vc_jc.Player) {
            target.die();
        }
    }

    static canTarget(shooter, target) {
        // Verificar que ambos existen
        if (!shooter || !shooter.level || !target || !target.cellPosition) {
            return -1;
        }

        const cellsToCheck = [];
        let direction;
        let sidePosition, firstPosition, lastPosition;

        // Calcular celdas a verificar según posición relativa
        if (shooter.cellPosition.x === target.cellPosition.x) {
            // Misma columna
            sidePosition = shooter.cellPosition.x + 1;

            if (shooter.cellPosition.y >= target.cellPosition.y) {
                direction = Phaser.Tilemap.NORTH;
                firstPosition = target.cellPosition.y + 2;
                lastPosition = shooter.cellPosition.y - 1;
            } else {
                direction = Phaser.Tilemap.SOUTH;
                firstPosition = shooter.cellPosition.y + 2;
                lastPosition = target.cellPosition.y - 1;
            }

            for (let i = firstPosition; i <= lastPosition; i++) {
                cellsToCheck.push(
                    { x: shooter.cellPosition.x, y: i },
                    { x: sidePosition, y: i }
                );
            }
        } else if (shooter.cellPosition.y === target.cellPosition.y) {
            // Misma fila
            sidePosition = shooter.cellPosition.y + 1;

            if (shooter.cellPosition.x >= target.cellPosition.x) {
                direction = Phaser.Tilemap.WEST;
                firstPosition = target.cellPosition.x + 2;
                lastPosition = shooter.cellPosition.x - 1;
            } else {
                direction = Phaser.Tilemap.EAST;
                firstPosition = shooter.cellPosition.x + 2;
                lastPosition = target.cellPosition.x - 1;
            }

            for (let i = firstPosition; i <= lastPosition; i++) {
                cellsToCheck.push(
                    { x: i, y: shooter.cellPosition.y },
                    { x: i, y: sidePosition }
                );
            }
        } else {
            // No están alineados
            return -1;
        }

        // Verificar obstáculos en el camino
        for (let i = 0; i < cellsToCheck.length; i++) {
            const cell = cellsToCheck[i];
            const tile = shooter.level.map.getTile(
                cell.x >> 1, 
                cell.y >> 1, 
                'environment', 
                true
            );
            
            // Verificar colisión con tiles
            if (tile && ProjectileMedusa.tilesThatCollide.includes(tile.index)) {
                return -1;
            }
            
            // Verificar colisión con entidades
            const entities = shooter.level.getEntitesAt(cell.x, cell.y) || [];
            const collidingEntities = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerEntidadesDesdeIndices_vc_jc(
                ProjectileMedusa.entitiesThatCollide, 
                entities
            );
            
            if (collidingEntities.length > 0) {
                return -1;
            }
        }

        return direction;
    }

    static shootTo(shooter, target) {
        // Verificar que ambos existen
        if (!shooter || !shooter.exists || !shooter.alive || 
            !target || !target.exists || !target.alive) {
            return null;
        }
        
        const direction = ProjectileMedusa.canTarget(shooter, target);
        
        if (direction >= 0) {
            // Crear nuevo proyectil
            return new ProjectileMedusa(shooter, direction);
        }
        
        return null;
    }
}

BolaAzul_vc_jc.ProjectileMedusa = ProjectileMedusa;