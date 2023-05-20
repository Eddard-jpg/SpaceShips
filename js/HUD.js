// @ts-nocheck


class HUD {

    /**
     * 
     * @param {Phaser.Scene} scene The scene to which the HUD belongs
     */
    constructor(scene) {

        this.scene = scene;

        this.tutorial = scene.add.text(config.width * 0.4, config.height * 0.45, "Use WASD or Arrow Keys to move\nUse Spacebar to Shoot\nGood Luck. c:", { align: 'center' });
        this.healthText = scene.add.text(config.width * 0.05, config.height * 0.9, "");
        this.ammoText = scene.add.text(config.width * 0.8, config.height * 0.9, "");
        this.scoreText = scene.add.text(config.width * 0.05, config.height * 0.1, "");

        this.tutorial.setDepth(3);
        this.healthText.setDepth(3);
        this.ammoText.setDepth(3);
        this.scoreText.setDepth(3);

    }

    update() {
        this.healthText.text = "Health: " + '#'.repeat(this.scene.player.health);
        this.ammoText.text = "Ammo: " + '*'.repeat(this.scene.player.ammo);
        this.scoreText.text = "Score: " + this.scene.player.score;
    }

    gameOver() {

        this.HUD.update();
        this.scene.add.text(config.width * 0.48, config.height * 0.5, "Game Over. :c", { align: 'center' });
        this.scene.time.addEvent({
            delay: 2000,
            callback: () => {
                this.scene.restartCondition = true;
                this.scene.add.text(config.width * 0.45, config.height * 0.53, "Press any key to restart.", { align: 'center' });
            },
            callbackScope: this
        })
    }

}