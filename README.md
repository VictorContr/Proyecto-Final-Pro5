# Adventure of Lolo

Este proyecto es una adaptación del clásico juego **Adventure of Lolo**, desarrollado como práctica de programación y videojuegos.

## Descripción

Adventure of Lolo es un juego de puzzles en el que el jugador debe resolver diferentes niveles moviendo al personaje principal, evitando enemigos y utilizando objetos para alcanzar la meta. El objetivo es recoger todos los cofres y llegar a la salida de cada nivel.

## Tecnologías utilizadas

- **[Phaser](libs/phaser.js)**: Framework de desarrollo de videojuegos en JavaScript.
- **JavaScript**: Lenguaje principal del desarrollo.
- **HTML5**: Para la estructura y despliegue del juego en navegadores.
- **Sprites y Atlas**: Gestión de imágenes y animaciones mediante archivos `.png` y `.json`.

## Estructura del proyecto

- `index.html`, `game.html`, `login.html`, `register.html`, `lolo.html`: Archivos principales de la interfaz web y acceso al juego.
- `assets/`: Recursos gráficos y mapas del juego.
  - `images/`: Imágenes generales utilizadas en el juego.
  - `skins/`: Skins y variantes visuales de personajes.
  - `sprites/`: Sprites y animaciones de personajes y objetos.
  - `tilemaps/`: Mapas de niveles en formato tilemap.
  - `tilesets/`: Conjuntos de tiles para construir los mapas.
  - `worlds/`: Configuraciones y datos de los distintos mundos o niveles.
- `css/`: Hojas de estilo para la interfaz y los diálogos.
- `js/`: Scripts JavaScript para la lógica de la aplicación y la interacción de usuario.
- `src/`: Código fuente principal del juego (entidades, lógica, controles, etc.).
- `img/`: Imágenes adicionales para documentación, presentación y recursos gráficos.
- `firebase/`: Scripts para la autenticación y gestión de usuarios con Firebase.
- `php/`: Código backend y APIs.
  - `contact.php`: Script para el formulario de contacto.
  - `libs/`: Librerías PHP necesarias para el backend (instalar con Composer).
- `.gitignore`: Archivos y carpetas excluidos

## Instalación de dependencias PHP

Para que el backend funcione correctamente, debes instalar las librerías necesarias con Composer.  
Abre una terminal y ejecuta los siguientes comandos:

```bash
cd php/libs
composer install
```

Esto descargará e instalará todas las dependencias requeridas.

## Autores

- **Víctor Contreras**
- **Jean Coffi**

---

¡Disfruta jugando y aprendiendo con Adventure of Lolo! Si tienes alguna duda o sugerencia, no dudes en contactarnos a través del formulario de contacto disponible en la sección de ayuda del juego.