// @ts-nocheck


class EnemySpawner {

    /**
     * 
     * @param {Phaser.Scene} scene The scene to which this spawns enemies
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

        var x = Phaser.Math.FloatBetween(-0.25 * config.width, 1.25 * config.width);
        var y = Phaser.Math.FloatBetween(-0.25 * config.height, 1.25 * config.height);
        if (x > 0 && x < config.width && y > 0 && y < config.height) { // Spawned inside the scene, change x or y to be outside the scene
            if (Phaser.Math.FloatBetween(0, 1) > 0.5) x = x / 4 + config.width;
            else y = y / 4 + config.height;
        }

        if (this.args.x != null) x = this.args.x;
        if (this.args.y != null) y = this.args.y;

        var rotation = this.args.rotation ?? Math.atan2(this.scene.player.y - y, this.scene.player.x - x) + Math.PI * 0.5;

        new Enemy(this.scene, this.level, x, y, rotation, this.args.velocity);

        if (this.multiplicative)
            this.spawnEvent.delay *= this.step;
        else
            this.spawnEvent.delay += this.step;

        this.spawnEvent.delay = Math.max(this.spawnEvent.delay, this.minPeriod);

    }

    destroy() {
        this.spawnEvent.remove();
    }

}