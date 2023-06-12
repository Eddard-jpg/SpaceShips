import Level from "../Level";

export default class Level3 extends Level {

    constructor() {
        super("Level3");
    }

    create(): void {
        super.create();
        this.level = 3;
        this.hint = "Try not to stand in one place.";
        this.HUD.init();

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                multipliers: {
                    velocity: 1.5,
                },
            },
            period: 1500,
            minPeriod: 1000,
            step: -50,
            startAfter: 2000,
            endAfter: 30100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                followsPlayer: true,
                multipliers: {
                    scale: 1.3,
                    density: 2.5,
                    health: 4,
                    value: 5,
                },
            },
            period: 1000,
            startAfter: 15000,
            endAfter: 30100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 2,
                multipliers: {
                    velocity: 1.5,
                },
            },
            period: 3000,
            minPeriod: 1000,
            step: -100,
            startAfter: 10000,
            endAfter: 30100,
        });
    }

    update(): void {
        super.update();
    }

}