import { BolaAzul_vc_jc } from "../blueball.js";
export class Boot extends Phaser.State {
    init() {
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        
        if (!this.game.device.desktop) {
            const sizeChanged = () => {
                this.scale.game.paused = this.scale.isPortrait;
                document.getElementById('orientation').style.display = 
                    this.scale.isPortrait ? 'block' : 'none';
            };
            
            this.scale.onSizeChange.add(sizeChanged, this);
            sizeChanged.call(this);
        }
    }

    preload() {
        this.game.load.image('loading', 'assets/sprites/loading.png');
    }

    create() {
        this.game.state.start('loader');
    }
}

BolaAzul_vc_jc.Boot = Boot;