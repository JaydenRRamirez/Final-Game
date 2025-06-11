class RealCity extends Phaser.Scene {
    constructor() {
        super("RealCityScene");
    }

    preload() {}

    init() {
        this.TILESIZE = 16;
        this.SCALE = 1.5;
        this.TILEWIDTH = 30;
        this.TILEHEIGHT = 30;

        this.hasStartedMinigame = false;  // Flag to prevent re-triggering
    }

    create() {
        this.map = this.add.tilemap("Real City", this.TILESIZE, this.TILESIZE, this.TILEHEIGHT, this.TILEWIDTH);
        this.tileset = this.map.addTilesetImage("real_city", "Real_City_tiles");

        // Create layers
        this.groundLayer = this.map.createLayer("Road", this.tileset, 0, 0);
        this.sceneryLayer = this.map.createLayer("Scenery", this.tileset, 0, 0);
        this.streetlightLayer = this.map.createLayer("Streetlight", this.tileset, 0, 0);
        this.buildingsLayer = this.map.createLayer("Buildings", this.tileset, 0, 0);
        this.windowsLayer = this.map.createLayer("Windows", this.tileset, 0, 0);

        // Player sprite
        my.sprite.player = this.add.sprite(this.tileXtoWorld(0), this.tileYtoWorld(17), "player").setOrigin(0, 0);
        this.activeCharacter = my.sprite.player;

        // Camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(this.SCALE);

        // Pathfinding grid
        const tinyTownGrid = this.layersToGrid();
        const walkables = [703, 704, 705, 706, 707, 708, 709, 710, 711, 716, 717, 740, 741, 742, 746, 747, 748, 777, 778, 781, 782, 783, 784, 785, 820, 821, 822, 823, 824, 825, 826, 827, 828, 888, 889, 935, 936, 937, 10008, 1009, 1011, 1018, ];

        this.finder = new EasyStar.js();
        this.finder.setGrid(tinyTownGrid);
        this.finder.setAcceptableTiles(walkables);

        // Input
        this.input.on('pointerup', this.handleClick, this);
        this.cKey = this.input.keyboard.addKey('C');
        this.lowCost = false;

        // Visualize collisions
        this.highlightCollidableTiles([
            this.groundLayer,
            this.sceneryLayer,
            this.streetlightLayer,
            this.buildingsLayer,
            this.windowsLayer
        ]);

        // Create NPCs
        this.createNPC("npc1", {x: 23, y: 13}, [{x: 23, y: 13}, {x: 17, y: 27}]);
        this.createNPC("npc2", {x: 20, y: 4}, [{x: 20, y: 4}, {x: 6, y: 6}]);
        this.createNPC("npc4", {x: 2, y: 15}, [{x: 2, y: 15}, {x: 6, y: 29}]);
        this.createNPC("npc5", {x: 1, y: 1}, [{x: 1, y: 1}, {x: 5, y: 1}]);
        this.createNPC("npc6", {x: 5, y: 3}, [{x: 5, y: 3}, {x: 1, y: 3}]);
        this.createNPC("npc7", {x: 20, y: 23}, [{x: 20, y: 23}, {x: 20, y: 27}]);





        // Tile cost
        if (!this.lowCost) {
            this.setCost([this.tileset]);
            this.lowCost = true;
        } else {
            this.resetCost([this.tileset]);
            this.lowCost = false;
        }
    }

    update() {
        // Check overlap with npc1 to start mini-game
        if (!this.hasStartedMinigame && this.npc1 &&
            Phaser.Geom.Intersects.RectangleToRectangle(this.npc1.getBounds(), this.activeCharacter.getBounds())) {
            this.hasStartedMinigame = true;
            this.scene.start("RealPlatformerScene");
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
        let layers = [this.groundLayer, this.sceneryLayer, this.streetlightLayer, this.buildingsLayer, this.windowsLayer];

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
        const layers = [this.groundLayer, this.sceneryLayer, this.streetlightLayer, this.buildingsLayer, this.windowsLayer];
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
        if (key === "npc1") {
            this.npc1 = npc;
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
