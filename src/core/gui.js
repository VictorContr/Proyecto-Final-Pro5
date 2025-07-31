import { BolaAzul_vc_jc } from "../blueball.js";
import { Panel } from "./panel.js";
export class Gui {
    constructor(level) {
        this.game = level.game;
        this.level = level;

        this.layer = this.game.add.group(this.level.layers);
        this.layer.fixedToCamera = true;

        // Egg counter panel
        this.createEggCounter();
        
        // Powers panel
        this.createPowersPanel();
        
        // Initial layout
        this.resize(this.game.width, this.game.height);
        this.showAvailablePowers();
    }

    createEggCounter() {
        const { tileSize } = this.level;
        this.eggCounter = new BolaAzul_vc_jc.Panel(
            this.game, 0, 0, 
            tileSize.width + 20, 
            (tileSize.height * 2) + 10
        );
        this.eggCounter.alpha = 0.75;
        this.layer.add(this.eggCounter);

        // Egg icon
        this.eggCounterImage = this.eggCounter.addChild(
            this.game.make.sprite(this.eggCounter.width / 2, 5, 'eggSprites', "shootHorizontal")
        );
        this.eggCounterImage.width = tileSize.width;
        this.eggCounterImage.height = tileSize.height;
        this.eggCounterImage.anchor.set(0.5, 0);

        // Counter text
        this.eggCounterText = this.eggCounter.addChild(
            this.game.make.text(
                this.eggCounter.width / 2, 
                tileSize.height + 5, 
                '0', 
                {
                    font: `${tileSize.width}px Arial`,
                    fill: '#ffffff',
                    align: 'center'
                }
            )
        );
        this.eggCounterText.setShadow(2, 0, '#666666');
        this.eggCounterText.anchor.set(0.5, 0);
    }

    createPowersPanel() {
        const { tileSize } = this.level;
        this.powers = new BolaAzul_vc_jc.Panel(
            this.game, 0, 0, 
            tileSize.width + 20, 
            (tileSize.height * 3) + 10
        );
        this.layer.add(this.powers);

        // Power icons
        const powerTypes = [
            { property: 'powerArrowImage', key: 'powerArrow' },
            { property: 'powerBridgeImage', key: 'powerBridge' },
            { property: 'powerHammerImage', key: 'powerHammer' }
        ];

        let y = 5;
        powerTypes.forEach(({ property, key }) => {
            const sprite = this.powers.addChild(
                this.game.make.sprite(10, y, 'tileSprites', key)
            );
            sprite.width = tileSize.width;
            sprite.height = tileSize.height;
            sprite.visible = false;
            this[property] = sprite;
            y += sprite.height;
        });

        // Empty power indicators
        [
            { property: 'powerArrowEmptyImage', parent: 'powerArrowImage' },
            { property: 'powerBridgeEmptyImage', parent: 'powerBridgeImage' },
            { property: 'powerHammerEmptyImage', parent: 'powerHammerImage' }
        ].forEach(({ property, parent }) => {
            const parentSprite = this[parent];
            const sprite = this.powers.addChild(
                this.game.make.sprite(
                    parentSprite.x, 
                    parentSprite.y, 
                    'tileSprites', 
                    'powerEmpty'
                )
            );
            sprite.width = parentSprite.width;
            sprite.height = parentSprite.height;
            sprite.visible = false;
            this[property] = sprite;
        });
    }

    resize(width, height) {
        const { layers, map, tileSize } = this.level;
        const x = layers.x > 0 
            ? (map.width * map.tileWidth) + 25 
            : width - (tileSize.width + 50);
        
        this.eggCounter.x = x;
        this.powers.x = x;

        if (layers.y > 0) {
            this.eggCounter.y = 25;
            this.powers.y = (map.height * map.tileHeight) - (this.powers.height + 25);
        } else {
            this.eggCounter.y = layers.y + 100;
            this.powers.y = height - ((tileSize.height * 3) + 200);
        }
    }

    setEggCount(count) {
        this.eggCounterText.text = count.toString();
    }

    setPower(power, status) {
        const powerMap = {
            arrow: ['powerArrowImage', 'powerArrowEmptyImage'],
            bridge: ['powerBridgeImage', 'powerBridgeEmptyImage'],
            hammer: ['powerHammerImage', 'powerHammerEmptyImage']
        };

        const [spriteProp, emptyProp] = powerMap[power] || [];
        if (!spriteProp || !emptyProp) return;

        const sprite = this[spriteProp];
        const empty = this[emptyProp];

        switch (status) {
            case 'available':
                sprite.visible = true;
                sprite.alpha = 1;
                empty.visible = false;
                break;
            case 'unavailable':
                sprite.visible = true;
                sprite.alpha = 0.5;
                empty.visible = false;
                break;
            case 'empty':
                sprite.visible = false;
                empty.visible = true;
                break;
            case 'hidden':
                sprite.visible = false;
                empty.visible = false;
                break;
        }

        // Update powers panel visibility
        const powerElements = [
            'powerArrowImage', 'powerBridgeImage', 'powerHammerImage',
            'powerArrowEmptyImage', 'powerBridgeEmptyImage', 'powerHammerEmptyImage'
        ];
        this.powers.visible = powerElements.some(prop => this[prop].visible);
    }

    showAvailablePowers() {
        const { powers } = this.level.map.properties;
        if (!powers) return;

        Object.entries(powers).forEach(([power, value]) => {
            if (value && value.length > 0) {
                this.setPower(power, 'unavailable');
            }
        });
    }
}

BolaAzul_vc_jc.Gui = Gui;