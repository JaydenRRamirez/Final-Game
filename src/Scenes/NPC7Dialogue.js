class NPC7Dialogue extends Phaser.Scene {
    constructor() {
        super("NPC7Dialogue");
    }

    create() {
        const text = this.add.text(100, 100, "Ever since they closed down my store, couldn't afford to spring up another shop, so... care to buy some fruits? $5 per pound.", {
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
            this.scene.start("RealCityScene");
        });
    }
}

