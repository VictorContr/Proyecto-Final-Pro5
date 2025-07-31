import { BolaAzul_vc_jc } from "../../blueball.js";
import { Meta_vc_jc } from "../goal.js";
export class Heart extends BolaAzul_vc_jc.Meta_vc_jc {
    constructor(game, x, y) {
        super(game, x, y, 'tileSprites', 'heart', {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.Heart
        });

        this.isHeart = true;
        this.eggs = 0;
        this.blinkTimer = null;
    }

    alEntrarJugador_vc_jc(player) {
        player.incHearts();
        player.eggs += this.eggs;
        this.toDestroy = true;
        
        if (this.blinkTimer) {
            this.game.time.events.remove(this.blinkTimer);
            this.blinkTimer = null;
        }
    }

    blink(start) {
        if (!start) {
            if (this.blinkTimer) {
                this.game.time.events.remove(this.blinkTimer);
                this.blinkTimer = null;
                this.tint = 0xffffff;
            }
            return;
        }

        if (this.blinkTimer) return;

        const colors = [0xff0000, 0xffff00, 0x00ff00, 0xffff00];
        let current = 0;

        this.blinkTimer = this.game.time.events.loop(
            Phaser.Timer.SECOND / 8,
            () => {
                this.tint = colors[current];
                current = (current + 1) % colors.length;
            },
            this
        );
    }
}

BolaAzul_vc_jc.Heart = Heart;