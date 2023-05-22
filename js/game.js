// @ts-nocheck

config = {
    type: Phaser.AUTO,
    width: window.innerWidth * 0.97,
    height: window.innerHeight * 0.97,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: this.preload,
        create: this.create,
        update: this.update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy1', 'assets/enemy1.png');
    this.load.image('enemy2', 'assets/enemy2.png');
    this.load.image('enemy3', 'assets/enemy3.png');
    this.load.image('enemy4', 'assets/enemy4.png');
    this.load.image('enemy5', 'assets/enemy5.png');
    this.load.image('rocket1', 'assets/rocket1.png');
    this.load.image('rocket2', 'assets/rocket2.png');
    this.load.image('rocket3', 'assets/rocket3.png');
    this.load.image('rocket4', 'assets/rocket4.png');
    this.load.image('rocket5', 'assets/rocket5.png');
}

function create() {
    this.scene.add('Main', Main);
    this.scene.start('Main');
}
