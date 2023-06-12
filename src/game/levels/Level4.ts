import Level from "../Level";

export default class Level4 extends Level {

    constructor() {
        super("Level4");
    }

    create(): void {
        super.create();
        this.level = 4;
        this.hint = "";
        this.HUD.init();

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                followsPlayer:true,
            },
            period: 1500,
            minPeriod: 1000,
            step: -50,
            startAfter: 2000,
            endAfter: 30100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 2,
            },
            period: 3000,
            minPeriod: 2000,
            step: -100,
            startAfter: 5000,
            endAfter: 30100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 3,
            },
            period: 8000,
            startAfter: 10000,
            endAfter: 30100,
        });
    }

    update(): void {
        super.update();
    }

}