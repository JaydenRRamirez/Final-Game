// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 200
            }
        }
    },

    width: 720,
    height: 720,
    scene: [Load, Title, MainCity, MonochromeCity, RealCity, RealPlatformer, MonochromeShooter, NPC1Dialogue, NPC2Dialogue, NPC3Dialogue, NPC4Dialogue, NPC5Dialogue, NPC6Dialogue, NPC7Dialogue, NPC8Dialogue, NPC9Dialogue, NPC10Dialogue, NPC11Dialogue, Ending]
}

var cursors;
const SCALE = 2.0;
var my = {sprite: {}};
var bgm = null;

const game = new Phaser.Game(config);