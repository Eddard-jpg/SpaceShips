import Level from "../Level";

export default class Level7 extends Level {

    constructor() {
        super("Level7");
    }

    create(): void {
        super.create();
        this.level = 7;
        this.hint = "Embrace The Darkness..";
        this.HUD.init();

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
            },
            period: 2000,
            minPeriod: 1000,
            step: -50,
            startAfter: 5000,
            endAfter: 120100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                multipliers: {
                    velocity: 5,
                }
            },
            period: 150,
            startAfter: 60000,
            endAfter: 65100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                multipliers: {
                    velocity: 3,
                }
            },
            period: 2000,
            startAfter: 60000,
            endAfter: 120100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                multipliers: {
                    scale: 2,
                    health: 4,
                    value: 4,
                }
            },
            period: 2000,
            minPeriod: 1000,
            step: -10,
            startAfter: 60000,
            endAfter: 120100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 2,
            },
            period: 5000,
            minPeriod: 3500,
            step: -100,
            startAfter: 10000,
            endAfter: 120100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 2,
                multipliers: {
                    velocity: 2,
                }
            },
            period: 4000,
            startAfter: 65000,
            endAfter: 120100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 3,
                multipliers: {
                    health: 0.8,
                    velocity: 0.8,
                }
            },
            period: 10000,
            startAfter: 90000,
            endAfter: 120100,
        })

        this.time.delayedCall(60000, () => {
            this.time.addEvent({
                delay: 75,
                callback: () => {
                    if (this.background.tintTopLeft == 0) return;
                    this.background.setTint(this.background.tintTopLeft - 0x010101);
                },
                callbackScope: this,
                loop: true,
            });
        }, [], this);
    }

}
