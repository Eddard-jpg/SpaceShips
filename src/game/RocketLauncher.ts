import Phaser from "phaser";
import type Player from "./Player";
import type Enemy from "./Enemy";
import Rocket from "./Rocket";
import { Resolver, Vector } from "matter";
import { rotateVector, rotationAToB } from "../functions";


export default class RocketLauncher {

    source: Player | Enemy;
    operations: Phaser.Time.TimerEvent[];
    launchChoices: any;

    /**
     * 
     * @param source 
     * @param config
     */
    constructor(source: Player | Enemy, config?: RocketLauncherConfig) {
        this.source = source;
        this.launchChoices = {
            "straight": this.launchStraight,
            "arc": this.launchArc,
            "360": this.launch360,
            "random": this.launchRandom
        };
        this.operations = [];
        config?.OperationConfigs?.forEach(operationConfig => this.addOperation(operationConfig));
    }

    /**
     * Adds a rocket launching operation
     * @param {RocketLaunchOperationConfig} config The rocket launching configuration.
     */
    addOperation(config: RocketLaunchOperationConfig) {

        config.launchEventConfig.rocketConfig.damage ??= 1;
        config.launchEventConfig.centerRotation ??= 0;
        config.launchEventConfig.totalRotationDelta ??= 0;
        config.launchEventConfig.centerPosition ??= { x: 0, y: 0 };
        config.launchEventConfig.totalPositionDelta ??= { x: 0, y: 0 };
        config.launchEventConfig.target ??= "relative";
        config.startAfter ??= 0;
        config.resumeFor ??= -1;
        config.pauseFor ??= -1;

        let operation = this.source.scene.time.addEvent({
            delay: 100000 / config.fireRate,
            callback: config.launchEventConfig.presetPattern ? this.launchChoices[config.launchEventConfig.presetPattern] : this.launchCustom,
            callbackScope: this,
            loop: true,
            args: [config.launchEventConfig],
            startAt: 100000 / config.fireRate,
            paused: true
        });

        this.source.scene.time.delayedCall(config.startAfter, this.resumeOperation, [operation, config.resumeFor ?? -1, config.pauseFor ?? -1], this);

        this.operations.push(operation)
    }

    resumeOperation(operation: Phaser.Time.TimerEvent, resumeFor: number, pauseFor: number) {
        if (!operation || this.source.scene == undefined) { return; }

        operation.paused = false;
        operation.elapsed = operation.delay;
        if (resumeFor > 0) { this.source.scene.time.delayedCall(resumeFor, this.pauseOperation, [operation, resumeFor, pauseFor], this); }
    }

    pauseOperation(operation: Phaser.Time.TimerEvent, resumeFor: number, pauseFor: number) {
        if (!operation || this.source.scene == undefined) { return; }

        operation.paused = true;
        if (pauseFor > 0) { this.source.scene.time.delayedCall(pauseFor, this.resumeOperation, [operation, resumeFor, pauseFor], this); }
    }

    launchOnce(config: RocketLaunchEventConfig) {
        if (config.presetPattern) {
            this.launchChoices[config.presetPattern].bind(this)(config);
        } else {
            this.launchCustom(config);
        }
    }

    launchStraight(config: RocketLaunchEventConfig) {
        this.launchCustom({
            rocketConfig: config.rocketConfig,
            rocketCount: config.rocketCount,
            target: config.target,
            centerPosition: { x: 0, y: 0 },
            totalPositionDelta: { x: 0, y: this.source.displayHeight * (1 - 1 / config.rocketCount) },

            centerRotation: 0,
            totalRotationDelta: 0,
        });
    }

    launchArc(config: RocketLaunchEventConfig) {
        this.launchCustom({
            rocketConfig: config.rocketConfig,
            rocketCount: config.rocketCount,
            target: config.target,

            centerPosition: { x: 0, y: 0 },
            totalPositionDelta: { x: 0, y: 0 },

            centerRotation: 0,
            totalRotationDelta: Math.min(Math.PI / 2, Math.PI / 18 * (config.rocketCount - 1)),
        });
    }

    launch360(config: RocketLaunchEventConfig) {
        this.launchCustom({
            rocketConfig: config.rocketConfig,
            rocketCount: config.rocketCount,
            target: config.target,

            centerPosition: { x: 0, y: 0 },
            totalPositionDelta: { x: 0, y: 0 },

            centerRotation: 0,
            totalRotationDelta: Math.PI * 2 * (1 - 1 / config.rocketCount),
        });
    }

    /**
     * Launches a random set pattern of rockets.
     * @param {RocketLaunchEventConfig} config The rocket launching configuration.
     */
    launchRandom(config: RocketLaunchEventConfig) {
        if (config.presetPatternChoices.length == 0) {
            config.presetPatternChoices = ["straight", "arc", "360"];
        }
        this.launchChoices[
            config.presetPatternChoices[
            Math.floor(Phaser.Math.FloatBetween(0, config.presetPatternChoices.length))
            ]
        ].bind(this)(config);
    }

    launchCustom(config: RocketLaunchEventConfig) {

        let centerPosition = {
            x: config.centerPosition.x + this.source.x,
            y: config.centerPosition.y + this.source.y
        };
        let centerRotation: number;

        if (config.target == "player") {
            centerRotation = rotationAToB(centerPosition, this.source.scene.player);
        } else if (config.target == "absolute") {
            centerRotation = config.centerRotation;
        } else {
            centerRotation = config.centerRotation + this.source.rotation;
        }

        let startingRotation = config.rocketCount == 1 ? centerRotation : centerRotation - config.totalRotationDelta / 2;
        let rotationStep = config.rocketCount == 1 ? 0 : config.totalRotationDelta / (config.rocketCount - 1);

        let totalPositionDelta = rotateVector(config.totalPositionDelta, centerRotation);

        let startingPosition: Vector = {
            x: config.rocketCount == 1 ? centerPosition.x : centerPosition.x - totalPositionDelta.x / 2,
            y: config.rocketCount == 1 ? centerPosition.y : centerPosition.y - totalPositionDelta.y / 2,
        }
        let positionStep = {
            x: config.rocketCount == 1 ? 0 : totalPositionDelta.x / (config.rocketCount - 1),
            y: config.rocketCount == 1 ? 0 : totalPositionDelta.y / (config.rocketCount - 1),
        }

        for (let i = 0; i < config.rocketCount; i++) {
            config.rocketConfig.x = startingPosition.x + i * positionStep.x;
            config.rocketConfig.y = startingPosition.y + i * positionStep.y;
            config.rocketConfig.rotation = startingRotation + i * rotationStep;
            new Rocket(this.source, config.rocketConfig);
        }

    }

    destroy() {
        this.operations.forEach(operation => operation.remove());
    }

}