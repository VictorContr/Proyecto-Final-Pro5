import { BolaAzul_vc_jc } from "../blueball.js";
import { Global_vc_jc } from "../global.js";
import { Entity } from "../entities/entity.js";
import { Heart } from "../entities/goals/heart.js";
import { Cofre_vc_jc } from "../entities/goals/chest.js";
import { PuertaAbierta_vc_jc } from "../entities/goals/door-opened.js";
import { PuertaCerrada_vc_jc } from "../entities/goals/door-closed.js";
import { Escaleras_vc_jc } from "../entities/goals/stairs.js";
import { Block } from "../entities/mobiles/block.js";
import { Snakey } from "../entities/mobiles/snakey.js";
import { Gol } from "../entities/mobiles/gol.js";
import { Leeper } from "../entities/mobiles/leeper.js";
import { Skull } from "../entities/mobiles/skull.js";
import { Rocky } from "../entities/mobiles/rocky.js";
import { Alma } from "../entities/mobiles/alma.js";
import { Medusa } from "../entities/mobiles/medusa.js";
import { DonMedusa } from "../entities/mobiles/don-medusa.js";
import { Player } from "../entities/mobiles/player.js";
import { Keyboard } from "./keyboard.js";
import { Gui } from "./gui.js";

export class Level extends Phaser.State {
    Global_vc_jc = BolaAzul_vc_jc.Global_vc_jc;
    static PHASES = {
        INITIAL: 0,
        HEARTS: 1,
        PEARLS: 2,
        EXITS: 3,
        ENDED: 4
    };

    constructor() {
        super();
        
        this.map = null;
        this.layers = null;
        this.entities = null;
        this.player = null;
        this.exit = null;
        this.waterEgg = null;

        this.onPlayerMoved = null;
        this.onPlayerDead = null;
        this.onPhaseChanged = null;

        this.gui = null;
    }

    init(level) {
        this.levelName = level.name;
        this.levelPath = level.path;
        this.levelNext = level.next;
    }

    preload() {
        this.game.load.json(`map-${this.levelName}`, `assets/tilemaps/${this.levelPath}`);
    }

    create() {
        BolaAzul_vc_jc.Save.saveData('currentLevel', this.levelName);
        this.currentPhase = Level.PHASES.INITIAL;

        this.onPlayerMoved = new Phaser.Signal();
        this.onPlayerDead = new Phaser.Signal();
        this.onPhaseChanged = new Phaser.Signal();
        this.onPlayerDead.add(this.playerDead, this);

        this.playerInput = this.game.device.desktop
            ? new BolaAzul_vc_jc.Keyboard(this.game)
            : new BolaAzul_vc_jc.Keyboard(this.game);

        const tilesetData = this.game.cache.getJSON('tileset-data');
        const mapData = this.game.cache.getJSON(`map-${this.levelName}`);

        this.tileSize = {
            width: tilesetData.tileWidth,
            height: tilesetData.tileHeight
        };

        this.cellSize = {
            width: this.tileSize.width / 2,
            height: this.tileSize.height / 2
        };

        this.layers = this.game.add.group();
        this.entities = this.game.add.group(this.layers);
        this.map = this.game.add.tilemap(null, tilesetData.tileWidth, tilesetData.tileHeight, mapData.width, mapData.height);
        this.map.properties = mapData.properties;

        const tileset = this.map.addTilesetImage('tileset-image');
        tileset.firstgid = 1;
        tileset.tileProperties = tilesetData.tileProperties;

        this.environment = this.map.create('environment', mapData.width, mapData.height, tilesetData.tileWidth, tilesetData.tileHeight, this.layers);
        this.gui = new BolaAzul_vc_jc.Gui(this);

        mapData.environment.forEach((tile, index) => {
            const x = index % mapData.width;
            const y = Math.floor(index / mapData.width);
            const placedTile = this.map.putTile(tile, x, y, this.environment);
            if (placedTile && tileset.tileProperties) {
                Object.assign(placedTile.properties, tileset.tileProperties[tile - tileset.firstgid] || {});
            }
        });

        const entityNames = Object.keys(BolaAzul_vc_jc.Global_vc_jc.Entities);
        this.entities.addMultiple(mapData.entities.map(object => {
            const entityName = entityNames.find(name => BolaAzul_vc_jc.Global_vc_jc.Entities[name] === object.gid);
            if (!entityName || !BolaAzul_vc_jc[entityName]) {
                console.error(`Entity type not found for GID: ${object.gid}`);
                return null;
            }
            
            try {
                // CORRECCIÓN CLAVE: Usar 'new' para instanciar clases ES6
                const sprite = new BolaAzul_vc_jc[entityName](this.game, object.x, object.y);
                
                if (object.properties) {
                    Object.entries(object.properties).forEach(([key, value]) => {
                        if (sprite.hasOwnProperty(key)) {
                            sprite[key] = value;
                        }
                    });
                }
                return sprite;
            } catch (error) {
                console.error(`Error creating entity ${entityName}:`, error);
                return null;
            }
        }).filter(Boolean), true); // Filtrar entidades nulas

        this.player = this.entities.iterate('isPlayer', true, Phaser.Group.RETURN_CHILD);
        if (this.player) {
            this.player.assignInput(this.playerInput);
            this.game.camera.follow(this.player);
            this.entities.bringToTop(this.player);
        } else {
            console.error("Player entity not found!");
        }

        this.layers.bringToTop(this.entities);
        this.layers.bringToTop(this.gui.layer);

        this.resize(this.game.width, this.game.height);
    }

    shutdown() {
        this.entities.destroy(true);
        this.playerInput.destroy();
        
        this.onPlayerDead.remove(this.playerDead, this);
        
        [this.onPlayerMoved, this.onPlayerDead, this.onPhaseChanged].forEach(signal => {
            if (signal) signal.dispose();
        });
    }

    update() {
        if (!this.player) return; // CORRECCIÓN: Salir si player es nulo
        
        this.entities.iterate('toDestroy', true, Phaser.Group.RETURN_NONE, BolaAzul_vc_jc.Ayudante_vc_jc.destruirEntidad_vc_jc);
        this.playerInput.update();

        switch (this.currentPhase) {
            case Level.PHASES.INITIAL:
                if (this.player.isMoving) {
                    this.setCurrentPhase(Level.PHASES.HEARTS);
                }
                break;

            case Level.PHASES.HEARTS:
                if (!this.entities.iterate('isHeart', true, Phaser.Group.RETURN_CHILD)) {
                    this.entities.iterate('esCofre_vc_jc', true, Phaser.Group.RETURN_NONE, BolaAzul_vc_jc.Ayudante_vc_jc.abrirEntidad_vc_jc);
                    this.setCurrentPhase(Level.PHASES.PEARLS);
                }
                break;

            case Level.PHASES.PEARLS:
                if (!this.entities.iterate('estaVacio_vc_jc', false, Phaser.Group.RETURN_CHILD)) {
                    this.entities.iterate('esSalida_vc_jc', true, Phaser.Group.RETURN_NONE, BolaAzul_vc_jc.Ayudante_vc_jc.abrirEntidad_vc_jc);
                    this.setCurrentPhase(Level.PHASES.EXITS);
                }
                break;
        }
    }

    resize(width, height) {
        this.layers.x = Math.max(0, width - this.map.widthInPixels) / 2;
        this.layers.y = Math.max(0, height - this.map.heightInPixels) / 2;
        
        if (this.environment.resize) {
            this.environment.resize(width, height);
        }

        const offsetX = width >= this.map.widthInPixels ? 0 : 50;
        const offsetY = height >= this.map.heightInPixels ? 0 : 50;

        this.game.world.setBounds(
            -offsetX, 
            -offsetY, 
            this.map.widthInPixels + (offsetX * 2), 
            this.map.heightInPixels + (offsetY * 2)
        );

        if (this.playerInput.resize) {
            this.playerInput.resize(width, height);
        }
        
        if (this.gui.resize) {
            this.gui.resize(width, height);
        }
    }

    setCurrentPhase(phase) {
        this.currentPhase = phase;
        if (this.onPhaseChanged) {
            this.onPhaseChanged.dispatch(phase);
        }
    }

    getEntitesAt(x, y) {
        return this.entities.filter(entity => entity.occupy && entity.occupy(x, y), true).list || [];
    }

    catchExit() {
        this.setCurrentPhase(Level.PHASES.ENDED);
        if (this.player) {
            this.player.win();
        }
        
        this.game.time.events.add(Phaser.Timer.HALF, () => {
            BolaAzul_vc_jc.Ayudante_vc_jc.iniciarNivel_vc_jc.call(this, this.levelNext);
        });
    }

    playerDead = () => {
        this.setCurrentPhase(Level.PHASES.ENDED);
        this.game.time.events.add(Phaser.Timer.SECOND, () => {
            BolaAzul_vc_jc.Ayudante_vc_jc.iniciarNivel_vc_jc.call(this, this.levelName);
        });
    }

    blinkHearts(start) {
        this.entities.iterate('isHeart', true, Phaser.Group.RETURN_NONE, entity => {
            if (entity.blink) {
                entity.blink(start);
            }
        });
    }

    getCellPosition(x, y) {
        return {
            x: (x + 1) * this.cellSize.width,
            y: (y + 1) * this.cellSize.height
        };
    }
}

BolaAzul_vc_jc.Level = Level;