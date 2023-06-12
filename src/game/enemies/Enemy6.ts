import type Level from "../Level";
import Enemy from "../Enemy";
import RocketLauncher from "../RocketLauncher";

export default class Enemy6 extends Enemy {

    constructor(scene: Level, config: EnemyConfig) {
        super(scene, 6, config);

        this.level = 6;

        this.rocketLauncher = new RocketLauncher(this);

        this.rocketLauncher.addOperation({
            launchEventConfig: {
                rocketConfig: {
                    type: "rocket5",
                    velocity: 7,
                    isEnemy: true,
                },
                totalRotationDelta: Math.PI * 2 * (7 / 8),
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
                totalRotationDelta: Math.PI * 2 * (7 / 8),
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

    destroy(): void {
        super.destroy();
    }

}