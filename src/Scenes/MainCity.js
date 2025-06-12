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
        // Music
        if (bgm) {
            bgm.stop();
        }
        
        bgm = this.sound.add("Main City Theme", { loop: true, volume: 0.5 });
        bgm.play();
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
        let walkables = [0, 8, 9, 10, 11, 12, 13, 14, 15, 17, 34, 35, 36, 37, 38, 39, 40, 41, 51, 62, 63, 64, 65, 66, 67, 68, 69, 85, 86, 87, 88, 89, 90, 91, 102, 103, 104, 105, 106, 405, 406, 407, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 485, 486, 487, 488, 505, 520, 521, 536, 537, 553, 554, 555, 572, 573, 574, 575, 576, 577, 578, 587, 588, 589, 590, 591, 616];

        this.finder = new EasyStar.js();
        this.finder.setGrid(tinyTownGrid);
        this.finder.setAcceptableTiles(walkables);

        this.activeCharacter = my.sprite.player;

        // Input
        this.input.on('pointerup', this.handleClick, this);
        this.cKey = this.input.keyboard.addKey('C');
        this.lowCost = false;

        this.animatedTiles.init(this.map);

        this.createNPC("npc10", {x: 4, y: 7}, [{x: 4, y: 7}, {x: 2, y: 15}]);
        this.createNPC("npc11", {x: 27, y: 25}, [{x: 27, y: 25}, {x: 26, y: 25}]);

        if (!this.lowCost) {
            this.setCost([this.tileset1, this.tileset2]);
            this.lowCost = true;
        } else {
            this.resetCost([this.tileset1, this.tileset2]);
            this.lowCost = false;
        }

        this.input.keyboard.on('keydown-J', () => {
            this.scene.start('NPC1Dialogue')
        })

        this.input.keyboard.on('keydown-L', () => {
            this.scene.start('MonochromeShooterScene')
        })
    }

    update() {
        // Check overlap for dialogue.
        if (!this.hasStartedMinigame && this.npc10 &&
            Phaser.Geom.Intersects.RectangleToRectangle(this.npc10.getBounds(), this.activeCharacter.getBounds())) {
            this.hasStartedMinigame = true;
            this.scene.start("NPC10Dialogue");
        }

        if (!this.dialogueStarted && this.npc11 &&
            Phaser.Geom.Intersects.RectangleToRectangle(this.npc11.getBounds(), this.activeCharacter.getBounds())) {
            this.dialogue = true;
            this.scene.start("NPC11Dialogue");
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

            if (tile && tile.properties && tile.properties.end) {
                console.log(`Entered 'collidecity' tile at (${tileX}, ${tileY})`);
                this.scene.start("EndScene"); 
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

    createNPC(key, startTile, pathTiles) {
        const npc = this.add.sprite(
            this.tileXtoWorld(startTile.x),
            this.tileYtoWorld(startTile.y),
            key
        ).setOrigin(0, 0);

        // Track npcs for overlap check
        if (key === "npc10") {
            this.npc10 = npc;
        }

        if (key === "npc11") {
            this.npc11 = npc;
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
