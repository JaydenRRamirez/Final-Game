class MonochromeCity extends Phaser.Scene {
    constructor() {
        super("MonochromeCityScene");
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    init() {
        this.TILESIZE = 16;
        this.SCALE = 1.5;
        this.TILEWIDTH = 30;
        this.TILEHEIGHT = 30;
        this.hasStartedMinigame = false;  // Flag to prevent re-triggering
    }

    create() {
        this.map = this.add.tilemap("Monochrome City", this.TILESIZE, this.TILESIZE, this.TILEHEIGHT, this.TILEWIDTH);
        this.tileset = this.map.addTilesetImage("pirate", "Monochrome_City_tiles");
        this.animatedTiles.init(this.map);

        // Create layers
        this.groundLayer = this.map.createLayer("Ocean", this.tileset, 0, 0);
        this.treesLayer = this.map.createLayer("Sand", this.tileset, 0, 0);
        this.housesLayer = this.map.createLayer("Landmarks", this.tileset, 0, 0);
        this.shipsLayer = this.map.createLayer("Ships", this.tileset, 0, 0);
        this.sailLayer = this.map.createLayer("Sail", this.tileset, 0, 0);

        // Player sprite
        my.sprite.player = this.add.sprite(this.tileXtoWorld(27), this.tileYtoWorld(18), "player").setOrigin(0, 0);
        this.activeCharacter = my.sprite.player;

        // Camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(this.SCALE);

        // Pathfinding grid
        const tinyTownGrid = this.layersToGrid();
        const walkables = [0, 1, 2, 3, 4, 5, 20, 21, 22, 37, 38, 39, 55, 56, 72, 73];

        this.finder = new EasyStar.js();
        this.finder.setGrid(tinyTownGrid);
        this.finder.setAcceptableTiles(walkables);

        // Input
        this.input.on('pointerup', this.handleClick, this);
        this.cKey = this.input.keyboard.addKey('C');
        this.lowCost = false;

        // visualize collidable tiles
        this.highlightCollidableTiles([this.groundLayer, this.treesLayer, this.housesLayer]);

        this.createNPC("npc3", {x: 21, y: 8}, [{x: 21, y: 8}, {x: 23, y: 8}]);
        this.createNPC("npc8", {x: 26, y: 19}, [{x: 26, y: 19}, {x: 25, y: 19}]);
        this.createNPC("npc9", {x: 14, y: 11}, [{x: 14, y: 11}, {x: 20, y: 11}]);

        if (!this.lowCost) {
            this.setCost([this.tileset1, this.tileset2]);
            this.lowCost = true;
        } else {
            this.resetCost([this.tileset1, this.tileset2]);
            this.lowCost = false;
        }
    }

    update() {
        // Check overlap with npc1 to start mini-game
        if (!this.hasStartedMinigame && this.npc3 &&
            Phaser.Geom.Intersects.RectangleToRectangle(this.npc3.getBounds(), this.activeCharacter.getBounds())) {
            this.hasStartedMinigame = true;
            this.scene.start("MonochromeShooterScene");
        }
    }

    tileXtoWorld(tileX) {
        return tileX * this.TILESIZE;
    }

    tileYtoWorld(tileY) {
        return tileY * this.TILESIZE;
    }

    layersToGrid() {
        let grid = [];
        let layers = [this.groundLayer, this.treesLayer, this.housesLayer, this.shipsLayer, this.sailLayer];

        for (let y = 0; y < this.TILEHEIGHT; y++) {
            grid[y] = [];
            for (let x = 0; x < this.TILEWIDTH; x++) {
                let tileID = 0;
                for (let layer of layers) {
                    let tile = layer.getTileAt(x, y);
                    if (tile) {
                        tileID = tile.index;
                    }
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

        console.log(`Going from (${fromX}, ${fromY}) to (${toX}, ${toY})`);

        this.finder.findPath(fromX, fromY, toX, toY, (path) => {
            if (!path) {
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
                x: ex * this.map.tileWidth,
                y: ey * this.map.tileHeight,
                duration: 200
            });
        }

        this.tweens.chain({
            targets: character,
            tweens: tweens,
            onComplete: () => {
                let tileX = Math.floor(character.x / this.TILESIZE);
                let tileY = Math.floor(character.y / this.TILESIZE);
                this.checkForCollidesTile(tileX, tileY);
            }
        });
    }

    checkForCollidesTile(tileX, tileY) {
        const layers = [this.groundLayer, this.treesLayer, this.housesLayer];
        for (let layer of layers) {
            let tile = layer.getTileAt(tileX, tileY);
            if (tile && tile.properties && tile.properties.collides) {
                console.log(`Collidable tile entered at (${tileX}, ${tileY})`);
                this.scene.start("MainCityScene");
                break;
            }
        }
    }

    resetCost(tileset) {
        for (let tileID = tileset.firstgid; tileID < tileset.total; tileID++) {
            let props = tileset.getTileProperties(tileID);
            if (props && props.cost != null) {
                this.finder.setTileCost(tileID, 1);
            }
        }
    }

    setCost(tileset) {
        for (let tileID = tileset.firstgid; tileID < tileset.firstgid + tileset.total; tileID++) {
            let props = tileset.getTileProperties(tileID);
            if (props && props.cost != null) {
                this.finder.setTileCost(tileID, props.cost);
            }
        }
    }

    highlightCollidableTiles(layers) {
        layers.forEach(layer => {
            layer.forEachTile(tile => {
                if (tile && tile.properties && tile.properties.collides) {
                    this.add.rectangle(
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

    createNPC(key, startTile, pathTiles) {
        const npc = this.add.sprite(
            this.tileXtoWorld(startTile.x),
            this.tileYtoWorld(startTile.y),
            key
        ).setOrigin(0, 0);

        // Track npc1 for overlap check
        if (key === "npc3") {
            this.npc3 = npc;
        }

        const walkPath = [...pathTiles, ...pathTiles.slice().reverse().slice(1, -1)];

        let currentStep = 0;

        const moveToNext = () => {
            const from = walkPath[currentStep];
            const to = walkPath[(currentStep + 1) % walkPath.length];

            this.finder.findPath(from.x, from.y, to.x, to.y, path => {
                if (path && path.length > 0) {
                    let tweens = path.slice(1).map(p => ({
                        x: this.tileXtoWorld(p.x),
                        y: this.tileYtoWorld(p.y),
                        duration: 300
                    }));

                    this.tweens.chain({
                        targets: npc,
                        tweens: tweens,
                        onComplete: () => {
                            currentStep = (currentStep + 1) % walkPath.length;
                            moveToNext();
                        }
                    });
                } else {
                    console.warn(`NPC '${key}' could not pathfind from (${from.x},${from.y}) to (${to.x},${to.y})`);
                }
            });

            this.finder.calculate();
        };

        moveToNext();
    }

}
