class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load townsfolk
        this.load.image("player", "tile_0119.png");
        this.load.image("boat", "tile_0100.png");
        this.load.image("cannonballs", "tile_0121.png");
        this.load.image("background", "cubic-black-coal-blocks-pixel-background-pattern-vector.png");
        this.load.image("npc1", "tile_0321.png");
        this.load.image("npc2", "tile_0483.png");
        this.load.image("npc3", "tile_0126.png");

        // Load tilemap information
        this.load.image("split_monochrome_tiles", "split_monochrome.png");                   // Packed tilemap
        this.load.image("split_real_tiles", "split_real.png");                   // Packed tilemap
        this.load.image("Monochrome_City_tiles", "pirate.png");                   // Packed tilemap
        //this.load.image("Real_City_tiles", "real_city.png");                   // Packed tilemap
        this.load.tilemapTiledJSON("Main City", "Main City.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("Monochrome City", "Monochrome City.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("Real City", "Real City.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("Platform Real", "Platform_Real.tmj");   // Tilemap in JSON

        this.load.spritesheet("Real_City_tiles", "real_city.png", {
            frameWidth: 16,
            frameHeight: 16
        });

    }

    create() {
        

         // ...and pass to the next Scene
         this.scene.start("MainCityScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}