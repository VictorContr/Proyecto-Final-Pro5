import { BolaAzul_vc_jc } from "../../blueball.js";
import { ProjectileEgg } from "../projectiles/projectile-egg.js";
import { Mobile } from "../mobile.js";
export class Player extends BolaAzul_vc_jc.Mobile {
    static tilesThatCollide = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsTiles_vc_jc('Rock', 'Bush', 'Lava', 'Wall', 'Water');
    static entitiesThatCollide = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsEntidades_vc_jc('Alma', 'DonMedusa', 'Gol', 'Leeper', 'Medusa', 'Player', 'Rocky', 'Skull', 'Snakey', 'PuertaCerrada_vc_jc');
    static entitiesThatCanPush = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsEntidades_vc_jc('Block', 'Egg');
    static entitiesThatBridge = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsEntidades_vc_jc('WaterEgg', 'PuertaAbierta_vc_jc');
    static tilesThatArrow = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsTiles_vc_jc('Arrow');

    constructor(game, x, y) {
        // Ensure proper instantiation
        if (!new.target) {
            throw new TypeError("Class constructor Player cannot be invoked without 'new'");
        }
        
        super(game, x, y, 'playerSprites', 'playerDown1', {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.Player
        });

        this.isPlayer = true;

        // Animations
        this.animations.add('Top', Phaser.Animation.generateFrameNames('playerUp', 1, 6, '', 1), 10, true);
        this.animations.add('Right', Phaser.Animation.generateFrameNames('playerRight', 1, 6, '', 1), 10, true);
        this.animations.add('Down', Phaser.Animation.generateFrameNames('playerDown', 1, 6, '', 1), 10, true);
        this.animations.add('Left', Phaser.Animation.generateFrameNames('playerLeft', 1, 6, '', 1), 10, true);
        this.animations.add('Win', Phaser.Animation.generateFrameNames('playerWin', 1, 2, '', 1), 10, true);
        this.animations.add('Die', Phaser.Animation.generateFrameNames('playerDie', 1, 4, '', 1), 10, true);

        this.input = null;
        this._eggs = 0;  // Using private field with getter/setter
        this.hearts = 0;
        this.powers = {
            'arrow': 0,
            'bridge': 0,
            'hammer': 0
        };
        this.lookingAt = Phaser.Tilemap.SOUTH;
        this.lastCellPosition = {
            x: this.cellPosition.x,
            y: this.cellPosition.y
        };
        this.projectile = null;
    }

    get eggs() {
        return this._eggs;
    }

    set eggs(value) {
        this._eggs = value;
        if (this.level?.gui) {
            this.level.gui.setEggCount(value);
        }
    }

    assignInput(input) {
        this.unassignInput();
        this.input = input;
        
        if (input) {
            input.onShoot.add(this.checkShoot, this);
            input.onPower.add(this.checkPower, this);
            input.onRestart.add(this.die, this);
        }
    }

    unassignInput() {
        if (!this.input) return;
        
        this.input.onShoot.remove(this.checkShoot, this);
        this.input.onPower.remove(this.checkPower, this);
        this.input.onRestart.remove(this.die, this);
        
        this.input = null;
    }

    moveTo(direction, wasPushed = false, movementDuration = null) {
        if (!wasPushed && direction !== null) {
            this.lookingAt = direction;
        }
        super.moveTo(direction, wasPushed, movementDuration);
    }

    nextAction() {
        // Update last position if changed
        if (this.lastCellPosition.x !== this.cellPosition.x || 
            this.lastCellPosition.y !== this.cellPosition.y) {
            
            this.lastCellPosition.x = this.cellPosition.x;
            this.lastCellPosition.y = this.cellPosition.y;
            
            if (this.level?.onPlayerMoved) {
                this.level.onPlayerMoved.dispatch(this);
            }
        }

        if (!this.alive) return;

        const direction = this.input?.getDirection?.() ?? null;
        
        if (direction !== null) {
            this.moveTo(direction);
        } else {
            this.stopAnimation(this.lookingAt);
        }
    }

    shoot(direction) {
        if (this.projectile) return false;

        try {
            this.projectile = new BolaAzul_vc_jc.ProjectileEgg(this, direction);
            return true;
        } catch (error) {
            console.error("Error creating projectile:", error);
            return false;
        }
    }

    checkShoot() {
        if (this.eggs > 0) {
            if (this.shoot(this.lookingAt)) {
                this.eggs--;
            }
        }
    }

    lookingAtTile() {
        if (this.cellPosition.x % 2 !== 0 || this.cellPosition.y % 2 !== 0) {
            return null;
        }

        let xTile = this.cellPosition.x >> 1;
        let yTile = this.cellPosition.y >> 1;

        switch (this.lookingAt) {
            case Phaser.Tilemap.NORTH:
                yTile -= 1;
                break;
            case Phaser.Tilemap.EAST:
                xTile += 1;
                break;
            case Phaser.Tilemap.SOUTH:
                yTile += 1;
                break;
            case Phaser.Tilemap.WEST:
                xTile -= 1;
                break;
            default:
                return null;
        }

        return this.level?.map?.getTile?.(xTile, yTile, 'environment', true) || null;
    }

    applyHammerPower(tile) {
        if (!tile || !this.level?.map) return;
        
        this.level.map.putTile(BolaAzul_vc_jc.Global_vc_jc.Tiles.Floor[0], tile.x, tile.y);
        this.markPowerAsUsed('hammer');
    }

    applyArrowPower(tile) {
        if (!tile || !tile.properties || !this.level?.map?.tilesets?.[0]) return;
        
        const tilesThatArrow = BolaAzul_vc_jc.Global_vc_jc.Tiles.Arrow;
        const firstgid = this.level.map.tilesets[0].firstgid;
        let direction = tile.properties.direction;
        
        if (typeof direction === 'undefined') return;
        
        const maxAttempts = 4;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            direction = (direction + 1) % 4;
            attempts++;
            
            const nextTile = tilesThatArrow.find(tileId => {
                const props = this.level.map.tilesets[0].tileProperties[tileId - firstgid];
                return props?.direction === direction;
            });
            
            if (nextTile) {
                const newTile = this.level.map.putTile(nextTile, tile.x, tile.y);
                if (newTile && this.level.map.tilesets[0].tileProperties) {
                    newTile.properties = {
                        ...(this.level.map.tilesets[0].tileProperties[newTile.index - firstgid] || {}),
                        ...(newTile.properties || {})
                    };
                }
                this.markPowerAsUsed('arrow');
                return;
            }
        }
    }

    applyBridgePower(tile) {
        if (!tile || !this.level?.map) return;
        
        const bridgeTile = (this.lookingAt === Phaser.Tilemap.NORTH || this.lookingAt === Phaser.Tilemap.SOUTH)
            ? BolaAzul_vc_jc.Global_vc_jc.Tiles.Bridge[0]
            : BolaAzul_vc_jc.Global_vc_jc.Tiles.Bridge[1];
        
        this.level.map.putTile(bridgeTile, tile.x, tile.y);
        this.markPowerAsUsed('bridge');
    }

    markPowerAsUsed(power) {
        if (!this.powers[power] || this.powers[power] <= 0) return;
        
        this.powers[power] -= 1;
        
        if (!this.level?.gui) return;
        
        const powerStatus = this.powers[power] > 0 ? 'unavailable' : 'empty';
        this.level.gui.setPower(power, powerStatus);

        const counts = this.level.map?.properties?.powers?.[power];
        if (!counts) return;
        
        const next = counts.find(num => num > this.hearts);
        if (typeof next === 'undefined') {
            this.level.gui.setPower(power, 'empty');
        } else {
            this.level.gui.setPower(power, 'unavailable');
        }
    }

    checkPower() {
        const tile = this.lookingAtTile();
        if (!tile) return;
        
        const { Global_vc_jc } = BolaAzul_vc_jc;
        
        if (Global_vc_jc.Tiles.Rock.includes(tile.index) && this.powers.hammer > 0) {
            this.applyHammerPower(tile);
        } 
        else if (Global_vc_jc.Tiles.Arrow.includes(tile.index) && this.powers.arrow > 0) {
            this.applyArrowPower(tile);
        } 
        else if (Global_vc_jc.Tiles.Water.includes(tile.index) && this.powers.bridge > 0) {
            this.applyBridgePower(tile);
        }
    }

    stopAnimation(direction) {
        this.animations.stop();
        
        const frameMap = {
            [Phaser.Tilemap.NORTH]: 0,
            [Phaser.Tilemap.EAST]: 8,
            [Phaser.Tilemap.SOUTH]: 16,
            [Phaser.Tilemap.WEST]: 24
        };
        
        this.frame = frameMap[direction] ?? 10;
    }

    die() {
        if (!this.alive) return;
        
        this.alive = false;
        this.animations.play('Die');
        
        if (this.level?.onPlayerDead) {
            this.level.onPlayerDead.dispatch(this);
        }
    }

    win() {
        if (!this.alive) return;
        
        this.alive = false;
        this.animations.play('Win');
    }

    destroy() {
        this.unassignInput();
        super.destroy(...arguments);
    }

    incHearts() {
        this.hearts++;
        const nextHearts = this.hearts + 1;
        
        if (!this.level?.map?.properties?.powers) return;
        
        Object.keys(this.powers).forEach(power => {
            const counts = this.level.map.properties.powers[power];
            if (!counts) return;
            
            // Check if current heart count unlocks power
            if (counts.includes(this.hearts)) {
                this.powers[power] += 1;
                if (this.level.gui) {
                    this.level.gui.setPower(power, 'available');
                }
                
                // Stop blinking if we just collected
                if (this.level.blinkHearts) {
                    this.level.blinkHearts(false);
                }
            }
            
            // Check if next heart count unlocks power
            if (counts.includes(nextHearts) && this.level.blinkHearts) {
                this.level.blinkHearts(true);
            }
        });
    }
}

BolaAzul_vc_jc.Player = Player;