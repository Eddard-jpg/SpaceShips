import Level from "../Level";

export default class Level8 extends Level {

    constructor() {
        super("Level8");
    }

    create(): void {
        super.create();
        this.level = 8;
        this.hint = "Follow The Pattern.\nMake a Strategy.";
        this.HUD.init();

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                multipliers: {
                    value: 100,
                },
            },
            period: 3000,
            minPeriod: 0,
            step: 0,
            multiplicative: false,
            startAfter: 1000,
            endAfter: 1200,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 5,
                x: Number(this.game.config.width) / 2,
                y: -200,
                rotation: Math.PI / 2,
                multipliers: {
                    health: 3,
                    velocity: 0.3,
                },
            },
            period: 3000,
            minPeriod: 0,
            step: 0,
            multiplicative: false,
            startAfter: 10000,
            endAfter: 11000,
        });
    }

    update(): void {
        super.update();
    }

}
