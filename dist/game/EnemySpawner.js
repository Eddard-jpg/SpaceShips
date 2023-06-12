"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const Enemy_1 = __importDefault(require("./Enemy"));
class EnemySpawner {
    /**
     *
     * @param {Level} scene The scene to which this spawns enemies
     * @param {number} level Level of enemies spawned
     * @param {number} period Initial period between spawns in milliseconds.
     * @param {number} minPeriod Minimum possible period in milliseconds
     * @param {number} step Changes the period after each spawn
     * @param {boolean} multiplicative Determines how step changes the period, period is multiplied by step if true, step is added to period in milliseconds otherwise.
     * Note that in order for difficulty to be non-decreasing, it makes sense for step to be in range (0, 1] if true, or (-infinity, 0] otherwise.
     * @param {number} startAfter The time after which the spawning begins in milliseconds. Doesn't start if negative. 0 by default.
     * @param {number} endAfter The time after which the spawning stops in milliseconds. Spawns forever if negative. -1 by default.
     * @param {any} args Arguments passed to spawned enemies.
     */
    constructor(scene, level, period, minPeriod, step, multiplicative, startAfter = 0, endAfter = -1, args = Object()) {
        this.scene = scene;
        this.level = level;
        this.minPeriod = minPeriod;
        this.step = step;
        this.multiplicative = multiplicative;
        this.args = args;
        this.spawnEvent = scene.time.addEvent({
            delay: period,
            callback: this.spawn,
            callbackScope: this,
            loop: true,
            startAt: period,
            paused: true
        });
        if (startAfter >= 0)
            scene.time.addEvent({
                delay: startAfter,
                callback: () => { this.resume(); },
                callbackScope: this
            });
        if (endAfter >= 0)
            scene.time.addEvent({
                delay: endAfter,
                callback: () => { this.pause(); },
                callbackScope: this
            });
    }
    pause() {
        this.spawnEvent.paused = true;
    }
    resume() {
        this.spawnEvent.paused = false;
    }
    spawn() {
        var _a;
        var x = phaser_1.default.Math.FloatBetween(-300, Number(this.scene.game.config.width) + 300);
        var y = phaser_1.default.Math.FloatBetween(-300, Number(this.scene.game.config.height) + 300);
        if (x + 100 > 0 && x - 100 < Number(this.scene.game.config.width) && y + 100 > 0 && y - 100 < Number(this.scene.game.config.height)) { // Spawned inside the scene, change x or y to be outside the scene
            if (phaser_1.default.Math.FloatBetween(0, 1) > 0.5) {
                x = x / 4 + Number(this.scene.game.config.width) + 125;
            }
            else {
                y = y / 4 + Number(this.scene.game.config.height) + 125;
            }
        }
        if (this.args.x != null) {
            x = this.args.x;
        }
        if (this.args.y != null) {
            y = this.args.y;
        }
        let rotation = (_a = this.args.rotation) !== null && _a !== void 0 ? _a : Math.atan2(this.scene.player.y - y, this.scene.player.x - x);
        this.scene.enemies.add(new Enemy_1.default(this.scene, this.level, x, y, rotation, this.args.velocity), true);
        this.spawnEvent.reset({
            delay: Math.max(this.minPeriod, this.multiplicative ?
                this.spawnEvent.delay * this.step :
                this.spawnEvent.delay + this.step),
            callback: this.spawnEvent.callback,
            callbackScope: this.spawnEvent.callbackScope,
            loop: this.spawnEvent.loop,
            startAt: this.spawnEvent.startAt,
            paused: this.spawnEvent.paused
        });
    }
    destroy() {
        this.spawnEvent.remove();
    }
}
exports.default = EnemySpawner;
