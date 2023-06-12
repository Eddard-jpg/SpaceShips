import { tutorialTexts } from "../../Constants";
import { beatLevel } from "../../config";
import Level from "../Level";

export default class Level0 extends Level {

    tutorial: Phaser.GameObjects.Container;
    tutorialBackground: Phaser.GameObjects.Graphics;
    tutorialText: Phaser.GameObjects.Text;
    nextButton: Phaser.GameObjects.Text;
    skipButton: Phaser.GameObjects.Text;

    stage: number;



    constructor() {
        super("Level0");
    }

    create(): void {
        super.create();
        this.level = 0;
        this.hint = "";
        this.HUD.init();

        this.showTutorial();
    }

    update(): void {
        super.update();
        if (!this.player.healEvent.paused) { this.player.heal(); }
    }

    showTutorial() {
        this.HUD.hide(this.HUD.texts.scoreText, this.HUD.texts.timeText);

        this.stage = 0;

        this.tutorialBackground = this.add.graphics().fillStyle(0x000000, 0.5)
            .fillRect(0, 0, 350, 350);

        this.tutorialText = this.add.text(30, 40, "").setWordWrapWidth(300);

        this.nextButton = this.createButton(310, 330, "Next", {
            fontSize: '16px',
            backgroundColor: '#808080',
            padding: { y: 5 },
            fixedWidth: 70,
            align: 'center',
        }, this.nextStage).setOrigin(0.5);

        this.skipButton = this.createButton(190, 330, "Skip Tutorial", {
            fontSize: '16px',
            backgroundColor: '#808080',
            padding: { y: 5 },
            fixedWidth: 150,
            align: 'center',
        }, () => this.victory());

        this.tutorial = this.add.container();
        this.tutorial.add([this.tutorialBackground, this.tutorialText, this.nextButton, this.skipButton]);
        this.tutorial.setDepth(2);

        this.nextStage();
    }

    createButton(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle, callback: CallableFunction) {
        return this.add.text(x, y, text, style).setOrigin(0.5)
            .setInteractive().on('pointerdown', callback, this);
    }

    nextStage() {
        this.tutorialText.text = tutorialTexts[this.stage];
        this.stage++;
        if (this.stage == 4) {
            this.spawner.addOperation({
                enemyConfig: {
                    type: 1,
                },
                period: 1000,
                startAfter: 3000,
                endAfter: 3100,
            });
            this.spawner.addOperation({
                enemyConfig: {
                    type: 2
                },
                period: 1000,
                startAfter: 4000,
                endAfter: 4100,
            });
        }
        if (this.stage == 5) {
            this.spawner.addOperation({
                enemyConfig: {
                    type: 1,
                    multipliers: {
                        velocity: 0.5,
                        value: 6,
                    },
                },
                period: 900,
                minPeriod: 500,
                step: -100,
                startAfter: 5000,
                endAfter: 15000,
            });
        }
        if (this.stage == 7) {
            this.skipButton.destroy();
            this.nextButton.text = "Done";
            this.nextButton.on('pointerdown', this.victory, this)
        }
    }

    victory(): void {
        beatLevel(0);
        this.scene.start('Level1');
    }

}