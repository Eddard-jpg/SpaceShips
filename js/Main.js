// @ts-nocheck


class Main extends Phaser.Scene {
    constructor() {
        super("Main");
    }


    create() {

        this.gameOverCondition = this.restartCondition = false;

        this.background = this.add.image(0, 0, 'sky').setOrigin(0, 0).setScale(2);

        this.HUD = new HUD(this);

        this.enemies = this.physics.add.group();

        this.player = new Player(this, config.width * 0.5, config.height * 0.8);

        this.enemySpawners = [
            new EnemySpawner(this, 0, 3000, 300, -20, false, 0, 75000),
            new EnemySpawner(this, 1, 5000, 700, -50, false, 10000),
            new EnemySpawner(this, 2, 15000, 7500, 0.8, true, 40000),
            new EnemySpawner(this, 3, 30000, 10000, 0.7, true, 60000),
            new EnemySpawner(this, 0, 3000, 1000, 0.99, true, 75000, -1, { velocity: 500 }),
            new EnemySpawner(this, 4, 60000, 30000, -15000, false, 120000, -1, { x: config.width / 2, y: -200, rotation: Math.PI }),
        ];


    }

    update() {
        if (this.gameOverCondition) {
            if (this.restartCondition && Object.values(this.input.keyboard.keys).some((key) => key.isDown))
                this.scene.start('Main');
            return;
        }

        if (this.HUD.tutorial.active) {
            if (Object.values(this.input.keyboard.keys).some((key) => key.isDown))
                this.HUD.tutorial.destroy();
            else
                return;
        }

        this.HUD.update();

        this.player.update();

        this.enemies.children.iterate(child => {
            if (child)
                child.update();
        });

    }

    /**
     * Calculates the euclidean distance between an object and coordinates.
     * @param {Phaser.Types.Physics.Arcade.Sprite} object
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    distance(object, x, y) {
        return Math.sqrt((object.body.x - x) ** 2 + (object.body.y - y) ** 2);
    }

    /**
     * Determines whether the object is out of the scope of the scene to destroy it.
     * @param {Phaser.Types.Physics.Arcade.Sprite} object 
     * @returns {boolean}
     */
    outOfBounds(object) {
        return object.x > config.width * 1.5 || object.x < config.width * -0.5 || object.y > config.height * 1.5 || object.y < config.height * -0.5;
    }

    /**
     * Handles the event where rockets hit objects.
     * @param {Player | Enemy} object 
     * @param {Rocket} rocket 
     */

    rocketHit(object, rocket) {
        rocket.destroy();
        object.takeDamage(rocket.damage, true);
    }

    gameOver() {
        this.gameOverCondition = true;
        this.physics.pause();
        this.time.removeAllEvents();
        this.player.gameOver();
        this.HUD.gameOver();
    }

}