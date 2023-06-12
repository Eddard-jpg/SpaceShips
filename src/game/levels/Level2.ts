import Level from "../Level";

export default class Level2 extends Level {

    constructor() {
        super("Level2");
    }

    create(): void {
        super.create();
        this.level = 2;
        this.hint = "";
        this.HUD.init();

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                multipliers: {
                    velocity: 2
                },
            },
            period: 3000,
            minPeriod: 3000,
            startAfter: 3000,
            endAfter: 40100
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 2,
                multipliers: {
                    velocity: 2
                },
            },
            period: 5000,
            minPeriod: 5000,
            startAfter: 10000,
            endAfter: 40100
        });
    }

    update(): void {
        super.update();
    }

}