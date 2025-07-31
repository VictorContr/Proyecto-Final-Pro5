import { BolaAzul_vc_jc } from "../../blueball.js";
import { Projectile } from "../projectile.js";
import { Egg } from "../mobiles/egg.js";
import { WaterEgg } from "../mobiles/water-egg.js";
export class ProjectileEgg extends BolaAzul_vc_jc.Projectile {
    static tilesThatCollide = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsTiles_vc_jc('Rock', 'Bush', 'Wall', 'Arrow');
    static entitiesThatCollide = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsEntidades_vc_jc(
        'Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leeper', 
        'Medusa', 'Player', 'Rocky', 'Skull', 'Snakey', 
        'WaterEgg', 'Cofre_vc_jc', 'PuertaCerrada_vc_jc', 'DoorOpened', 'Heart'
    );
    static entitiesThatImpact = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsEntidades_vc_jc(
        'Alma', 'DonMedusa', 'Egg', 'Gol', 'Leeper', 
        'Medusa', 'Player', 'Rocky', 'Skull', 'Snakey', 'WaterEgg'
    );

    constructor(shooter, direction) {
        // Validar parámetros
        if (!shooter) throw new Error("ProjectileEgg requires a shooter");
        if (typeof direction !== 'number') throw new Error("Invalid direction for ProjectileEgg");
        
        // Determinar frame según dirección
        const frame = (direction === Phaser.Tilemap.NORTH || direction === Phaser.Tilemap.SOUTH) 
            ? 0 
            : 1;
        
        super(shooter, direction, 'eggSprites', frame);
    }

    canMoveTo(direction) {
        if (!this.level?.map) return false;
        
        const positions = this.cellsAt(direction);
        if (!positions || positions.length < 2) return false;
        
        // Obtener tiles
        const getTile = pos => 
            this.level.map.getTile(pos.x >> 1, pos.y >> 1, 'environment', true) || {};
        
        const tile1 = getTile(positions[0]);
        const tile2 = getTile(positions[1]);
        
        // Verificar colisión con tiles
        const tileCollision1 = this.constructor.tilesThatCollide.includes(tile1.index);
        const tileCollision2 = this.constructor.tilesThatCollide.includes(tile2.index);
        
        // Verificar colisión con entidades
        const getEntities = pos => this.level.getEntitesAt?.(pos.x, pos.y) || [];
        const entityCollision1 = tileCollision1 ? false : 
            BolaAzul_vc_jc.Ayudante_vc_jc.obtenerEntidadesDesdeIndices_vc_jc(
                this.constructor.entitiesThatCollide, 
                getEntities(positions[0])
            ).length > 0;
        
        const entityCollision2 = tileCollision2 ? false : 
            BolaAzul_vc_jc.Ayudante_vc_jc.obtenerEntidadesDesdeIndices_vc_jc(
                this.constructor.entitiesThatCollide, 
                getEntities(positions[1])
            ).length > 0;
        
        // Si ambos lados tienen colisión, no se puede mover
        return !(tileCollision1 || entityCollision1) || !(tileCollision2 || entityCollision2);
    }

        getImpacted() {
        const positions = this.cellsAt(this.shootDirection);
        const entities1 = this.level.getEntitesAt(positions[0].x, positions[0].y) || [];
        const entities2 = this.level.getEntitesAt(positions[1].x, positions[1].y) || [];

        const impacted1 = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerEntidadesDesdeIndices_vc_jc(
            this.constructor.entitiesThatImpact, entities1
        );
        const impacted2 = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerEntidadesDesdeIndices_vc_jc(
            this.constructor.entitiesThatImpact, entities2
        );

        // Devuelve la unión, no la intersección
        return [...new Set([...impacted1, ...impacted2])];
        }


    impact(target) {
        if (!target) return;
        
        try {
            if (target instanceof BolaAzul_vc_jc.Egg || target instanceof BolaAzul_vc_jc.WaterEgg) {
                target.die?.();
            } else if (target.canBeCaptured === true) {
                // Crear nuevo huevo solo si no existe ya uno
                if (!target.hasEgg) {
                    new BolaAzul_vc_jc.Egg(target);
                    target.hasEgg = true; // Prevenir múltiples capturas
                }
            }
        } catch (error) {
            console.error("Error impacting target:", error);
        }
    }
}

BolaAzul_vc_jc.ProjectileEgg = ProjectileEgg;