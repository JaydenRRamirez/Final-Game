class MonochromeShooter extends Phaser.Scene {
    constructor() {
        super("MonochromeShooterScene");
    }

    create() {
        if (bgm) {
            bgm.stop();
        }

        bgm = this.sound.add("Monochrome Shooter Theme", { loop: true, volume: 0.5 });
        bgm.play();

        // Background
        this.add.image(400, 300, "background").setOrigin(0.5).setDepth(-1).setScale(1.5);

        // Game settings
        this.playerSpeed = 200;
        this.bulletSpeed = 150;
        this.spawnInterval = 1000;
        this.difficultyTimer = 0;
        this.phase = 0;
        this.maxPhase = 3;
        this.gameOver = false;

        // Player
        this.player = this.physics.add.sprite(300, 300, "boat").setOrigin(0.5);
        this.player.setCollideWorldBounds(true);

        // Bullets
        this.bullets = this.physics.add.group();

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Collision
        this.physics.add.overlap(this.player, this.bullets, this.handleHit, null, this);

        // Spawn loop
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnInterval,
            callback: this.spawnFromAllSides,
            callbackScope: this,
            loop: true
        });
    }

    update(time, delta) {
        if (this.gameOver) return;

        // Movement
        let vx = 0, vy = 0;
        if (this.cursors.left.isDown) vx = -this.playerSpeed;
        if (this.cursors.right.isDown) vx = this.playerSpeed;
        if (this.cursors.up.isDown) vy = -this.playerSpeed;
        if (this.cursors.down.isDown) vy = this.playerSpeed;
        this.player.setVelocity(vx, vy);

        // Increase difficulty over time
        this.difficultyTimer += delta;
        if (this.difficultyTimer > 5000) {
            this.difficultyTimer = 0;
            this.increaseDifficulty();
        }

        // Clean up bullets
        this.bullets.getChildren().forEach(b => {
            if (b.x < -50 || b.x > 850 || b.y < -50 || b.y > 650) {
                b.destroy();
            }
        });
    }

    spawnFromAllSides() {
        if (this.phase >= 0) this.spawnFromLeft();
        if (this.phase >= 1) this.spawnFromBottom();
        if (this.phase >= 2) this.spawnFromRight();
        if (this.phase >= 3) this.spawnFromTop();
    }

    spawnFromLeft() {
        const y = Phaser.Math.Between(0, 600);
        const bullet = this.bullets.create(0, y, "cannonballs").setScale(1.5).setVelocityX(this.bulletSpeed);
        bullet.body.allowGravity = false;
    }

    spawnFromRight() {
        const y = Phaser.Math.Between(0, 600);
        const bullet = this.bullets.create(800, y, "cannonballs").setScale(1.5).setVelocityX(-this.bulletSpeed);
        bullet.body.allowGravity = false;
    }

    spawnFromBottom() {
        const x = Phaser.Math.Between(0, 800);
        const bullet = this.bullets.create(x, 650, "cannonballs").setScale(1.5).setVelocityY(-this.bulletSpeed);
        bullet.body.allowGravity = false;
    }

    spawnFromTop() {
        const x = Phaser.Math.Between(0, 800);
        const bullet = this.bullets.create(x, 0, "cannonballs").setScale(1.5).setVelocityY(this.bulletSpeed);
        bullet.body.allowGravity = false;
    }

    increaseDifficulty() {
        this.bulletSpeed += 20;

        if (this.phase < this.maxPhase) {
            this.phase++;
        }

        if (this.spawnInterval > 500) {
            this.spawnInterval -= 50;
            this.spawnTimer.reset({
                delay: this.spawnInterval,
                callback: this.spawnFromAllSides,
                callbackScope: this,
                loop: true
            });
        }
    }

    handleHit(player, bullet) {
        this.gameOver = true;
        this.physics.pause();
        player.setTint(0xff0000);
        this.add.text(280, 260, "Sunk!", { fontSize: "32px", fill: "#fff", fontFamily: "monospace" });

        this.time.delayedCall(1500, () => {
            this.scene.start("MonochromeCityScene");
        });
    }
}
