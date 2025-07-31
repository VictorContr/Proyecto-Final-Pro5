import { BolaAzul_vc_jc } from "../blueball.js";
import { Global_vc_jc } from "../global.js";
export class Entity extends Phaser.Sprite {
    Global_vc_jc = BolaAzul_vc_jc.Global_vc_jc;
    static tilesThatPreventSpawn = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsTiles_vc_jc(
        'Rock', 'Bush', 'Lava', 'Wall', 'Water', 'Bridge', 
        'Arrow', 'LavaBridge', 'Grass'
    );
    
    static entitiesThatPreventSpawn = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsEntidades_vc_jc(
        'Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leeper', 
        'Medusa', 'Rocky', 'Skull', 'Snakey', 'Cofre_vc_jc', 
        'PuertaCerrada_vc_jc', 'PuertaAbierta_vc_jc', 'Heart'
    );

    constructor(game, x, y, key, frame, options = {}) {
        const level = game.state.getCurrentState();
        const pos = level.getCellPosition(x, y);
        
        super(game, pos.x, pos.y, key, frame);
        
        this.anchor.set(0.5, 0.5);
        
        this.level = level;
        this.width = level.tileSize.width;
        this.height = level.tileSize.height;
        
        this.spawnPosition = { x, y };
        this.cellPosition = { x, y };
        this.toDestroy = false;
        
        this.gid = typeof options.gid === 'number' ? options.gid : -1;
        this.canBePushed = typeof options.canBePushed === 'boolean' ? options.canBePushed : true;
        this.canBeCaptured = typeof options.canBeCaptured === 'boolean' ? options.canBeCaptured : true;
    }

    occupy(x, y) {
        return (
            (x === this.cellPosition.x || x === this.cellPosition.x + 1) && 
            (y === this.cellPosition.y || y === this.cellPosition.y + 1)
        );
    }

    cellsAt(direction) {
        const { x, y } = this.cellPosition;
        let posX = x;
        let posY = y;
        const cells = [];
        const offset = { x: 0, y: 0 };
        const alt = { x: 0, y: 0 };

        switch (direction) {
            case Phaser.Tilemap.NORTH:
                posY--;
                alt.x = 1;
                break;
            case Phaser.Tilemap.EAST:
                posX++;
                offset.x = 1;
                alt.y = 1;
                break;
            case Phaser.Tilemap.SOUTH:
                posY++;
                offset.y = 1;
                alt.x = 1;
                break;
            case Phaser.Tilemap.WEST:
                posX--;
                alt.y = 1;
                break;
            default:
                return cells;
        }

        cells.push(
            { x: posX + offset.x, y: posY + offset.y },
            { x: posX + alt.x + offset.x, y: posY + alt.y + offset.y }
        );
        
        return cells;
    }

    setCellPosition(x, y) {
        const pos = this.level.getCellPosition(x, y);
        this.cellPosition = { x, y };
        [this.x, this.y] = [pos.x, pos.y];
    }

    canRespawnAtPosition(position) {
        const getTileCoords = coord => [coord >> 1, (coord + 1) >> 1];
        const [posx1, posx2] = getTileCoords(position.x);
        const [posy1, posy2] = getTileCoords(position.y);

        const tiles = [
            this.level.map.getTile(posx1, posy1, 'environment', true),
            this.level.map.getTile(posx1, posy2, 'environment', true),
            this.level.map.getTile(posx2, posy1, 'environment', true),
            this.level.map.getTile(posx2, posy2, 'environment', true)
        ];

        if (BolaAzul_vc_jc.Ayudante_vc_jc.obtenerTilesDesdeIndices_vc_jc(
            this.constructor.tilesThatPreventSpawn, 
            tiles
        ).length) {
            return false;
        }

        const entities = [
            ...this.level.getEntitesAt(position.x, position.y),
            ...this.level.getEntitesAt(position.x, position.y + 1),
            ...this.level.getEntitesAt(position.x + 1, position.y),
            ...this.level.getEntitesAt(position.x + 1, position.y + 1)
        ];

        if (BolaAzul_vc_jc.Ayudante_vc_jc.obtenerEntidadesDesdeIndices_vc_jc(
            this.constructor.entitiesThatPreventSpawn, 
            entities
        ).length) {
            return false;
        }

        return true;
    }

    respawn() {
        const spawnPoints = [this.spawnPosition, ...(this.level.map.properties.spawns || [])];
        const spawnPoint = spawnPoints.find(pos => this.canRespawnAtPosition(pos));

        if (spawnPoint) {
            this.setCellPosition(spawnPoint.x, spawnPoint.y);
            this.revive();
        } else {
            // TODO: Handle entity death
        }
    }

    canMoveTo() {
        return false;
    }
}

BolaAzul_vc_jc.Entity = Entity;