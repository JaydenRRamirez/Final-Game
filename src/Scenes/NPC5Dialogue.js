class NPC5Dialogue extends Phaser.Scene {
    constructor() {
        super("NPC5Dialogue");
    }

    create() {
        const text = this.add.text(100, 100, "My dad and I are the last caretakers to bother with the park, the only time I can actually get close to him... wished he cared a bit more about me, just as much as cares about this old piece of land.", {
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