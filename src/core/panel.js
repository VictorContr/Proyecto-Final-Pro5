import { BolaAzul_vc_jc } from "../blueball.js";
export class Panel extends Phaser.Sprite {
    constructor(game, x, y, width, height) {
        const bitmapData = game.add.bitmapData(width, height);
        
        bitmapData.context.fillStyle = '#000000';
        bitmapData.context.strokeStyle = '#202020';
        Panel.drawRoundRect(bitmapData.context, 0, 0, width, height, 10, true, true);

        super(game, x, y, bitmapData);
    }

    static drawRoundRect(context, x, y, width, height, radius = 5, fill = true, stroke = true) {
        // Normalize radius to object format
        const radii = typeof radius === 'number' 
            ? { tl: radius, tr: radius, br: radius, bl: radius }
            : { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };

        const { tl, tr, br, bl } = radii;

        context.beginPath();
        context.moveTo(x + tl, y);
        context.lineTo(x + width - tr, y);
        context.quadraticCurveTo(x + width, y, x + width, y + tr);
        context.lineTo(x + width, y + height - br);
        context.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
        context.lineTo(x + bl, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - bl);
        context.lineTo(x, y + tl);
        context.quadraticCurveTo(x, y, x + tl, y);
        context.closePath();
        
        if (fill) context.fill();
        if (stroke) context.stroke();
    }
}

BolaAzul_vc_jc.Panel = Panel;