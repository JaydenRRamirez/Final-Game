class Ending extends Phaser.Scene {
    constructor() {
        super("EndScene");
    }

    create() {
        if (bgm) {
            bgm.stop();
        }
        
        bgm = this.sound.add("Ending Theme", { loop: true, volume: 0.5 });
        bgm.play();
        // Add background
        this.add.image(400, 300, "endscene").setOrigin(0.5).setDepth(-1).setScale(1.5);

        const text = this.add.text(200, 100, "Whether it be the real world, or the world of games, keep your imagination flowing!", {
            fontSize: "20px",
            fill: "#ffffff",
            wordWrap: { width: 300 }
        });

        const text2 = this.add.text(200, 200, "Press SPACE to go back into the world!", {
            fontSize: "16px",
            fill: "#ffffff",
            wordWrap: { width: 300 }
        });

        const text3 = this.add.text(10, 500, "Credits: Jayden Ramirez, Assets: Kenny-Assets, Music: Freesound", {
            fontSize: "16px",
            fill: "#000000",
            wordWrap: { width: 300 }
        });

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("MainCityScene");
        });
    }
}