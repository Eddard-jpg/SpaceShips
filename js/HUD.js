// @ts-nocheck


class HUD {

    /**
     * 
     * @param {Phaser.Scene} scene The scene to which the HUD belongs
     */
    constructor(scene) {

        this.scene = scene;

        var padding = 40;

        this.texts = [
            this.tutorial = scene.add.text(config.width * 0.5, config.height * 0.5,
                "Use WASD or Arrow Keys to Move\n" +
                "W: Accelerate\n" +
                "S: Decelerate\n" +
                "A/D: Rotate\n" +
                "Spacebar: Shoot\n\n" +
                "-----------------\n" +
                "Survive as long as possible\n" +
                "and defeat as many enemies as you can.\n\n" +
                "Good luck! c:",
                { align: 'center' }).setOrigin(0.5),

            this.scoreText = scene.add.text(padding, padding, "").setOrigin(0),
            this.timeText = scene.add.text(config.width - padding, padding, "").setOrigin(1, 0),

            this.healthText = scene.add.text(padding, config.height - padding, "").setOrigin(0, 1),
            this.ammoText = scene.add.text(config.width - padding, config.height - padding, "").setOrigin(1),

            this.levelUpText = scene.add.text(config.width * 0.5, config.height * 0.5, "Level Up!").setOrigin(0.5),

            this.gameOverText = scene.add.text(config.width * 0.5, config.height * 0.5, "Game Over. :c\n\n", { align: 'center' }).setOrigin(0.5),
        ]
        this.levelUpText.visible = this.gameOverText.visible = false;

        scene.time.addEvent({
            delay: 10000,
            callback: () => { this.tutorial.visible = false; },
            callbackScope: this
        })

        this.tutorial.setDepth(3);
        this.healthText.setDepth(3);
        this.ammoText.setDepth(3);
        this.scoreText.setDepth(3);
        this.timeText.setDepth(3);
        this.levelUpText.setDepth(3);
        this.gameOverText.setDepth(3);

    }

    levelUp() {
        this.scene.time.addEvent({
            delay: 200,
            callback: () => { this.levelUpText.visible = !this.levelUpText.visible; },
            callbackScope: this,
            repeat: 4,
            startAt: 200
        });
        this.scene.time.addEvent({
            delay: 2000,
            callback: () => { this.levelUpText.visible = !this.levelUpText.visible; },
            callbackScope: this
        });


    }

    secondsToHMS(seconds) {

        var H = (parseInt(seconds / 3600)).toString();
        if (H.length < 2) H = '0' + H;
        if (H == '00') H = '';

        var M = (parseInt(seconds / 60) % 60).toString();
        if (M.length < 2) M = '0' + M;

        var S = (parseInt(seconds) % 60).toString();
        if (S.length < 2) S = '0' + S;

        return H + (H.length ? ':' : '') + M + ':' + S;
    }

    update() {
        this.healthText.text = "Health: " + '#'.repeat(this.scene.player.health);
        this.ammoText.text = "Ammo: " + '*'.repeat(this.scene.player.ammo);
        this.scoreText.text = "Score: " + this.scene.player.score;
        this.timeText.text = "Time Elapsed: " + this.secondsToHMS(this.scene.timeElapsed);
    }

    hideAll() {
        this.texts.forEach(text => { text.visible = false; });
    }

    gameOver() {

        this.hideAll();
        this.scoreText.visible = this.timeText.visible = this.gameOverText.visible = true;
        this.scene.time.addEvent({
            delay: 2000,
            callback: () => {
                this.scene.restartCondition = true;
                this.gameOverText.text += "Press R to restart."
            },
            callbackScope: this
        })
    }

}