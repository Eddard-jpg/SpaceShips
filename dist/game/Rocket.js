"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const Constants_1 = require("../Constants");
const Player_1 = __importDefault(require("./Player"));
class Rocket extends phaser_1.default.Physics.Matter.Sprite {
    /**
     * @param {Player | Enemy} source The source of the rocket. Currently only used to set collisions.
     * @param {number} type The type of the rocket. Currently only affects the color.
     * @param {number} x The initial x coordinate of the rocket in the scene.
     * @param {number} y The initial y coordinate of the rocket in the scene.
     * @param {number} rotation The rotation of the rocket when spawning.
     * @param {number} velocity The velocity of the rocket when spawning. velocity on x and y axes are calculated from this and rotation.
     * @param {number} damage The amount of health deducted from the object hit by the rocket.
     * @param {boolean} isEnemy Whether the rocket is shot from an enemy
     */
    constructor(source, isEnemy = false, type, x, y, rotation, velocity, damage = 1) {
        super(source.scene.matter.world, x, y, 'rocket' + type);
        source.rockets.add(this, true);
        this.scene = source.scene;
        this.rotation = rotation;
        this.setVelocity(velocity * Math.cos(rotation), velocity * Math.sin(rotation));
        this.damage = damage;
        // Displace the rocket by source's halfwidth to spawn near the edge instead of the center of the shooter.
        this.x += source.displayWidth / 2 * Math.cos(rotation);
        this.y += source.displayWidth / 2 * Math.sin(rotation);
        this.setSensor(true);
        this.setCollisionCategory(source instanceof Player_1.default ? Constants_1.PlayerConstants.ROCKET_COLLISION_CATEGORY : Constants_1.EnemyConstants.ROCKET_COLLISION_CATEGORY);
        this.setCollidesWith(Constants_1.PlayerConstants.COLLISION_CATEGORY | Constants_1.EnemyConstants.COLLISION_CATEGORY);
        this.setOnCollide((data) => {
            if (!(data.bodyA.gameObject && data.bodyB.gameObject)) {
                return;
            }
            if (this == data.bodyA.gameObject) {
                data.bodyB.gameObject.takeDamage(this.damage, true);
            }
            else {
                data.bodyA.gameObject.takeDamage(this.damage, true);
            }
            this.destroy();
        });
        this.setDepth(1);
        this.setFrictionAir(0);
    }
    update() {
        if (this.scene.outOfBounds(this)) {
            super.destroy();
        }
    }
}
exports.default = Rocket;
