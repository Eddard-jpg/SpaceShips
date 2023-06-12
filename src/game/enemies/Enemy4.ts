import type Level from "../Level";
import Enemy from "../Enemy";
import RocketLauncher from "../RocketLauncher";

export default class Enemy4 extends Enemy {

    constructor(scene: Level, config: EnemyConfig) {
        super(scene, 4, config);

        this.level = 4;

        this.health = 20 * (config.multipliers.health ?? 1);
        this.value = 50 * (config.multipliers.value ?? 1);

        this.maxVelocity = (Phaser.Math.FloatBetween(1.25, 2.75)) * (config.multipliers.velocity ?? 1);
        this.maxAngularVelocity = 0.025 * (config.multipliers.angularVelocity ?? 1);

        this.setScale(2 * (config.multipliers.scale ?? 1));
        this.setDensity(0.0013 * (config.multipliers.density ?? 1));

        this.rocketLauncher = new RocketLauncher(this);

        if (!config.rocketLauncherConfig || config.rocketLauncherConfig.keepDefaults) {
            this.rocketLauncher.addOperation({
                launchEventConfig: {
                    rocketConfig: {
                        type: "rocket4",
                        velocity: 10,
                        isEnemy: true,
                    },
                    totalRotationDelta: Math.PI * 2 * (7 / 8),
                    centerRotation: 0,
                    rocketCount: 8,
                },
                fireRate: 200 / 3
            });
            this.rocketLauncher.addOperation({
                launchEventConfig: {
                    rocketConfig: {
                        type: "rocket4",
                        velocity: 10,
                        isEnemy: true,
                    },
                    totalRotationDelta: Math.PI * 2 * (7 / 8),
                    centerRotation: Math.PI / 8,
                    rocketCount: 8,
                },
                startAfter: 750,
                fireRate: 200 / 3
            });
        }
        config.rocketLauncherConfig?.OperationConfigs?.forEach(operationConfig => this.rocketLauncher.addOperation(operationConfig));
    }

    destroy(): void {
        this.rocketLauncher.destroy();
        super.destroy();
    }

}