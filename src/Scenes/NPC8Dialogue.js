class NPC8Dialogue extends Phaser.Scene {
    constructor() {
        super("NPC8Dialogue");
    }

    create() {
        const text = this.add.text(100, 100, "Hey you! You see that plot of land there? There's a treasure buried underneath the X, but it is heavily guarded by the Skull Pirates, you can take a chance if you want, but its your life.", {
            fontSize: "16px",
            fill: "#ffffff",
            wordWrap: { width: 300 }
        });

        const text2 = this.add.text(100, 500, "Press SPACE to start the game. Use ARROW KEYS to dodge Cannonballs.", {
            fontSize: "16px",
            fill: "#ffffff",
            wordWrap: { width: 300 }
        });

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("MonochromeShooterScene");
        });
    }
}