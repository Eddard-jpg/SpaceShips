import type Level from "../Level";
import Enemy from "../Enemy";
import RocketLauncher from "../RocketLauncher";
import { EnemyConstants, LevelConstants } from "../../Constants";
import { normalizeAngle, rotationAToB } from "../../functions";

export default class Enemy5 extends Enemy {

    constructor(scene: Level, config: EnemyConfig) {
        super(scene, 5, config);

        this.level = 5;

        this.health = 100 * (config.multipliers.health ?? 1);
        this.value = 250 * (config.multipliers.value ?? 1);

        this.maxVelocity = Phaser.Math.FloatBetween(0.4, 0.4) * (config.multipliers.velocity ?? 1);
        this.maxAngularVelocity = 0.001 * (config.multipliers.angularVelocity ?? 1);

        this.setScale(3.5 * (config.multipliers.scale ?? 1));
        this.setDensity(0.003 * (config.multipliers.density ?? 1));

        this.rocketLauncher = new RocketLauncher(this);

        if (!config.rocketLauncherConfig || config.rocketLauncherConfig.keepDefaults) {
            this.rocketLauncher.addOperation({
                launchEventConfig: {
                    rocketConfig: {
                        type: "rocket5",
                        velocity: 7,
                        isEnemy: true,
                    },
                    totalRotationDelta: Math.PI * 2 * (9 / 10),
                    centerRotation: 0,
                    rocketCount: 10,
                },
                fireRate: 100,
                startAfter: 4000,
                resumeFor: 3200,
                pauseFor: 4800
            });

            this.rocketLauncher.addOperation({
                launchEventConfig: {
                    rocketConfig: {
                        type: "rocket5",
                        velocity: 7,
                        isEnemy: true,
                    },
                    totalRotationDelta: Math.PI * 2 * (9 / 10),
                    centerRotation: Math.PI / 10,
                    rocketCount: 10,
                },
                fireRate: 100,
                startAfter: 4500,
                resumeFor: 3200,
                pauseFor: 4800
            });

            this.rocketLauncher.addOperation({
                launchEventConfig: {
                    rocketConfig: {
                        type: "rocket4",
                        velocity: 10,
                        isEnemy: true,
                    },
                    presetPattern: "straight",
                    rocketCount: 7,
                    target: "player"
                },
                fireRate: 100,
                startAfter: 0,
                resumeFor: 3200,
                pauseFor: 4800

            });
        }
        config.rocketLauncherConfig?.OperationConfigs?.forEach(operationConfig => this.rocketLauncher.addOperation(operationConfig));

    }

    update(): void {
        if (this.y < this.scene.cameras.main.height / 2) {
            this.thrust(this.maxVelocity * EnemyConstants.FRICTION_AIR * this.body.mass / LevelConstants.DELTA_TIME_SQUARED);
            let centerDirection = rotationAToB(this, { x: this.scene.cameras.main.width / 2, y: this.scene.cameras.main.height / 2 });
            let myDirection = normalizeAngle(this.rotation);
            if (centerDirection < myDirection) { centerDirection += Math.PI * 2; }

            if (centerDirection - myDirection < myDirection + Math.PI * 2 - centerDirection) {
                this.body.torque = this.maxAngularVelocity * this.body.frictionAir * this.body.inertia / LevelConstants.DELTA_TIME_SQUARED;
            } else {
                this.body.torque = -this.maxAngularVelocity * this.body.frictionAir * this.body.inertia / LevelConstants.DELTA_TIME_SQUARED;
            }
        }
    }

    destroy(): void {
        super.destroy();
    }

}