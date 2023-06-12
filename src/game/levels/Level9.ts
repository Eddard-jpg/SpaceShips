import Level from "../Level";
import type Rocket from "../Rocket";

export default class Level9 extends Level {

    shiftGravityEvent: Phaser.Time.TimerEvent;

    constructor() {
        super("Level9");
    }

    create(): void {
        super.create();
        this.level = 9;
        this.hint = "Do Not Resist.";
        this.HUD.init();


        this.shiftGravityEvent = this.time.addEvent({
            delay: 6000,
            callback: this.shiftGravity,
            callbackScope: this,
            loop: true,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                followsPlayer: true,
                multipliers: {
                    velocity: 2,
                    value: 2,
                }
            },
            period: 5000,
            minPeriod: 1000,
            step: -200,
            endAfter: 50100,
        });
        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                followsPlayer: true,
                multipliers: {
                    scale: 1.4,
                    health: 2,
                    value: 3.5,
                    velocity: 5,
                }
            },
            period: 1000,
            startAfter: 50000,
            endAfter: 120100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 2,
                followsPlayer: true,
                multipliers: {
                    value: 1.4,
                    velocity: 2,
                },
            },
            period: 7000,
            minPeriod: 3000,
            step: -500,
            startAfter: 10000,
            endAfter: 120100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 3,
            },
            period: 15000,
            minPeriod: 8000,
            step: -1500,
            startAfter: 45000,
            endAfter: 120100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 4,
            },
            period: 30000,
            minPeriod: 20000,
            step: 0.8,
            multiplicative: true,
            startAfter: 70000,
            endAfter: 120100,
        });


    }

    update(): void {
        super.update();

        // setIgnoreGravity doesn't work, check rocket.ts create() for details.
        this.rockets.children.each((rocket: Rocket) => {
            let gravity = this.matter.world.engine.world.gravity;
            rocket?.applyForce(new Phaser.Math.Vector2(-rocket.body.mass * gravity.x * gravity.scale, -rocket.body.mass * gravity.y * gravity.scale));
            return true;
        })
    }

    shiftGravity() {
        let force = 0.15;
        let angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        let x = force * Math.cos(angle);
        let y = force * Math.sin(angle);
        this.matter.world.setGravity(x, y);
        this.player.setIgnoreGravity(true);

        this.shiftGravityEvent.reset({
            delay: Phaser.Math.FloatBetween(2000, 5000),
            callback: this.shiftGravity,
            callbackScope: this,
            loop: true,
        });
    }

}
