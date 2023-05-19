// @ts-nocheck

config = {
    type: Phaser.AUTO,
    width: 1440,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: this.preload,
        create: this.create,
        update: this.update
    }
};

var game = new Phaser.Game(config);

function create() {
    this.scene.add('Main', Main);
    this.scene.start('Main');
}

class Main extends Phaser.Scene {
    constructor() {
        super("Main");
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('enemy1', 'assets/enemy1.png');
        this.load.image('enemy2', 'assets/enemy2.png');
        this.load.image('enemy3', 'assets/enemy3.png');
        this.load.image('enemy4', 'assets/enemy4.png');
        this.load.image('rocket1', 'assets/rocket1.png');
        this.load.image('rocket2', 'assets/rocket2.png');
        this.load.image('rocket3', 'assets/rocket3.png');
        this.load.image('rocket4', 'assets/rocket4.png');
    }

    create() {

        this.gameOverCondition = false;
        this.zero = Date.now();

        this.background = this.add.image(0, 0, 'sky').setOrigin(0, 0).setScale(2);

        // Texts
        this.tutorial = this.add.text(config.width * 0.4, config.height * 0.45, "Use WASD or Arrow Keys to move\nUse Spacebar to Shoot\nGood Luck. c:", { align: 'center' });
        this.healthText = this.add.text(config.width * 0.05, config.height * 0.9, "");
        this.ammoText = this.add.text(config.width * 0.8, config.height * 0.9, "");
        this.scoreText = this.add.text(config.width * 0.05, config.height * 0.1, "");
        this.tutorial.setDepth(1);
        this.healthText.setDepth(1);
        this.ammoText.setDepth(1);
        this.scoreText.setDepth(1);
        this.score = 0;

        // Player Status
        this.player = this.physics.add.sprite(config.width * 0.5, config.height * 0.8, 'player');
        this.player.health = this.player.maxHealth = 5;
        this.player.ammo = this.player.maxAmmo = 10;
        this.player.shield = false;

        // Player Events
        this.player.heal = this.time.addEvent({
            delay: 3000,
            callback: this.heal,
            callbackScope: this,
            loop: true,
            paused: true
        });
        this.player.reload = this.time.addEvent({
            delay: 500,
            callback: this.reload,
            callbackScope: this,
            loop: true,
            paused: true,
        });

        // Player Physics
        this.player.body.useDamping = true;
        this.player.setDrag(0.4, 0.4);
        this.player.setAngularDrag(100);
        this.player.setBounce(0.4);
        this.player.setCollideWorldBounds();

        // Enemies Stats
        this.enemies = this.physics.add.group();
        this.enemies.health = [1, 2, 4, 10];
        this.enemies.values = [1, 5, 20, 50];
        this.enemies.coolDown = [3000, 10000, 30000, 50000];

        // Enemies Events
        this.spawn = [];
        for (let i = 0; i < 4; i++) {
            this.spawn[i] = this.time.addEvent({
                delay: this.enemies.coolDown[i],
                callback: this.spawnEnemy,
                args: [i],
                callbackScope: this,
                loop: true
            });
        }

        this.playerRockets = this.physics.add.group();

        this.enemyRockets = this.physics.add.group();

        this.physics.add.collider(this.player, this.enemies, this.damagePlayer.bind(this));
        this.physics.add.overlap(this.playerRockets, this.enemies, this.rocketHit.bind(this));
        this.physics.add.overlap(this.player, this.enemyRockets, this.enemyRocketHit.bind(this));

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            'w': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            'a': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            's': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            'd': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        }
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.o = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);

        this.updateTexts();
    }

    update() {
        if (this.gameOverCondition)
            return;

        if (this.tutorial.active) {
            if (Object.values(this.input.keyboard.keys).some((key) => key.isDown))
                this.tutorial.destroy();
            else
                return;
        }

        // Velocity
        if (this.cursors.up.isDown || this.wasd['w'].isDown)
            this.accelerate(this.player, 100);
        else if (this.cursors.down.isDown || this.wasd['s'].isDown)
            this.accelerate(this.player, -75);
        else
            this.accelerate(this.player, 0);

        // Angular Velocity
        if ((this.cursors.right.isDown || this.wasd['d'].isDown) && this.player.body.angularVelocity < 200)
            this.player.setAngularAcceleration(100 + (this.player.body.angularVelocity < 0) * 2 * this.player.body.angularDrag);
        else if ((this.cursors.left.isDown || this.wasd['a'].isDown) && this.player.body.angularVelocity > -200)
            this.player.setAngularAcceleration(-100 - (this.player.body.angularVelocity > 0) * 2 * this.player.body.angularDrag);
        else
            this.player.setAngularAcceleration(0);

        // Launch playerRockets
        if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && this.player.ammo > 0)
            this.launchRocket();

        // Despawn objects out of the scene
        this.enemies.children.iterate(child => {
            if (child && this.outOfBounds(child)) {
                this.damageEnemy(child);
            }
        });

        this.playerRockets.children.iterate(child => {
            if (child && this.outOfBounds(child)) {
                child.destroy();
            }
        });

        this.enemyRockets.children.iterate(child => {
            if (child && this.outOfBounds(child)) {
                child.destroy();
            }
        });


        // Advance time 10 secs
        if (Phaser.Input.Keyboard.JustDown(this.o)) {
            this.zero -= 10000;
        }

    }

    updateTexts() {
        this.healthText.text = "Health: " + '#'.repeat(this.player.health);
        this.ammoText.text = "Ammo: " + '*'.repeat(this.player.ammo);
        this.scoreText.text = "Score: " + this.score;
    }

    /**
     * Sets the object acceleration in x and y based on its rotation.
     * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} object 
     * @param {number} acceleration 
     */
    accelerate(object, acceleration) {
        object.setAcceleration(acceleration * Math.cos(object.rotation - Math.PI * 0.5), acceleration * Math.sin(object.rotation - Math.PI * 0.5))
    }

    /**
     * Calculates the velocity of an object moving in 2D using velocityX and velocityY.
     * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} object
     * @returns {number}
     */
    trueVelocity(object) {
        return Math.sqrt(object.body.velocity.x ** 2 + object.body.velocity.y ** 2);
    }

    /**
     * Calculates the euclidean distance between an object and coordinates.
     * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} object
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    distance(object, x, y) {
        return Math.sqrt((object.body.x - x) ** 2 + (object.body.y - y) ** 2);
    }

    /**
     * Determines whether the object is out of the scope of the scene to destroy it, for efficiency.
     * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} object 
     * @returns {boolean}
     */
    outOfBounds(object) {
        return object.x > config.width * 1.5 || object.x < config.width * -0.5 || object.y > config.height * 1.5 || object.y < config.height * -0.5;
    }

    /**
     * Damage the player, reducing its health by one point, and causing Game Over if health reaches 0.
     * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} player 
     * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} _enemy 
     * @returns {null}
     */
    damagePlayer(player, _enemy = null) {
        if (player.shield)
            return;

        if (player.health == player.maxHealth)
            player.heal.paused = false;

        player.health--;
        player.shield = true;
        player.setTint(0xff0000);

        player.unshield = this.time.delayedCall(1500, function (player) {
            player.shield = false;
            player.setTint(0xffffff);
        }, [player], this);

        this.updateTexts();

        if (player.health == 0)
            this.gameOver();
    }

    enemyRocketHit(player, enemyRocket) {
        enemyRocket.destroy();
        this.damagePlayer(player);
    }

    reload() {
        ++this.player.ammo;
        this.updateTexts();
        if (this.player.ammo == this.player.maxAmmo)
            this.player.reload.paused = true;
    }

    heal() {
        ++this.player.health
        this.updateTexts();
        if (this.player.health == this.player.maxHealth)
            this.player.heal.paused = true;
    }

    launchRocket() {
        if (this.player.ammo == this.player.maxAmmo)
            this.player.reload.paused = false;

        this.player.ammo--;
        var rocket = this.playerRockets.create(this.player.x, this.player.y, 'rocket1');
        rocket.setVelocity(750 * Math.cos(this.player.rotation - Math.PI * 0.5), 750 * Math.sin(this.player.rotation - Math.PI * 0.5));
        rocket.rotation = this.player.rotation;
        rocket.mass = 0.05;
        this.updateTexts();
    }

    /**
     * Launches rocket(s) from the enemy.
     * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} enemy 
     */
    launchEnemyRocket(enemy) {

        var assetName = 'rocket' + (enemy.level + 1);
        var rocketVelocity = 200 + 100 * enemy.level;

        for (let i = 0; i < 1 + 7 * (enemy.level == 3); i++) {
            var rocket = this.enemyRockets.create(enemy.x, enemy.y, assetName);
            rocket.rotation = enemy.level == 2 ? Math.atan2(this.player.y - rocket.y, this.player.x - rocket.x) + Math.PI * 0.5 : enemy.rotation + Math.PI * 0.25 * i; // 45 degree difference between each rocket, that makes it 8 rockets distributed evenly around the level 3 enemy.
            rocket.setVelocity(rocketVelocity * Math.cos(rocket.rotation - Math.PI * 0.5), rocketVelocity * Math.sin(rocket.rotation - Math.PI * 0.5));
            rocket.body.mass = 0.05;
        }

    }

    spawnEnemy(level) {
        // always spawn outside the scene
        var x = Phaser.Math.FloatBetween(-0.25 * config.width, 1.25 * config.width);
        var y = Phaser.Math.FloatBetween(-0.25 * config.height, 1.25 * config.height);
        if (x > 0 && x < config.width && y > 0 && y < config.height) { // Spawned inside the scene, change x or y to be outside the scene
            if (Phaser.Math.FloatBetween(0, 1) > 0.5) x = x / 4 + config.width;
            else y = y / 4 + config.height;
        }

        var level = level;
        var enemy = this.enemies.create(x, y, 'enemy' + (level + 1));
        var enemySpeed = Phaser.Math.FloatBetween(100, 150);
        enemy.rotation = Math.atan2(this.player.y - y, this.player.x - x) + Math.PI * 0.5;
        enemy.setVelocity(enemySpeed * Math.cos(enemy.rotation - Math.PI * 0.5), enemySpeed * Math.sin(enemy.rotation - Math.PI * 0.5));
        enemy.level = level;
        enemy.health = this.enemies.health[level];
        switch (level) {
            case 0:
                this.spawn[0].delay -= 20;
                if (this.spawn[0].delay < 300) this.spawn[0].delay = 300;
                break;
            case 1:
                this.spawn[1].delay -= 50;
                if (this.spawn[1].delay < 700) this.spawn[1].delay = 700;
                break;
            case 2:
                this.spawn[2].delay *= 0.8;
                if (this.spawn[2].delay < 3500) this.spawn[2].delay = 3500;
                break;
            case 3:
                this.spawn[3].delay *= 0.7;
                if (this.spawn[3].delay < 5000) this.spawn[3].delay = 5000;
                break;
        }
        if (level)
            enemy.spawnRocket = this.time.addEvent({
                delay: 3500 - 1000 * level,
                callback: this.launchEnemyRocket,
                args: [enemy],
                callbackScope: this,
                loop: true
            });
    }

    rocketHit(rocket, enemy) {
        rocket.destroy();
        this.damageEnemy(enemy);
    }

    damageEnemy(enemy) {
        if (--enemy.health == 0) {

            if (enemy.delayedEvent) // Removes the "Undo Tinting" delayed call. I think calling it after destroying enemy will cause the game to crash. :3
                enemy.delayedEvent.remove();
            if (enemy.level)
                enemy.spawnRocket.remove();
            enemy.destroy();
            this.score += this.enemies.values[enemy.level];
        }
        else {

            if (enemy.delayedEvent)
                enemy.delayedEvent.remove();

            enemy.setTint(0xff0000); // Tint red briefly

            enemy.delayedEvent = this.time.delayedCall(200, function (enemy) { // Undo Tinting
                enemy.setTint(0xffffff);
            }, [enemy], this);
        }
        this.updateTexts();
    }

    gameOver() {
        this.player.setTint(0x800000);
        this.gameOverCondition = true;
        this.physics.pause();
        this.time.removeAllEvents();
        this.add.text(config.width * 0.5, config.height * 0.5, "Game Over :c");
    }

}