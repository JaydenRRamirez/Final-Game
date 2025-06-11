class MonochromeShooter extends Phaser.Scene {
    constructor() {
        super("MonochromeShooterScene");
    }

    create() {
        // Add background
        this.add.image(400, 300, "background").setOrigin(0.5).setDepth(-1).setScale(1.5);

        // Game settings
        this.playerSpeed = 200;
        this.bulletSpeed = 150;
        this.spawnInterval = 500;
        this.difficultyTimer = 0;
        this.gameOver = false;

        // Player
        this.player = this.physics.add.sprite(750, 300, "boat").setOrigin(0.5);
        this.player.setCollideWorldBounds(true);

        // Bullets group
        this.bullets = this.physics.add.group();

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Timer to spawn cannonballs
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnInterval,
            callback: this.spawnBullet,
            callbackScope: this,
            loop: true
        });

        // Collision detection
        this.physics.add.overlap(this.player, this.bullets, this.handleHit, null, this);
    }

    update(time, delta) {
        if (this.gameOver) return;

        // Movement
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
        } else {
            this.player.setVelocityY(0);
        }

        // Difficulty increases over time
        this.difficultyTimer += delta;
        if (this.difficultyTimer > 5000) {
            this.difficultyTimer = 0;
            this.increaseDifficulty();
        }

        // Remove offscreen cannonballs
        this.bullets.getChildren().forEach(bullet => {
            if (bullet.x > 850 || bullet.x < -50) bullet.destroy();
        });
    }

    spawnBullet() {
        const y = Phaser.Math.Between(0, 720);
        const cannonball = this.bullets.create(0, y, "cannonballs")
            .setOrigin(0.5)
            .setScale(1.5)
            .setVelocityX(this.bulletSpeed);
        cannonball.body.allowGravity = false;
    }

    increaseDifficulty() {
        this.bulletSpeed += 20;
        if (this.spawnInterval > 400) {
            this.spawnInterval -= 100;
            this.spawnTimer.reset({
                delay: this.spawnInterval,
                callback: this.spawnBullet,
                callbackScope: this,
                loop: true
            });
        }
    }

    handleHit(player, bullet) {
        this.gameOver = true;
        this.physics.pause();
        player.setTint(0xff0000);
        this.add.text(280, 260, "You were hit!", { fontSize: "32px", fill: "#fff", fontFamily: "monospace" });

        this.time.delayedCall(1500, () => {
            this.scene.start("MonochromeCityScene");
        });
    }
}