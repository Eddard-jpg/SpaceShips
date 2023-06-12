import Phaser from "phaser";
import { GameConstants } from "./Constants";
import Menu from "./game/Menu";
import Level0 from "./game/levels/Level0";
import Level1 from "./game/levels/Level1";
import Level2 from "./game/levels/Level2";
import Level3 from "./game/levels/Level3";
import Level4 from "./game/levels/Level4";
import Level5 from "./game/levels/Level5";
import Level6 from "./game/levels/Level6";
import Level7 from "./game/levels/Level7";
import Level8 from "./game/levels/Level8";
import Level9 from "./game/levels/Level9";
import Level10 from "./game/levels/Level10";
import LevelX from "./game/levels/LevelX";

class Preloader extends Phaser.Scene {

    preload() {
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

    create() {
        this.scene.start('Menu');
    }

}

let width = Math.max(GameConstants.MIN_WIDTH, Math.min(GameConstants.MAX_WIDTH, window.innerWidth * 0.97));
let height = Math.max(GameConstants.MIN_HEIGHT, Math.min(GameConstants.MAX_HEIGHT, window.innerHeight * 0.97));
width = GameConstants.ASPECT_RATIO * (height = Math.min(width / GameConstants.ASPECT_RATIO, height));
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth * 0.97,
    height: window.innerHeight * 0.97,
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0 },
            setBounds: true
        }
    },
    scene: [Preloader, Menu,
        Level0, Level1, Level2, Level3, Level4, Level5, Level6, Level7, Level8, Level9, Level10, LevelX]
};

var game = new Phaser.Game(config);