import { BolaAzul_vc_jc } from "../../blueball.js";
import { Projectile } from "../projectile.js";
export class ProjectileGol extends BolaAzul_vc_jc.Projectile {
    constructor(shooter, direction) {
        // Validar instanciación
        if (!new.target) throw new TypeError("Class constructor ProjectileGol cannot be invoked without 'new'");
        
        super(shooter, direction, 'mobSprites', 8);

        // Configurar animaciones
        this.animations.add('anim', Phaser.Animation.generateFrameNames('projectileGol', 0, 1, '', 1), 10, true);

        // Establecer rotación según la dirección
        switch (direction) {
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

        // Iniciar animación
        this.animations.play('anim');
    }

    impact(target) {
        if (target instanceof BolaAzul_vc_jc.Player) {
            target.die();
        }
    }
}

BolaAzul_vc_jc.ProjectileGol = ProjectileGol;