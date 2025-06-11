class NPC3Dialogue extends Phaser.Scene {
    constructor() {
        super("NPC3Dialogue");
    }

    create() {
        const text = this.add.text(100, 100, "Oi Mate! Don't go be nearing my treasure... and don't look at my ravaged ship either!", {
            fontSize: "16px",
            fill: "#ffffff",
            wordWrap: { width: 300 }
        });

        const text2 = this.add.text(100, 500, "Press SPACE to continue.", {
            fontSize: "16px",
            fill: "#ffffff",
            wordWrap: { width: 300 }
        });

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("MonochromeCityScene");
        });
    }
}