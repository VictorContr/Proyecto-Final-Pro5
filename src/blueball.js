
class InicializadorJuego_vc_jc {
    static iniciar_vc_jc() {
        const juego_vc_jc = new Phaser.Game(516, 548, Phaser.AUTO);

        juego_vc_jc.state.add('boot', new BolaAzul_vc_jc.Boot());
        juego_vc_jc.state.add('loader', new BolaAzul_vc_jc.Loader());
        juego_vc_jc.state.add('menu', new BolaAzul_vc_jc.Menu());
        juego_vc_jc.state.add('level', new BolaAzul_vc_jc.Level());

        juego_vc_jc.state.start('boot');
    }
}

class AyudanteJuego_vc_jc {
    static interseccion_vc_jc = (arreglo1_vc_jc, arreglo2_vc_jc) =>
        arreglo1_vc_jc.filter(elemento_vc_jc => arreglo2_vc_jc.includes(elemento_vc_jc));

    static union_vc_jc = (arreglo1_vc_jc, arreglo2_vc_jc) =>
        arreglo1_vc_jc.concat(arreglo2_vc_jc.filter(elemento_vc_jc => !arreglo1_vc_jc.includes(elemento_vc_jc)));

    static obtenerEntidadesDesdeIndices_vc_jc = (indices_vc_jc, entidades_vc_jc) =>
        indices_vc_jc.length > 0
            ? entidades_vc_jc.filter(entidad_vc_jc => indices_vc_jc.includes(entidad_vc_jc.gid))
            : [];

    static obtenerTilesDesdeIndices_vc_jc = (indices_vc_jc, tiles_vc_jc) =>
        indices_vc_jc.length > 0
            ? tiles_vc_jc.filter(tile_vc_jc => indices_vc_jc.includes(tile_vc_jc.index))
            : [];

    static obtenerDireccionHacia_vc_jc = (origen_vc_jc, destino_vc_jc) => {
        const distanciaX_vc_jc = destino_vc_jc.cellPosition.x - origen_vc_jc.cellPosition.x;
        const distanciaY_vc_jc = destino_vc_jc.cellPosition.y - origen_vc_jc.cellPosition.y;

        let direccionPrincipal_vc_jc, direccionSecundaria_vc_jc;

        if (Math.abs(distanciaX_vc_jc) >= Math.abs(distanciaY_vc_jc)) {
            direccionPrincipal_vc_jc = distanciaX_vc_jc >= 0 ? Phaser.Tilemap.EAST : Phaser.Tilemap.WEST;
            direccionSecundaria_vc_jc = distanciaY_vc_jc >= 0 ? Phaser.Tilemap.SOUTH : Phaser.Tilemap.NORTH;
        } else {
            direccionPrincipal_vc_jc = distanciaY_vc_jc >= 0 ? Phaser.Tilemap.SOUTH : Phaser.Tilemap.NORTH;
            direccionSecundaria_vc_jc = distanciaX_vc_jc >= 0 ? Phaser.Tilemap.EAST : Phaser.Tilemap.WEST;
        }

        return {
            principal: direccionPrincipal_vc_jc,
            secondary: direccionSecundaria_vc_jc
        };
    }

    static obtenerIdsTiles_vc_jc = (...clavesTiles_vc_jc) =>
        clavesTiles_vc_jc.reduce((acumulador_vc_jc, clave_vc_jc) =>
            [...acumulador_vc_jc, ...(BolaAzul_vc_jc.Global_vc_jc.Tiles[clave_vc_jc] || [])], []);

    static obtenerIdsEntidades_vc_jc = (...clavesEntidades_vc_jc) =>
        clavesEntidades_vc_jc.map(clave_vc_jc => BolaAzul_vc_jc.Global_vc_jc.Entities[clave_vc_jc]);

    static destruirEntidad_vc_jc = entidad_vc_jc => entidad_vc_jc.destroy(true);

    static abrirEntidad_vc_jc = entidad_vc_jc => entidad_vc_jc.abrir_vc_jc();

    static iniciarNivel_vc_jc = function (nombre_vc_jc) {
        if (nombre_vc_jc === 'menu') {
            this.game.state.start('menu');
        } else {
            const indice_vc_jc = BolaAzul_vc_jc.Configurar_vc_jc.world.levels.findIndex(
                nivel_vc_jc => nivel_vc_jc.name === nombre_vc_jc
            );

            if (indice_vc_jc === -1) return;

            const nivel_vc_jc = BolaAzul_vc_jc.Configurar_vc_jc.world.levels[indice_vc_jc];
            const esUltimoNivel_vc_jc = indice_vc_jc + 1 >= BolaAzul_vc_jc.Configurar_vc_jc.world.levels.length;
            const siguienteNivel_vc_jc = esUltimoNivel_vc_jc
                ? 'menu'
                : BolaAzul_vc_jc.Configurar_vc_jc.world.levels[indice_vc_jc + 1].name;

            this.game.state.start('level', true, false, {
                name: nivel_vc_jc.name,
                path: nivel_vc_jc.path,
                next: siguienteNivel_vc_jc
            });
        }
    }
}

// Objeto principal BolaAzul_vc_jc como namespace
export const BolaAzul_vc_jc = {
    iniciar_vc_jc: InicializadorJuego_vc_jc.iniciar_vc_jc,
    Ayudante_vc_jc: AyudanteJuego_vc_jc
};

export const gameHTML_vc_ga = document.getElementById('game')

// Compatibilidad con clases auxiliares (simuladas o reales)
BolaAzul_vc_jc.Boot = BolaAzul_vc_jc.Boot || class {};
BolaAzul_vc_jc.Loader = BolaAzul_vc_jc.Loader || class {};
BolaAzul_vc_jc.Menu = BolaAzul_vc_jc.Menu || class {};
BolaAzul_vc_jc.Level = BolaAzul_vc_jc.Level || class {};
BolaAzul_vc_jc.Global_vc_jc = BolaAzul_vc_jc.Global_vc_jc || { Tiles: {}, Entities: {} };
BolaAzul_vc_jc.Configurar_vc_jc = BolaAzul_vc_jc.Configurar_vc_jc || { world: { levels: [] } };

// window.addEventListener('load', function () {
//     BolaAzul_vc_jc.iniciar_vc_jc();
// });
