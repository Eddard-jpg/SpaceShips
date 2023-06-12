import { beatLevel } from "../../config";
import Level from "../Level";
import Enemy5 from "../enemies/Enemy5";

export default class Level10 extends Level {

    constructor() {
        super("Level10");
    }

    enemyTint: number = 0xff8080;

    create(): void {
        super.create();
        this.level = 10;
        this.hint = "";
        this.HUD.init();

        this.time.delayedCall(2000, this.stage1, [], this);
        this.time.delayedCall(125000, this.stage2, [], this);
    }

    update(): void {
        super.update();
        if (this.time.now - this.time.startTime > 360000 && this.enemies.getLength() == 0 && this.state != Level.States.VICTORY) { this.victory(); }
    }

    stage1() {
        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                multipliers: {
                    scale: 1.2,
                    health: 2,
                    value: 1.5,
                },
            },
            period: 1500,
            minPeriod: 600,
            step: -50,
            endAfter: 120100
            ,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 2,
                multipliers: {
                    scale: 1.1,
                    health: 1.3,
                    velocity: 1.5,
                    value: 1.4,
                }
            },
            period: 4000,
            minPeriod: 1000,
            step: -150,
            startAfter: 10000,
            endAfter: 120100
            ,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 3,
            },
            period: 10000,
            minPeriod: 5000,
            step: -250,
            startAfter: 30000,
            endAfter: 120100
            ,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 4,
            },
            period: 30000,
            minPeriod: 20000,
            step: -1000,
            startAfter: 50000,
            endAfter: 120100,
        });
    }

    stage2() {

        this.time.addEvent({
            delay: 100,
            callback: () => this.background.setTint(this.background.tintTopLeft - 0x000201),
            callbackScope: this,
            repeat: 126,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                followsPlayer: true,
                defaultTint: this.enemyTint,
                multipliers: {
                    scale: 2,
                    health: 4,
                    velocity: 2.5,
                    value: 5,
                },
            },
            period: 2000,
            minPeriod: 500,
            step: -20,
            endAfter: 60100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 2,
                defaultTint: this.enemyTint,
                multipliers: {
                    scale: 1.5,
                    health: 2,
                    velocity: 2,
                    value: 2.4,
                },
                rocketLauncherConfig: {
                    OperationConfigs: [
                        {
                            launchEventConfig: {
                                rocketConfig: {
                                    type: "rocket2",
                                    velocity: 9,
                                    isEnemy: true,
                                },
                                presetPattern: "straight",
                                rocketCount: 3,
                            },
                            fireRate: 50,
                        },
                    ],
                },
            },
            period: 6000,
            minPeriod: 2000,
            step: -100,
            startAfter: 3000,
            endAfter: 220100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 3,
                defaultTint: this.enemyTint,
                multipliers: {
                    scale: 1.5,
                    health: 1.4,
                    velocity: 1.5,
                    value: 2.5,
                },
                rocketLauncherConfig: {
                    OperationConfigs: [
                        {
                            launchEventConfig: {
                                rocketConfig: {
                                    type: "rocket3",
                                    velocity: 7,
                                    isEnemy: true,
                                },
                                presetPattern: "arc",
                                rocketCount: 5,
                            },
                            fireRate: 100 / 3,
                        },
                    ],
                },
            },
            period: 10000,
            minPeriod: 5000,
            step: -250,
            startAfter: 10000,
            endAfter: 220100,
        });
        this.spawner.addOperation({
            enemyConfig: {
                type: 4,
                defaultTint: this.enemyTint,
                multipliers: {
                    scale: 1.5,
                    health: 1.4,
                    velocity: 1.5,
                    value: 2.5,
                },
                rocketLauncherConfig: {
                    OperationConfigs: [
                        {
                            launchEventConfig: {
                                rocketConfig: {
                                    type: "rocket4",
                                    velocity: 10,
                                    isEnemy: true,
                                },
                                totalRotationDelta: Math.PI * 2 * (7 / 8),
                                centerRotation: Math.PI / 16,
                                rocketCount: 8,
                            },
                            startAfter: 375,
                            fireRate: 200 / 3
                        },
                        {
                            launchEventConfig: {
                                rocketConfig: {
                                    type: "rocket4",
                                    velocity: 10,
                                    isEnemy: true,
                                },
                                totalRotationDelta: Math.PI * 2 * (7 / 8),
                                centerRotation: Math.PI * 3 / 16,
                                rocketCount: 8,
                            },
                            startAfter: 1125,
                            fireRate: 200 / 3
                        },
                    ],
                    keepDefaults: true,
                },
            },
            period: 20000,
            minPeriod: 10000,
            step: -5000,
            startAfter: 45000,
            endAfter: 220100,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                defaultTint: this.enemyTint,
                followsPlayer: true,
                multipliers: {
                    scale: 2,
                    health: 4,
                    velocity: 5,
                    value: 5,
                },
            },
            period: 500,
            startAfter: 60000,
            endAfter: 220100,
        });

        this.time.delayedCall(125000, this.spawnBoss, [], this);
    }

    spawnBoss() {

        let operations = [];
        for (let i = 0; i < 48; i++) {
            let operation: RocketLaunchOperationConfig = {
                launchEventConfig: {
                    rocketConfig: {
                        type: "rocket5",
                        velocity: 5,
                        isEnemy: true,
                    },
                    rocketCount: 1,
                    centerRotation: Math.PI * 2 / 48 * i,
                },
                fireRate: 100 / 3,
                startAfter: 3000 / 48 * i,
            };
            operations.push(operation);
        }
        operations.push({
            launchEventConfig: {
                rocketConfig: {
                    type: "rocket4",
                    velocity: 10,
                    isEnemy: true,
                },
                presetPattern: "straight",
                rocketCount: 7,
                target: "player"
            },
            fireRate: 100,
        });
        this.boss = new Enemy5(this, {
            type: 5,
            x: this.cameras.main.width / 2,
            y: -200,
            rotation: Math.PI / 2,
            multipliers: {
                health: 10,
                value: 10,
                velocity: 0.3,
                scale: 2,
                density: 500,
            },
            rocketLauncherConfig: {
                OperationConfigs: operations,
            },

        });
        this.enemies.add(this.boss, true);
    }

    victory(): void {
        beatLevel(0);
        beatLevel(this.level as number);
        this.state = Level.States.VICTORY;

        this.time.addEvent({
            delay: 40,
            callback: () => this.background.setTint(this.background.tintTopLeft + 0x000201),
            callbackScope: this,
            repeat: 126,
        });

        this.time.delayedCall(5000, this.blackOut, [], this);
        this.time.delayedCall(15000, this.showEnding, [], this);
    }

    blackOut() {
        const endingBackGround = this.add.graphics().fillStyle(0x000000, 1)
            .fillRect(0, 0, this.cameras.main.width, this.cameras.main.height).setDepth(50).setAlpha(0);

        this.time.addEvent({
            delay: 25,
            callback: endingBackGround => endingBackGround.alpha += Math.max((1 - endingBackGround.alpha) * 0.01, 0.0005),
            args: [endingBackGround],
            repeat: 400,
        });
    }

    showEnding() {
        console.log('hi');

        const endingText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, "", {
            align: 'center',
            fontSize: '25px',
        }).setOrigin(0.5).setAlpha(0).setDepth(100).setWordWrapWidth(this.cameras.main.width / 2);

        endingText.text =
            "You've come a long way..\n" +
            "(not really, the game was really short)";
        this.time.delayedCall(1000, this.showText, [endingText], this);
        this.time.delayedCall(7000, this.hideText, [endingText], this);

        this.time.delayedCall(8000, endingText => endingText.text =
            "You faced many enemies and bosses of different shapes and dimensions, and emerged victorious!\n" +
            "(again, there were only like 5 enemy types in the game)", [endingText]);
        this.time.delayedCall(8500, this.showText, [endingText], this);
        this.time.delayedCall(17500, this.hideText, [endingText], this);

        this.time.delayedCall(18500, endingText => endingText.text =
            "You saved the planet from the evil " +
            "capitalist aliens who are probably racist and hate cats too.", [endingText]);
        this.time.delayedCall(19000, this.showText, [endingText], this);
        this.time.delayedCall(26000, this.hideText, [endingText], this);

        this.time.delayedCall(27000, endingText => endingText.text =
            "Anyway, I enjoyed making this game very much.\n\n" +
            "So, I really hope you enjoyed playing it too. c:", [endingText]);
        this.time.delayedCall(28000, this.showText, [endingText], this);
        this.time.delayedCall(34000, this.hideText, [endingText], this);

        this.time.delayedCall(35000, endingText => endingText.text =
            "That's it! Have a nice day. c:", [endingText]);
        this.time.delayedCall(36000, this.showText, [endingText], this);

        this.time.delayedCall(42000, this.exit, [], this);
    }

    showText(text: Phaser.GameObjects.Text) {
        this.time.addEvent({
            delay: 25,
            callback: text => text.alpha += Math.max((1 - text.alpha) * 0.1, 0.01),
            args: [text],
            repeat: 40,
        });
    }

    hideText(text: Phaser.GameObjects.Text) {
        this.time.addEvent({
            delay: 25,
            callback: text => text.alpha -= Math.max(text.alpha * 0.1, 0.01),
            args: [text],
            repeat: 40,
        });
    }

}
