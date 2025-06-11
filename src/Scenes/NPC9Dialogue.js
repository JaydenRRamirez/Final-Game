class NPC9Dialogue extends Phaser.Scene {
    constructor() {
        super("NPC9Dialogue");
    }

    create() {
        const text = this.add.text(100, 100, "Them Skull Pirates are no joke, lad. Brought our ship down and left us stranded, you have better chances finding a piece of gold on this beach than nabbing their loot over there.", {
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