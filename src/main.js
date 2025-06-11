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
    scene: [Load, MainCity, MonochromeCity, RealCity, RealPlatformer, MonochromeShooter]
}

var cursors;
const SCALE = 2.0;
var my = {sprite: {}};

const game = new Phaser.Game(config);