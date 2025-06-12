class NPC11Dialogue extends Phaser.Scene {
    constructor() {
        super("NPC11Dialogue");
    }

    create() {
        const text = this.add.text(100, 100, "Hey you... why are you looking at me like that? Anyway, go check out more of the city by the right hand road, see if you find any odd jobs or something. If not, guessing you'll be off to the hillside on the downward road?", {
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