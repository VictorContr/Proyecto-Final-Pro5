import { BolaAzul_vc_jc } from "../blueball.js";
import { Configurar_vc_jc } from "../config.js";
export class Loader extends Phaser.State {
    preload() {
        const loadingBar = this.add.sprite(160, 240, 'loading');
        loadingBar.anchor.set(0.5, 0.5);
        this.load.setPreloadSprite(loadingBar);

        // Scripts
        
        
        // Assets
        this.load.atlas('dpad', 'assets/skins/dpad.png', 'assets/skins/dpad.json');
        this.load.json('world', `assets/worlds/${BolaAzul_vc_jc.Configurar_vc_jc.world}`);
        
        // Menu assets
        this.load.image('menu_title', 'assets/sprites/menu_title.png');
        this.load.image('menu_start', 'assets/sprites/menu_start.png');
        this.load.image('menu_continue', 'assets/sprites/menu_continue.png');
        this.load.image('menu_erease', 'assets/sprites/menu_erease.png');
        
        // Tilesets
        this.load.json('tileset-data', `assets/tilesets/${BolaAzul_vc_jc.Configurar_vc_jc.tileset}.json`);
        this.load.image('tileset-image', `assets/tilesets/${BolaAzul_vc_jc.Configurar_vc_jc.tileset}.png`);
        
        // Game assets
        this.load.image('stairs', 'assets/sprites/stairs.png');
        this.load.atlas('playerSprites', 'assets/sprites/playerSprites.png', 'assets/sprites/playerSprites.json');
        this.load.atlas('tileSprites', 'assets/tilesets/aol3.png', 'assets/sprites/tileSprites.json');
        this.load.atlas('chestSprites', 'assets/sprites/chestSprites.png', 'assets/sprites/chestSprites.json');
        this.load.atlas('mobSprites', 'assets/sprites/mobSprites.png', 'assets/sprites/mobSprites.json');
        this.load.atlas('eggSprites', 'assets/sprites/eggSprites.png', 'assets/sprites/eggSprites.json');
    }

    create() {
        BolaAzul_vc_jc.Configurar_vc_jc.world = this.cache.getJSON('world');
        this.game.state.start('menu');
    }
}

BolaAzul_vc_jc.Loader = Loader;