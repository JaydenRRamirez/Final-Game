class NPC6Dialogue extends Phaser.Scene {
    constructor() {
        super("NPC6Dialogue");
    }

    create() {
        const text = this.add.text(100, 100, "This is the last part of the city that has any heart and soul left, my son's gotta learn to take care of it, then pass it on to his kid, or it's doomed to die and become another part of concrete waste.", {
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