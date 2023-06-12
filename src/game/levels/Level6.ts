import Level from "../Level";

export default class Level6 extends Level {

    constructor() {
        super("Level6");
    }

    create(): void {
        super.create();
        this.level = 6;
        this.hint = "Some things are meant to be rushed!";
        this.HUD.init();
        
        this.spawner.addOperation({
            enemyConfig: {
                type: 3,
                multipliers: {
                    health: 0.1,
                    velocity: 1.5,
                    scale: 0.7,
                    value: 0.4,
                }
            },
            period: 2000,
            minPeriod: 1000,
            step: 0.95,
            multiplicative: true,
            startAfter: 3000,
            endAfter: 50100,
        });
    }

    update(): void {
        super.update();
    }

}
