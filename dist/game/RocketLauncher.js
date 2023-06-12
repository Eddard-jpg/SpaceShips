"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const Rocket_1 = __importDefault(require("./Rocket"));
class RocketLauncher {
    /**
     *
     * @param {Player | Enemy} source
     */
    constructor(source) {
        this.source = source;
        this.launchEvents = [];
    }
    /**
     * Sets the rocket launcher operation
     * @param {boolean} isEnemy Whether the rockets will be fired from an enemy.
     * @param {number} rocketType Type of rocket, only affects its appearance.
     * @param {number} fireType Way of firing rockets.
     * @param {number} fireRate Fire Rate, Rockets are fired every 100/rate seconds.
     * @param {number} rocketCount Number of rockets fired at once.
     * @param {number} rocketVelocity Rockets velocity.
     * @param {boolean} isTargeted Whether the rocket is targeted to the player
     */
    setOperation(isEnemy, fireType, rocketType, fireRate, rocketCount, rocketVelocity, isTargeted = false) {
        this.launchEvents.push(this.source.scene.time.addEvent({
            delay: 100000 / fireRate,
            callback: [
                this.launchStraight,
                this.launchArc,
                this.launch360,
                this.launchRandom
            ][fireType],
            callbackScope: this,
            loop: true,
            args: [isEnemy, rocketType, rocketCount, rocketVelocity, isTargeted]
        }));
    }
    launchOnce(isEnemy, fireType, rocketType, rocketCount, rocketVelocity) {
        [
            this.launchStraight.bind(this),
            this.launchArc.bind(this),
            this.launch360.bind(this),
            this.launchRandom.bind(this)
        ][fireType](isEnemy, rocketType, rocketCount, rocketVelocity, false);
    }
    launchStraight(isEnemy, rocketType, rocketCount, rocketVelocity, isTargeted) {
        console.log(this);
        var rotation = isTargeted ? this.source.rotationToPlayer() : this.source.rotation;
        var range = this.source.displayWidth;
        var positionStep = {
            x: range / rocketCount * Math.cos(rotation + Math.PI / 2),
            y: range / rocketCount * Math.sin(rotation + Math.PI / 2)
        };
        var startingPosition = {
            x: this.source.x - (rocketCount / 2 - 0.5) * positionStep.x,
            y: this.source.y - (rocketCount / 2 - 0.5) * positionStep.y
        };
        for (let i = 0; i < rocketCount; i++)
            new Rocket_1.default(this.source, isEnemy, rocketType, startingPosition.x + i * positionStep.x, startingPosition.y + i * positionStep.y, rotation, rocketVelocity);
    }
    launchArc(isEnemy, rocketType, rocketCount, rocketVelocity, isTargeted) {
        // max 10 degrees difference between each rocket, max 90 degrees arc made of all rockets.
        var rotationStep = Math.PI / Math.max(rocketCount * 2, 18);
        var startingRotation = (isTargeted ? this.source.rotationToPlayer() : this.source.rotation) - (rocketCount / 2 - 0.5) * rotationStep;
        for (let i = 0; i < rocketCount; i++)
            new Rocket_1.default(this.source, isEnemy, rocketType, this.source.x, this.source.y, startingRotation + i * rotationStep, rocketVelocity);
    }
    launch360(isEnemy, rocketType, rocketCount, rocketVelocity, isTargeted) {
        var rotationStep = (Math.PI * 2 / rocketCount);
        var startingRotation = isTargeted ? this.source.rotationToPlayer() : this.source.rotation;
        for (let i = 0; i < rocketCount; i++)
            new Rocket_1.default(this.source, isEnemy, rocketType, this.source.x, this.source.y, startingRotation + i * rotationStep, rocketVelocity);
    }
    launchRandom(isEnemy, rocketType, rocketCount, rocketVelocity, isTargeted) {
        var random = phaser_1.default.Math.FloatBetween(0, 3);
        if (random < 1) {
            this.launchStraight(isEnemy, rocketType, rocketCount, rocketVelocity, isTargeted);
        }
        else if (random < 2) {
            this.launchArc(isEnemy, rocketType, rocketCount, rocketVelocity, isTargeted);
        }
        else {
            this.launch360(isEnemy, rocketType, rocketCount, rocketVelocity, isTargeted);
        }
    }
    destroy() {
        this.launchEvents.forEach(event => event.remove());
    }
}
exports.default = RocketLauncher;
