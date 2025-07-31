import { BolaAzul_vc_jc } from "../../blueball.js";
import { Mobile } from "../mobile.js";
export class Block extends BolaAzul_vc_jc.Mobile {
    static tilesThatCollide = BolaAzul_vc_jc.Ayudante_vc_jc.obtenerIdsTiles_vc_jc('Rock', 'Bush', 'Lava', 'Wall', 'Water');

    constructor(game, x, y) {
        super(game, x, y, 'tileSprites', 'block', {
            gid: BolaAzul_vc_jc.Global_vc_jc.Entities.Block
        });
    }
}

BolaAzul_vc_jc.Block = Block;