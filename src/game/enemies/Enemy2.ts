import type Level from "../Level";
import Enemy from "../Enemy";
import RocketLauncher from "../RocketLauncher";

export default class Enemy2 extends Enemy {

    constructor(scene: Level, config: EnemyConfig) {
        super(scene, 2, config);

        this.level = 2;

        this.health = 3 * (config.multipliers.health ?? 1);
        this.value = 5 * (config.multipliers.value ?? 1);

        this.maxVelocity = Phaser.Math.FloatBetween(1.25, 2.75) * (config.multipliers.velocity ?? 1);
        this.maxAngularVelocity = 0.025 * (config.multipliers.angularVelocity ?? 1);

        this.setScale(1.3 * (config.multipliers.scale ?? 1));
        this.setDensity(0.001 * (config.multipliers.density ?? 1));

        this.rocketLauncher = new RocketLauncher(this);

        if (!config.rocketLauncherConfig || config.rocketLauncherConfig.keepDefaults) {
            this.rocketLauncher.addOperation({
                launchEventConfig: {
                    rocketConfig: {
                        type: "rocket2",
                        velocity: 6,
                        isEnemy: true,
                    },
                    presetPattern: "straight",
                    rocketCount: 1,
                },
                fireRate: 50
            });
        }
        config.rocketLauncherConfig?.OperationConfigs?.forEach(operationConfig => this.rocketLauncher.addOperation(operationConfig));
    }

    destroy(): void {
        this.rocketLauncher.destroy();
        super.destroy();
    }

}