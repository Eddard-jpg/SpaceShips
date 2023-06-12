import Phaser from "phaser";
import type Level from "./Level";
import { secondsToHMS } from "../functions";


export default class HUD {

    scene: Level;

    buttonStyle: Phaser.Types.GameObjects.Text.TextStyle;
    texts: {
        hintText: Phaser.GameObjects.Text;
        levelText: Phaser.GameObjects.Text;
        scoreText: Phaser.GameObjects.Text;
        timeText: Phaser.GameObjects.Text;
        healthText: Phaser.GameObjects.Text;
        ammoText: Phaser.GameObjects.Text;
        levelUpText: Phaser.GameObjects.Text;
        victoryText: Phaser.GameObjects.Text;
        gameOverText: Phaser.GameObjects.Text;
        nextLevelButton: Phaser.GameObjects.Text;
        tryAgainButton: Phaser.GameObjects.Text;
        mainMenuButton: Phaser.GameObjects.Text;

    };
    sceneWidth: number;
    sceneHeight: number;
    timeElapsed: number;
    incrementTime: Phaser.Time.TimerEvent;

    /**
     * 
     * @param {Level} scene The scene to which the HUD belongs
     */
    constructor(scene: Level) {

        this.scene = scene;

        var padding = 40;


        this.sceneWidth = Number(scene.game.config.width);
        this.sceneHeight = Number(scene.game.config.height);

        this.buttonStyle = {
            backgroundColor: '#808080',
            padding: {
                x: 16,
                y: 8
            },
        };

        this.texts = {

            hintText: scene.add.text(this.sceneWidth * 0.5, this.sceneHeight * 0.5, "", { align: 'center' }).setOrigin(0.5),

            levelText: scene.add.text(this.sceneWidth * 0.5, padding, "").setOrigin(0.5),

            scoreText: scene.add.text(padding, padding, "").setOrigin(0),
            timeText: scene.add.text(this.sceneWidth - padding, padding, "").setOrigin(1, 0),
            healthText: scene.add.text(padding, this.sceneHeight - padding, "").setOrigin(0, 1),
            ammoText: scene.add.text(this.sceneWidth - padding, this.sceneHeight - padding, "").setOrigin(1),

            levelUpText: scene.add.text(this.sceneWidth * 0.5, this.sceneHeight * 0.5, "Level Up!").setOrigin(0.5),

            victoryText: scene.add.text(this.sceneWidth * 0.5, this.sceneHeight * 0.5, "Victory! c:").setOrigin(0.5),
            gameOverText: scene.add.text(this.sceneWidth * 0.5, this.sceneHeight * 0.5, "Game Over. :c").setOrigin(0.5),

            nextLevelButton: scene.add.text(this.sceneWidth * 0.5 + 10, this.sceneHeight * 0.5 + 40, "Next Level", this.buttonStyle)
                .setOrigin(0, 0.5).setInteractive().on('pointerdown', this.scene.nextLevel, this.scene),
            tryAgainButton: scene.add.text(this.sceneWidth * 0.5 + 10, this.sceneHeight * 0.5 + 40, "Try Again", this.buttonStyle)
                .setOrigin(0, 0.5).setInteractive().on('pointerdown', this.scene.restart, this.scene),
            mainMenuButton: scene.add.text(this.sceneWidth * 0.5 - 10, this.sceneHeight * 0.5 + 40, "Main Menu", this.buttonStyle)
                .setOrigin(1, 0.5).setInteractive().on('pointerdown', this.scene.exit, this.scene),
        };

        Object.keys(this.texts).forEach(key => {
            (this.texts[key] as Phaser.GameObjects.Text).setDepth(2);
        });

    }

    init() {
        this.texts.levelText.text = this.scene.level == 0 ? "Tutorial" : this.scene.level != 'X' ? "Level " + this.scene.level : "";
        this.texts.hintText.text = this.scene.hint;

        this.showDefault();
        this.show(this.texts.hintText);

        this.timeElapsed = 0;
        this.incrementTime = this.scene.time.addEvent({
            delay: 1000,
            callback: () => { this.timeElapsed++; },
            callbackScope: this,
            loop: true
        });

        this.scene.time.addEvent({
            delay: 5000,
            callback: () => { this.texts.hintText.setVisible(false); },
            callbackScope: this,
        });
    }

    update() {
        this.texts.healthText.text = "Health: " + '❤'.repeat(this.scene.player.health);
        this.texts.ammoText.text = "Ammo: " + '*'.repeat(this.scene.player.ammo) + ' '.repeat(this.scene.player.maxAmmo - this.scene.player.ammo);
        this.texts.scoreText.text = "Score: " + Math.floor(this.scene.player.score);
        this.texts.timeText.text = "Time Elapsed: " + secondsToHMS(this.timeElapsed);
    }

    show(...args: Phaser.GameObjects.Text[]) { args.forEach(element => { element.setVisible(true); }); }
    hide(...args: Phaser.GameObjects.Text[]) { args.forEach(element => { element.setVisible(false); }); }

    hideAll() { Object.keys(this.texts).forEach(key => { this.hide(this.texts[key]); }); }

    showDefault() {
        this.hideAll();
        this.show(this.texts.levelText, this.texts.scoreText, this.texts.timeText, this.texts.healthText, this.texts.ammoText);
    }

    levelUp() {
        this.scene.time.addEvent({
            delay: 500,
            callback: () => { this.texts.levelUpText.setVisible(true); },
            callbackScope: this,
            repeat: 2,
            startAt: 500
        });
        this.scene.time.addEvent({
            delay: 500,
            callback: () => { this.texts.levelUpText.setVisible(false); },
            callbackScope: this,
            repeat: 1,
            startAt: 250
        });
        this.scene.time.addEvent({
            delay: 2500,
            callback: () => { this.texts.levelUpText.setVisible(false); },
            callbackScope: this
        });
    }

    endGame() {
        this.hideAll();
        this.show(this.texts.scoreText, this.texts.timeText, this.texts.levelText, this.texts.mainMenuButton);
    }

    victory() {
        this.incrementTime.remove();
        this.endGame();
        this.show(this.texts.victoryText, this.texts.nextLevelButton);
    }

    defeat() {
        this.endGame();
        this.show(this.texts.gameOverText, this.texts.tryAgainButton);
    }
}