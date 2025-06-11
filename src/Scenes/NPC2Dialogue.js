class NPC2Dialogue extends Phaser.Scene {
    constructor() {
        super("NPC2Dialogue");
    }

    create() {
        const text = this.add.text(100, 100, "You've tried this hot dog stand? I can't stop buying the special, the walk to the trash can is worth it!", {
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