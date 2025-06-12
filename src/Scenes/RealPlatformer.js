class RealPlatformer extends Phaser.Scene {
    constructor() {
        super("RealPlatformerScene");
    }

    create() {
        if (bgm) {
            bgm.stop();
        }
        
        bgm = this.sound.add("Real Platform Theme", { loop: true, volume: 0.5 });
        bgm.play();
        // Load map and tileset
        this.map = this.add.tilemap("Platform Real", 16, 16, 10, 10);
        this.tileset = this.map.addTilesetImage("real_city", "Real_City_tiles");

        // Create layers
        this.wallsLayer = this.map.createLayer("Wall", this.tileset, 0, 0);
        this.platformLayer = this.map.createLayer("Platforms", this.tileset, 0, 0);
        this.platformLayer.setCollisionByProperty({ collides: true });

        // Create player
        my.sprite.player = this.physics.add.sprite(0, 8, "player").setOrigin(0);
        this.activeCharacter = my.sprite.player;
        my.sprite.player.body.setSize(8, 12);
        my.sprite.player.body.setOffset(4, 4);
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision with platforms
        this.physics.add.collider(my.sprite.player, this.platformLayer);

        // Set up input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create cone object from Tiled
        this.cone = this.map.createFromObjects("Cone", {
            name: "cone",
            key: "Real_City_tiles",
            frame: 680
        });

        this.coneGroup = this.add.group(this.cone);
        this.physics.world.enable(this.cone, Phaser.Physics.Arcade.STATIC_BODY);

        // Win condition: overlap with cone
        this.physics.add.overlap(my.sprite.player, this.coneGroup, (player, cone) => {
            cone.destroy();
            console.log("Challenge complete!");
            this.scene.start("RealCityScene"); // Replace with the next scene
        });

        // Track ladder status
        this.onLadder = false;

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        my.sprite.player.setCollideWorldBounds(true);
        this.cameras.main.startFollow(my.sprite.player);

        // Setting Camera
        let zoomX = this.scale.width / this.map.widthInPixels;
        let zoomY = this.scale.height / this.map.heightInPixels;
        let zoom = Math.min(zoomX, zoomY);
        this.cameras.main.setZoom(zoom);
    }

    update() {
        const player = my.sprite.player;
        const speed = 100;
        const climbSpeed = 80;

        // Reset ladder state
        this.onLadder = false;

        // Check if overlapping a climbable tile
        const tile = this.platformLayer.getTileAtWorldXY(player.x, player.y);
        if (tile && tile.properties.climb) {
            this.onLadder = true;
        }

        // Horizontal movement
        if (this.cursors.left.isDown) {
            player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            player.setVelocityX(speed);
        } else {
            player.setVelocityX(0);
        }

        // Vertical movement (climbing)
        if (this.onLadder) {
            player.body.setAllowGravity(false);
            if (this.cursors.up.isDown) {
                player.setVelocityY(-climbSpeed);
            } else if (this.cursors.down.isDown) {
                player.setVelocityY(climbSpeed);
            } else {
                player.setVelocityY(0);
            }
        } else {
            player.body.setAllowGravity(true);
        }
    }
}