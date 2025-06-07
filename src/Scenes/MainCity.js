class MainCity extends Phaser.Scene {
    constructor() {
        super("MainCityScene");
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    init() {
        this.TILESIZE = 16;
        this.SCALE = 1.5;
        this.TILEWIDTH = 30;
        this.TILEHEIGHT = 30;
    }

    create() {
        // Tilemap
        this.map = this.add.tilemap("Main City", this.TILESIZE, this.TILESIZE, this.TILEHEIGHT, this.TILEWIDTH);
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
        this.tileset1 = this.map.addTilesetImage("split_real", "split_real_tiles");
        this.tileset2 = this.map.addTilesetImage("split_monochrome", "split_monochrome_tiles");

        // Layers
        this.groundLayer = this.map.createLayer("Buildings", [this.tileset1, this.tileset2], 0, 0);
        this.treesLayer = this.map.createLayer("Roads-Trees", [this.tileset1, this.tileset2], 0, 0);
        this.housesLayer = this.map.createLayer("Window", [this.tileset1, this.tileset2], 0, 0);
        

        // Player
        my.sprite.player = this.add.sprite(this.tileXtoWorld(15), this.tileYtoWorld(15), "player").setOrigin(0,0);

        // Camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(this.SCALE);

        // Pathfinding
        let tinyTownGrid = this.layersToGrid();
        let walkables = [0, 8, 9, 10, 11, 12, 13, 14, 15, 17, 34, 35, 36, 37, 38, 39, 40, 41, 51, 62, 63, 64, 65, 66, 67, 68, 69, 85, 86, 87, 88, 89, 90, 91, 102, 103, 104, 105, 106, 405, 406, 407, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 485, 486, 487, 488, 505, 520, 521, 536, 537, 553, 554, 555, 572, 573, 574, 575, 576, 577, 578, 587, 588, 589, 590, 591];

        this.finder = new EasyStar.js();
        this.finder.setGrid(tinyTownGrid);
        this.finder.setAcceptableTiles(walkables);

        this.activeCharacter = my.sprite.player;

        // Input
        this.input.on('pointerup', this.handleClick, this);
        this.cKey = this.input.keyboard.addKey('C');
        this.lowCost = false;

        this.animatedTiles.init(this.map);

        // Visual debug for collidable tiles
        this.highlightCollidableTiles([this.groundLayer, this.treesLayer, this.housesLayer]);
        if (!this.lowCost) {
            this.setCost([this.tileset1, this.tileset2]);
            this.lowCost = true;
        } else {
            this.resetCost([this.tileset1, this.tileset2]);
            this.lowCost = false;
        }
    }

    update() {

    }

    tileXtoWorld(tileX) {
        return tileX * this.TILESIZE;
    }

    tileYtoWorld(tileY) {
        return tileY * this.TILESIZE;
    }

    layersToGrid() {
        let grid = [];
        let layers = [this.groundLayer, this.treesLayer, this.housesLayer];

        for (let y = 0; y < this.TILEHEIGHT; y++) {
            grid[y] = [];
            for (let x = 0; x < this.TILEWIDTH; x++) {
                let tileID = 0;
                for (let layer of layers) {
                    let tile = layer.getTileAt(x, y);
                    if (tile) tileID = tile.index;
                }
                grid[y][x] = tileID;
            }
        }

        return grid;
    }

    handleClick(pointer) {
        let x = pointer.x / this.SCALE;
        let y = pointer.y / this.SCALE;
        let toX = Math.floor(x / this.TILESIZE);
        let toY = Math.floor(y / this.TILESIZE);
        let fromX = Math.floor(this.activeCharacter.x / this.TILESIZE);
        let fromY = Math.floor(this.activeCharacter.y / this.TILESIZE);

        this.finder.findPath(fromX, fromY, toX, toY, (path) => {
            if (path === null) {
                console.warn("Path was not found.");
            } else {
                this.moveCharacter(path, this.activeCharacter);
            }
        });
        this.finder.calculate();
    }

    moveCharacter(path, character) {
        let tweens = [];
        for (let i = 0; i < path.length - 1; i++) {
            let ex = path[i + 1].x;
            let ey = path[i + 1].y;
            tweens.push({
                x: ex * this.TILESIZE,
                y: ey * this.TILESIZE,
                duration: 200,
                onComplete: () => {
                    this.checkForCollidesTile(ex, ey);
                }
            });
        }

        this.tweens.chain({
            targets: character,
            tweens: tweens
        });
    }

    checkForCollidesTile(tileX, tileY) {
        const layers = [this.groundLayer, this.treesLayer, this.housesLayer];
        for (let layer of layers) {
            let tile = layer.getTileAt(tileX, tileY);
            if (tile && tile.properties && tile.properties.collides) {
                console.log(`Collidable tile entered at (${tileX}, ${tileY})`);
                this.scene.start("MonochromeCityScene");
                break;
            }

            if (tile && tile.properties && tile.properties.collidecity) {
                console.log(`Entered 'collidecity' tile at (${tileX}, ${tileY})`);
                this.scene.start("RealCityScene"); 
                break;
            }
        }
    }

    setCost(tilesets) {
        for (let tileset of tilesets) {
            for (let tileID = tileset.firstgid; tileID < tileset.firstgid + tileset.total; tileID++) {
                let props = tileset.getTileProperties(tileID);
                if (props && props.cost != null) {
                    console.log("setting cost: " + tileID + ":"+ props.cost);
                    this.finder.setTileCost(tileID, props.cost);
                }
            }
        }
    }

    resetCost(tilesets) {
        for (let tileset of tilesets) {
            for (let tileID = tileset.firstgid; tileID < tileset.firstgid + tileset.total; tileID++) {
                let props = tileset.getTileProperties(tileID);
                if (props && props.cost != null) {
                    this.finder.setTileCost(tileID, 1);
                }
            }
        }
    }

    highlightCollidableTiles(layers) {
        layers.forEach(layer => {
            layer.forEachTile(tile => {
                if (tile && tile.properties && tile.properties.collides) {
                    const marker = this.add.rectangle(
                        tile.pixelX + tile.width / 2,
                        tile.pixelY + tile.height / 2,
                        tile.width,
                        tile.height,
                        0xff0000,
                        0.3
                    ).setDepth(1000);
                }
            });
        });
    }
}
