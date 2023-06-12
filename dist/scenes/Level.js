"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../Constants");
const HUD_1 = __importDefault(require("../game/HUD"));
const Player_1 = __importDefault(require("../game/Player"));
class Level extends Phaser.Scene {
    constructor(config) {
        super(config);
    }
    create() {
        this.gameOverCondition = this.restartCondition = false;
        this.background = this.add.image(0, 0, 'sky').setOrigin(0, 0);
        this.background.setScale(Number(this.game.config.width) / this.background.width, Number(this.game.config.height) / this.background.height);
        this.HUD = new HUD_1.default(this);
        this.player = new Player_1.default(this, Number(this.game.config.width) * 0.5, Number(this.game.config.height) * 0.8);
        this.enemies = this.add.group();
        this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        Object.keys(this.matter.world.walls).forEach(wall => {
            this.matter.world.walls[wall].collisionFilter = {
                category: 1,
                mask: Constants_1.PlayerConstants.COLLISION_CATEGORY,
                group: 0
            };
            this.matter.world.walls[wall].friction = 0;
        });
    }
    update() {
        if (this.pKey.isDown) {
            this.scene.pause();
        }
        if (this.gameOverCondition) {
            if (this.restartCondition && Phaser.Input.Keyboard.JustDown(this.rKey)) {
                this.scene.start('Level1');
            }
            return;
        }
        this.HUD.update();
        this.player.update();
        this.enemies.children.iterate((child) => {
            if (child) {
                child.update();
            }
            return true;
        });
    }
    /**
     * Calculates the euclidean distance between an object and coordinates.
     * @param {Phaser.Physics.Matter.Sprite} object
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    distance(object, x, y) {
        return Math.sqrt((object.x - x) ** 2 + (object.y - y) ** 2);
    }
    /**
     * Determines whether the object is out of the scope of the scene to destroy it.
     * @param {Phaser.Physics.Matter.Sprite} object
     * @returns {boolean}
     */
    outOfBounds(object) {
        return object.x < -600 || object.x > Number(this.game.config.width) + 600 || object.y < -600 || object.y > Number(this.game.config.height) + 600;
    }
    gameOver() {
        this.gameOverCondition = true;
        this.matter.pause();
        this.time.removeAllEvents();
        this.player.gameOver();
        this.HUD.gameOver();
    }
}
exports.default = Level;
