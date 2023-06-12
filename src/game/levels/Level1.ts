import Level from "../Level";

export default class Level1 extends Level {

    constructor() {
        super("Level1");
    }

    create(): void {
        super.create();
        this.level = 1;
        this.hint = "";
        this.HUD.init();

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
            },
            period: 4000,
            startAfter: 4000,
            endAfter: 20100,
        });
        this.spawner.addOperation({
            enemyConfig:{
                type:2,
            },
            period: 8000,
            startAfter: 12000,
            endAfter: 20100,
        })
    }

    update(): void {
        super.update();
    }

}