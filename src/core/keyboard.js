import { BolaAzul_vc_jc } from "../blueball.js";
import { Input } from "./input.js";
export class Keyboard extends BolaAzul_vc_jc.Input {
    constructor(game) {
        super(game);

        this.cursors = game.input.keyboard.createCursorKeys();

        game.input.keyboard.addKey(Phaser.Keyboard.Z).onDown.add(
            () => this.onShoot.dispatch()
        );
        game.input.keyboard.addKey(Phaser.Keyboard.X).onDown.add(
            () => this.onPower.dispatch()
        );

        this.restartKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.restartSended = false;
        this.restartPressTime = Phaser.Timer.SECOND * 3;
    }

    getDirection() {
        let direction = null;
        let directionDuration;

        const checkDirection = (key, dir) => {
            if (key.isDown && (direction === null || key.duration < directionDuration)) {
                direction = dir;
                directionDuration = key.duration;
            }
        };

        checkDirection(this.cursors.up, Phaser.Tilemap.NORTH);
        checkDirection(this.cursors.right, Phaser.Tilemap.EAST);
        checkDirection(this.cursors.down, Phaser.Tilemap.SOUTH);
        checkDirection(this.cursors.left, Phaser.Tilemap.WEST);

        return direction;
    }

    update() {
        if (this.restartKey.isDown) {
            if (!this.restartSended && this.restartKey.duration >= this.restartPressTime) {
                this.onRestart.dispatch();
                this.restartSended = true;
            }
        } else {
            this.restartSended = false;
        }
    }
}

BolaAzul_vc_jc.Keyboard = Keyboard;