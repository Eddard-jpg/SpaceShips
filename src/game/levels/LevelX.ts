import Level from "../Level";

export default class LevelX extends Level {

    constructor() {
        super("LevelX");
    }

    create(): void {
        super.create();
        this.level = 'X';
        this.hint="Welcome to Survival Mode.\nGood luck in your endless journey. :3"
        this.HUD.init();

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
            },
            period: 3000,
            minPeriod: 300,
            step: -20,
            multiplicative: false,
            startAfter: 5000,
            endAfter: 120000
        });
        this.spawner.addOperation({
            enemyConfig: {
                type: 2,
            },
            period: 5000,
            minPeriod: 700,
            step: -50,
            multiplicative: false,
            startAfter: 15000,
        });
        this.spawner.addOperation({
            enemyConfig: {
                type: 3,
            },
            period: 15000,
            minPeriod: 7500,
            step: 0.8,
            multiplicative: true,
            startAfter: 45000,
        });
        this.spawner.addOperation({
            enemyConfig: {
                type: 4,
            },
            period: 50000,
            minPeriod: 25000,
            step: 0.7,
            multiplicative: true,
            startAfter: 65000,
        });
        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                multipliers: {
                    velocity: 5,
                    value: 2,
                },
            },
            period: 3000,
            minPeriod: 1000,
            step: 0.99,
            multiplicative: false,
            startAfter: 100000,
        });
        this.spawner.addOperation({
            enemyConfig: {
                type: 5,
            },
            period: 60000,
            minPeriod: 30000,
            step: -15000,
            multiplicative: false,
            startAfter: 125000,
        });
    }

    update(): void {
        super.update();
    }

}
