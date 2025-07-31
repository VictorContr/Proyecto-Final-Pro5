import { BolaAzul_vc_jc } from "../blueball.js";
import { Configurar_vc_jc } from "../config.js";
import { Save } from "./save.js";
export class Menu extends Phaser.State {
    constructor() {
        super();
    }

    preload() {
        // Método vacío para pre-carga de assets
    }

    create() {
        // 1) Creamos sprites y botones
        this.title = this.add.sprite(0, 0, 'menu_title');
        this.title.anchor.setTo(0.5, 0.5);

        this.start = this.add.button(0, 0, 'menu_start',
            BolaAzul_vc_jc.Ayudante_vc_jc.iniciarNivel_vc_jc.bind(this, BolaAzul_vc_jc.Configurar_vc_jc.world.firstLevel),
            this
        );
        this.start.anchor.setTo(0.5, 0.5);

        this.continue = this.add.button(0, 0, 'menu_continue',
            BolaAzul_vc_jc.Ayudante_vc_jc.iniciarNivel_vc_jc.bind(this, BolaAzul_vc_jc.Save.loadData('currentLevel')),
            this
        );
        this.continue.anchor.setTo(0.5, 0.5);

        this.erease = this.add.button(0, 0, 'menu_erease', this.callErease.bind(this), this);
        this.erease.anchor.setTo(0.5, 0.5);

        // 2) Mostrar Continue/Erease solo si hay partida guardada
        if (!BolaAzul_vc_jc.Save.loadData('currentLevel')) {
            this.continue.visible = false;
            this.erease.visible = false;
        }

        // 3) Ajustar posiciones y escalados
        this.resize(this.game.width, this.game.height);
    }

    update() {
        // Método vacío para actualización por frame
    }

    shutdown() {
        // Método vacío para limpieza al cerrar el estado
    }

    resize(width, height) {
        // Escalado del título
        let titleScale = Math.min(1, (width * 0.8) / this.title.width);
        this.title.scale.setTo(titleScale, titleScale);
        this.title.x = width / 2;
        this.title.y = height * 0.1;

        // Posiciones verticales proporcionales
        const yStart = height * 0.3;
        const yEnd = height * 0.8;

        const btns = [this.start]
            .concat(this.continue.visible ? this.continue : [])
            .concat(this.erease.visible ? this.erease : []);

        btns.forEach((btn, i) => {
            let s = Math.min(1, (width * 0.6) / btn.width);
            btn.scale.setTo(s, s);
            btn.x = width / 2;
            let t = i / (btns.length - 1 || 1);
            btn.y = yStart + t * (yEnd - yStart);
        });
    }

    callContinue() {
        this.game.state.start(BolaAzul_vc_jc.Save.loadData('currentLevel'));
    }

    callErease() {
        BolaAzul_vc_jc.Save.deleteData('currentLevel');
        this.continue.visible = false;
        this.erease.visible = false;
        this.resize(this.game.width, this.game.height);
    }
}

// Asignamos la clase al namespace BolaAzul_vc_jc
BolaAzul_vc_jc.Menu = Menu;