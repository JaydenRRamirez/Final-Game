class NPC1Dialogue extends Phaser.Scene {
    constructor() {
        super("NPC1Dialogue");
    }

    create() {
        const text = this.add.text(100, 100, "Hey you! Some snot-nosed punks through a cone onto one of the buildings, think you can climb up there and get it back?", {
            fontSize: "16px",
            fill: "#ffffff",
            wordWrap: { width: 300 }
        });

        const text2 = this.add.text(100, 500, "Press SPACE to start the game. Press UP or DOWN to climb ladders.", {
            fontSize: "16px",
            fill: "#ffffff",
            wordWrap: { width: 300 }
        });

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("RealPlatformerScene");
        });
    }
}