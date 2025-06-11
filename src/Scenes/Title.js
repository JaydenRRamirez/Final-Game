class Title extends Phaser.Scene {
    constructor() {
        super("TitleScene");
    }

    create() {
        // Add background
        this.add.image(400, 300, "titlecard").setOrigin(0.5).setDepth(-1).setScale(1.5);

        const text = this.add.text(300, 450, "World of Gray", {
            fontSize: "20px",
            fill: "#ffffff",
            wordWrap: { width: 300 }
        });

        const text2 = this.add.text(350, 620, "Press SPACE to go forth into the world!", {
            fontSize: "16px",
            fill: "#ffffff",
            wordWrap: { width: 300 }
        });

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("MainCityScene");
        });
    }
}