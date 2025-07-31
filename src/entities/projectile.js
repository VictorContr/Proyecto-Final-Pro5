import { BolaAzul_vc_jc } from "../blueball.js";
import { Mobile } from "./mobile.js";
export class Projectile extends BolaAzul_vc_jc.Mobile {
    static tilesThatCollide = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsTiles_vc_jc('Rock', 'Wall', 'Arrow');
    static entitiesThatCollide = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsEntidades_vc_jc(
        'Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leeper', 
        'Medusa', 'Player', 'Rocky', 'Skull', 'Snakey', 
        'PuertaCerrada_vc_jc', 'PuertaAbierta_vc_jc', 'Heart'
    );
    static entitiesThatImpact = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsEntidades_vc_jc('Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leeper','Medusa', 'Player', 'Rocky', 'Skull', 'Snakey');

    constructor(shooter, direction, key, frame) {
        // Validar instanciación y parámetros
        if (!new.target) throw new TypeError("Class constructor Projectile cannot be invoked without 'new'");
        if (!shooter || !shooter.game) throw new Error("Invalid shooter for Projectile");
        
        super(shooter.game, shooter.cellPosition.x, shooter.cellPosition.y, key, frame);
        
        // Validar existencia de level antes de agregar
        if (!shooter.level) {
            console.error("Projectile created without level reference");
            return;
        }
        
        shooter.level.layers.add(this);
        this.movementDuration /= 2;
        this.shooter = shooter;
        this.shootDirection = direction;
    }

    moveTo() {
        // Intentar movimiento con la dirección establecida
        const moved = super.moveTo(this.shootDirection);
        
        if (!moved) {
            // Limpiar referencia en el shooter
            if (this.shooter) {
                this.shooter.projectile = null;
            }
            
            // Destruir el proyectil
            this.destroy(true);
            
            // Impactar en las entidades afectadas
            this.getImpacted().forEach(entity => {
                if (entity && this.impact) {
                    this.impact(entity);
                }
            });
        }
    }

    nextAction() {
        this.moveTo();
    }
        getImpacted() {
        const positions = this.cellsAt(this.shootDirection);
        const ents = positions.flatMap(p =>
            this.level.getEntitesAt(p.x, p.y) || []
        );
        return BolaAzul_vc_jc.Ayudante_vc_jc.obtenerEntidadesDesdeIndices_vc_jc(
            this.constructor.entitiesThatImpact,
            ents
        );
        }


    impact(entity) {
        // Método base a ser implementado por subclases
        console.warn("Base Projectile impact method called", entity);
    }

    destroy(destroyChildren) {
        // Limpiar referencia antes de destruir
        if (this.shooter && this.shooter.projectile === this) {
            this.shooter.projectile = null;
        }
        
        super.destroy(destroyChildren);
    }
}

BolaAzul_vc_jc.Projectile = Projectile;