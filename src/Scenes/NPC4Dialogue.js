class NPC4Dialogue extends Phaser.Scene {
    constructor() {
        super("NPC4Dialogue");
    }

    create() {
        const text = this.add.text(100, 100, "I'm told off about spending too much time in my own house, and yet my friend can't even be bothered to show up at our designated meetup... though now that I think about it, that gray building has been abandoned for some time.", {
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