import type Level from "../Level";
import Enemy from "../Enemy";
import RocketLauncher from "../RocketLauncher";

export default class Enemy3 extends Enemy {

    constructor(scene: Level, config: EnemyConfig) {
        super(scene, 3, config);

        this.level = 3;

        this.health = 7 * (config.multipliers.health ?? 1);
        this.value = 20 * (config.multipliers.value ?? 1);

        this.maxVelocity = (Phaser.Math.FloatBetween(2.25, 3.75)) * (config.multipliers.velocity ?? 1);
        this.maxAngularVelocity = 0.025 * (config.multipliers.angularVelocity ?? 1);

        this.setScale(1.4 * (config.multipliers.scale ?? 1));
        this.setDensity(0.001 * (config.multipliers.density ?? 1));

        this.rocketLauncher = new RocketLauncher(this);

        if (!config.rocketLauncherConfig || config.rocketLauncherConfig.keepDefaults) {
            this.rocketLauncher.addOperation({
                launchEventConfig: {
                    rocketConfig: {
                        type: "rocket3",
                        velocity: 8,
                        isEnemy: true,
                    },
                    presetPattern: "straight",
                    rocketCount: 1,
                    target: "player"
                },
                fireRate: 75
            });
        }
        config.rocketLauncherConfig?.OperationConfigs?.forEach(operationConfig => this.rocketLauncher.addOperation(operationConfig));
    }

    destroy(): void {
        this.rocketLauncher.destroy();
        super.destroy();
    }

}