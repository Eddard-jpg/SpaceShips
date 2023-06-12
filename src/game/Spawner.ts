import Phaser from "phaser";
import type Level from "./Level";
import Enemy1 from "./enemies/Enemy1";
import Enemy2 from "./enemies/Enemy2";
import Enemy3 from "./enemies/Enemy3";
import Enemy4 from "./enemies/Enemy4";
import Enemy5 from "./enemies/Enemy5";
import Enemy6 from "./enemies/Enemy6";

export default class Spawner {

    static Enemies = [
        undefined,
        Enemy1,
        Enemy2,
        Enemy3,
        Enemy4,
        Enemy5,
        Enemy6
    ];

    scene: Level;
    operations: Phaser.Time.TimerEvent[] = [];
    index: number = 0;

    /**
     * Handles Spawning enemies for the level.
     * @param {Level} scene The scene to which this spawns enemies.
     */
    constructor(scene: Level) {
        this.scene = scene;
    }

    addOperation(config: SpawnOperationConfig) {
        config.minPeriod ??= 100;
        config.multiplicative ??= false;
        config.step ??= +config.multiplicative;
        config.startAfter ??= 0;
        config.endAfter ??= -1;

        config.enemyConfig.multipliers ??= {};
        
        this.scene.activeSpawnOperationCount++;
        let operation = this.scene.time.addEvent({
            delay: config.period,
            callback: this.spawn,
            callbackScope: this,
            loop: true,
            startAt: config.period,
            paused: true,
            args: [config, this.index++],
        });


        this.scene.time.delayedCall(config.startAfter, this.resumeOperation, [operation], this);
        if (config.endAfter >= config.startAfter) { this.scene.time.delayedCall(config.endAfter, this.pauseOperation, [operation], this); }

        this.operations.push(operation);
    }

    pauseOperation(operation: Phaser.Time.TimerEvent) {
        operation.paused = true;
        this.scene.activeSpawnOperationCount--;
    }

    resumeOperation(operation: Phaser.Time.TimerEvent) {
        operation.paused = false;
    }

    spawn(config: SpawnOperationConfig, operationIndex: number) {

        let x = config.enemyConfig.x ?? Phaser.Math.FloatBetween(-600, Number(this.scene.game.config.width) + 600);
        let y = config.enemyConfig.y ?? Phaser.Math.FloatBetween(-600, Number(this.scene.game.config.height) + 600);

        // If spawned inside the scene, unless the x and y are set by config (intended to be inside the scene), change x or y to be outside.
        if ((config.enemyConfig.x == undefined || config.enemyConfig.y == undefined) &&
            x + 200 > 0 && x - 200 < Number(this.scene.game.config.width) &&
            y + 200 > 0 && y - 200 < Number(this.scene.game.config.height)) {

            // If one is set by config, change the other. Otherwise choose randomly which to change.
            if (config.enemyConfig.x != undefined || (config.enemyConfig.y == undefined && Phaser.Math.FloatBetween(0, 1) > 0.5)) {
                y = y / 4 + Number(this.scene.game.config.height) + 200;
            } else {
                x = x / 4 + Number(this.scene.game.config.width) + 200;
            }
        }

        let rotation: number = config.enemyConfig.rotation ?? Math.atan2(this.scene.player.y - y, this.scene.player.x - x);

        let enemyConfig = { ...config.enemyConfig };
        enemyConfig.x = x;
        enemyConfig.y = y;
        enemyConfig.rotation = rotation;

        this.scene.enemies.add(new Spawner.Enemies[config.enemyConfig.type](this.scene, enemyConfig), true);

        let operation = this.operations[operationIndex];

        operation.reset({
            delay: Math.max(
                config.minPeriod,
                config.multiplicative ?
                    operation.delay * config.step :
                    operation.delay + config.step
            ),
            callback: this.spawn,
            callbackScope: this,
            loop: true,
            args: [config, operationIndex]
        });

    }

    destroy() {
        this.operations.forEach(operation => { operation.remove() });
    }

}