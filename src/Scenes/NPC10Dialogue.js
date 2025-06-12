class NPC10Dialogue extends Phaser.Scene {
    constructor() {
        super("NPC10Dialogue");
    }

    create() {
        const text = this.add.text(100, 100, "An adventurer like myself spends a lot of time diving into dungeons and selling off loot, speaking of loot, perhaps those pirate lads have something for you on the left hand side here.", {
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
            this.scene.start("MainCityScene");
        });
    }
}