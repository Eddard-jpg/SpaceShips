import Level from "../Level";

export default class Level5 extends Level {

    constructor() {
        super("Level5");
    }

    create(): void {
        super.create();
        this.level = 5;
        this.hint = "";
        this.HUD.init();

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                followsPlayer: true,
                multipliers: {
                    angularVelocity: 0.5,
                    value: 1.5,
                },
            },
            period: 3000,
            minPeriod: 2000,
            step: -50,
            startAfter: 2000,
            endAfter: 75100,
        });
        this.spawner.addOperation({
            enemyConfig: {
                type: 2,
            },
            period: 5000,
            minPeriod: 4000,
            step: -100,
            startAfter: 5000,
            endAfter: 75100,
        });
        this.spawner.addOperation({
            enemyConfig: {
                type: 3,
            },
            period: 10000,
            startAfter: 25000,
            endAfter: 65100,
        });
        this.spawner.addOperation({
            enemyConfig: {
                type: 4,
            },
            period: 1000,
            startAfter: 30000,
            endAfter: 30100,
        });
        this.spawner.addOperation({
            enemyConfig: {
                type: 4,
                multipliers: {
                    scale: 1.5,
                    health: 2.5,
                    velocity: 0.5,
                }
            },
            period: 1000,
            startAfter: 60000,
            endAfter: 60100,
        });
    }

    update(): void {
        super.update();
    }

}
