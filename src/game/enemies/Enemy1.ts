import type Level from "../Level";
import Enemy from "../Enemy";
import RocketLauncher from "../RocketLauncher";

export default class Enemy1 extends Enemy {

    constructor(scene: Level, config: EnemyConfig) {
        super(scene, 1, config);

        this.level = 1;

        this.health = 1 * (config.multipliers.health ?? 1);
        this.value = 2 * (config.multipliers.value ?? 1);

        this.maxVelocity = Phaser.Math.FloatBetween(1.75, 3.25) * (config.multipliers.velocity ?? 1);
        this.maxAngularVelocity = 0.025 * (config.multipliers.angularVelocity ?? 1);

        this.setScale(1 * (config.multipliers.scale ?? 1));
        this.setDensity(0.0008 * (config.multipliers.density ?? 1));

        this.rocketLauncher = new RocketLauncher(this);

        config.rocketLauncherConfig?.OperationConfigs?.forEach(operationConfig => this.rocketLauncher.addOperation(operationConfig));

    }

}