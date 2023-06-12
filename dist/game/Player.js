"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const Constants_1 = require("../Constants");
const RocketLauncher_1 = __importDefault(require("./RocketLauncher"));
class Player extends phaser_1.default.Physics.Matter.Sprite {
    /**
     * @param {Level} scene The scene to which the player belongs
     * @param {number} x The initial x coordinate of the player in the scene
     * @param {number} y The initial x coordinate of the player in the scene
     */
    constructor(scene, x, y) {
        super(scene.matter.world, x, y, 'player');
        scene.add.existing(this);
        console.log(this.body.mass);
        this.scene = scene;
        this.rotation = -Math.PI / 2;
        this.setBounce(0.6);
        this.setFriction(Constants_1.PlayerConstants.FRICTION, Constants_1.PlayerConstants.FRICTION_AIR);
        this.score = 0;
        this.level = 0;
        this.health = this.maxHealth = Constants_1.PlayerConstants.HEALTH_VALUES[0];
        this.healPeriod = 3000;
        this.healEvent = scene.time.addEvent({
            delay: this.healPeriod,
            callback: this.heal,
            callbackScope: this,
            loop: true,
            paused: true
        });
        this.ammo = this.maxAmmo = 10;
        this.reloadPeriod = 500;
        this.reloadEvent = scene.time.addEvent({
            delay: this.reloadPeriod,
            callback: this.reload,
            callbackScope: this,
            loop: true,
            paused: true
        });
        this.isShielded = false;
        this.shieldDuration = 1500;
        this.rockets = scene.add.group();
        this.rocketLauncher = new RocketLauncher_1.default(this);
        this.setCollisionCategory(Constants_1.PlayerConstants.COLLISION_CATEGORY);
        this.setCollidesWith(Constants_1.LevelConstants.WALLS_COLLISION_CATEGORY | Constants_1.EnemyConstants.COLLISION_CATEGORY | Constants_1.EnemyConstants.ROCKET_COLLISION_CATEGORY);
        // this.setOnCollide((data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
        //     if (data.bodyA.gameObject instanceof Enemy || data.bodyB.gameObject instanceof Enemy) {
        //         this.takeDamage();
        //     }
        // })
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = {
            'w': scene.input.keyboard.addKey(phaser_1.default.Input.Keyboard.KeyCodes.W),
            'a': scene.input.keyboard.addKey(phaser_1.default.Input.Keyboard.KeyCodes.A),
            's': scene.input.keyboard.addKey(phaser_1.default.Input.Keyboard.KeyCodes.S),
            'd': scene.input.keyboard.addKey(phaser_1.default.Input.Keyboard.KeyCodes.D),
        };
        this.spaceBar = scene.input.keyboard.addKey(phaser_1.default.Input.Keyboard.KeyCodes.SPACE);
        console.log(Constants_1.LevelConstants.DELTA_TIME_SQUARED);
    }
    heal() {
        ++this.health;
        if (this.health == this.maxHealth)
            this.healEvent.paused = true;
    }
    reload() {
        ++this.ammo;
        if (this.ammo == this.maxAmmo)
            this.reloadEvent.paused = true;
    }
    takeDamage(damage = 1) {
        if (this.isShielded)
            return;
        this.healEvent.paused = false;
        this.health -= damage;
        this.isShielded = true;
        this.setTint(0xff0000);
        this.unshield = this.scene.time.addEvent({
            delay: this.shieldDuration,
            callback: () => {
                this.isShielded = false;
                this.setTint(0xffffff);
            },
            callbackScope: this
        });
        if (this.health <= 0)
            this.scene.gameOver();
    }
    launchRocket() {
        if (this.ammo == this.maxAmmo)
            this.reloadEvent.paused = false;
        this.ammo--;
        this.rocketLauncher.launchOnce(false, Constants_1.PlayerConstants.FIRE_TYPES[this.level], 1, Constants_1.PlayerConstants.ROCKET_COUNTS[this.level], Constants_1.PlayerConstants.ROCKET_VELOCITIES[this.level]);
    }
    levelUp() {
        this.scene.HUD.levelUp();
        this.level++;
        this.health = this.maxHealth = Constants_1.PlayerConstants.HEALTH_VALUES[this.level];
        this.setScale(Constants_1.PlayerConstants.SCALE_FACTORS[this.level]);
        this.healEvent.paused = true;
    }
    update() {
        if (this.cursors.up.isDown || this.wasd['w'].isDown) {
            this.thrust(Constants_1.PlayerConstants.MAX_VELOCITIES[this.level] * Constants_1.PlayerConstants.FRICTION_AIR * this.body.mass / Constants_1.LevelConstants.DELTA_TIME_SQUARED);
        }
        else if (this.cursors.down.isDown || this.wasd['s'].isDown) {
            this.thrust(-Constants_1.PlayerConstants.MAX_VELOCITIES[this.level] * Constants_1.PlayerConstants.FRICTION_AIR * this.body.mass / Constants_1.LevelConstants.DELTA_TIME_SQUARED);
        }
        // Matter.js considers positive torque to be clockwise.
        if ((this.cursors.left.isDown || this.wasd['a'].isDown)) {
            this.body.torque = -Constants_1.PlayerConstants.MAX_ANGULAR_VELOCITIES[this.level] * Constants_1.PlayerConstants.FRICTION_AIR * this.body.inertia / Constants_1.LevelConstants.DELTA_TIME_SQUARED;
        }
        else if ((this.cursors.right.isDown || this.wasd['d'].isDown)) {
            this.body.torque = Constants_1.PlayerConstants.MAX_ANGULAR_VELOCITIES[this.level] * Constants_1.PlayerConstants.FRICTION_AIR * this.body.inertia / Constants_1.LevelConstants.DELTA_TIME_SQUARED;
        }
        if (phaser_1.default.Input.Keyboard.JustDown(this.spaceBar) && this.ammo > 0) {
            this.launchRocket();
        }
        if (this.level < Constants_1.PlayerConstants.SCORE_THRESHOLD.length && this.score >= Constants_1.PlayerConstants.SCORE_THRESHOLD[this.level]) {
            this.levelUp();
        }
        this.rockets.children.iterate(child => {
            if (child) {
                child.update();
            }
            return true;
        });
    }
    gameOver() {
        this.unshield.remove();
        this.setTint(0x800000);
    }
}
exports.default = Player;
