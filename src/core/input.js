import { BolaAzul_vc_jc } from "../blueball.js";
export class Input {
    constructor(game) {
        this.game = game;
        this.onShoot = new Phaser.Signal();
        this.onPower = new Phaser.Signal();
        this.onRestart = new Phaser.Signal();
    }

    getDirection() {
        return null;
    }

    update() {}

    resize() {}

    destroy() {
        this.game = null;
        this.onShoot.dispose();
        this.onPower.dispose();
        this.onRestart.dispose();
    }
}

BolaAzul_vc_jc.Input = Input;