"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const Constants_1 = require("../Constants");
const RocketLauncher_1 = __importDefault(require("./RocketLauncher"));
class Enemy extends phaser_1.default.Physics.Matter.Sprite {
    /**
     * @param {Level} scene The scene to which this enemy belongs
     * @param {number} level The level of the enemy, higher level enemies are generally stronger, the lowest is 0 and the highest is (currently) 3
     * @param {number} x The initial x coordinate of the enemy in the scene
     * @param {number} y The initial y coordinate of the enemy in the scene
     * @param {number} rotation The rotation of the enemy when spawning
     * @param {number} velocity The velocity of the enemy when spawning. velocity on x and y axes are calculated from this and rotation.
     * Default is randomised based on level
     */
    constructor(scene, level, x, y, rotation, velocity = null) {
        super(scene.matter.world, x, y, 'enemy' + (level + 1));
        this.scene = scene;
        this.rotation = rotation;
        this.setBounce(0.6);
        this.value = Constants_1.EnemyConstants.VALUE_POINTS[level];
        this.health = Constants_1.EnemyConstants.HEALTH_VALUES[level];
        this.maxVelocity = velocity !== null && velocity !== void 0 ? velocity : phaser_1.default.Math.FloatBetween(Constants_1.EnemyConstants.MAX_VELOCITY_MAX_VALUES[level], Constants_1.EnemyConstants.MAX_VELOCITY_MAX_VALUES[level]);
        this.setScale(Constants_1.EnemyConstants.SCALE_FACTORS[level]);
        this.setFriction(Constants_1.EnemyConstants.FRICTION, Constants_1.EnemyConstants.FRICTION_AIR);
        this.setDensity(Constants_1.EnemyConstants.DENSITIES[level]);
        this.rockets = scene.add.group();
        this.rocketLauncher = new RocketLauncher_1.default(this);
        this.rocketLauncher.setOperation(true, Constants_1.EnemyConstants.FIRE_TYPES[level], level + 1, Constants_1.EnemyConstants.FIRE_RATES[level], Constants_1.EnemyConstants.ROCKET_COUNTS[level], Constants_1.EnemyConstants.ROCKET_VELOCITIES[level], Constants_1.EnemyConstants.TARGET_OPTIONS[level]);
        this.setCollisionCategory(Constants_1.EnemyConstants.COLLISION_CATEGORY);
        this.setCollidesWith(Constants_1.LevelConstants.WALLS_COLLISION_CATEGORY | Constants_1.PlayerConstants.COLLISION_CATEGORY | Constants_1.PlayerConstants.ROCKET_COLLISION_CATEGORY);
        this.untint = scene.time.addEvent({});
    }
    takeDamage(damage = 1, byPlayer = false) {
        this.setTint(0xff0000);
        this.untint.remove();
        this.untint = this.scene.time.addEvent({
            delay: 200,
            callback: () => { this.setTint(0xffffff); },
            callbackScope: this,
        });
        this.health -= damage;
        if (this.health <= 0) {
            if (byPlayer)
                this.scene.player.score += this.value;
            this.destroy();
        }
    }
    rotationToPlayer() {
        return Math.atan2(this.scene.player.y - this.y, this.scene.player.x - this.x);
    }
    update() {
        this.thrust(this.maxVelocity * Constants_1.EnemyConstants.FRICTION_AIR * this.body.mass / Constants_1.LevelConstants.DELTA_TIME_SQUARED);
        this.rockets.children.iterate(child => {
            if (child) {
                child.update();
            }
            return true;
        });
        if (this.scene.outOfBounds(this))
            this.destroy();
    }
    destroy() {
        this.rocketLauncher.destroy();
        this.untint.destroy();
        super.destroy();
    }
}
exports.default = Enemy;
