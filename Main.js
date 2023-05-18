// @ts-nocheck

config = {
    type: Phaser.AUTO,
    width: 1280,
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
        this.load.image('enemy', 'assets/enemy1.png');
        this.load.image('enemy2', 'assets/enemy2.png');
        this.load.image('enemy3', 'assets/enemy3.png');
        this.load.image('enemy4', 'assets/enemy4.png');
        this.load.image('rocket', 'assets/rocket1.png');
        this.load.image('rocket2', 'assets/rocket2.png');
        this.load.image('rocket3', 'assets/rocket3.png');
    }

    create() {
        this.gameOverCondition = false;

        this.zero = Date.now();

        this.background = this.add.image(0, 0, 'sky').setOrigin(0, 0).setScale(2);

        this.healthText = this.add.text(config.width * 0.05, config.height * 0.9, "wagwe");
        this.ammoText = this.add.text(config.width * 0.8, config.height * 0.9, "wafgew");
        this.scoreText = this.add.text(config.width * 0.05, config.height * 0.1, "gresger");
        this.score = 0;

        this.player = this.physics.add.sprite(config.width * 0.5, config.height * 0.8, 'player');
        this.player.speed = 0;
        this.player.health = 5;
        this.player.ammo = 10;
        this.player.shieldTime = Date.now();
        this.player.healTime = Date.now();
        this.player.reloadTime = Date.now();
        this.player.body.useDamping= true;
        this.player.setDrag(0.2, 0.2);
        this.player.setAngularDrag(100);
        this.player.setBounce(0.4);
        this.player.setCollideWorldBounds();

        this.enemies = this.physics.add.group();
        this.enemies.spawnTime = Date.now();

        this.rockets = this.physics.add.group();

        this.enemyRockets = this.physics.add.group();

        this.physics.add.collider(this.player, this.enemies, this.damagePlayer.bind(this));
        this.physics.add.collider(this.rockets, this.enemies, this.destroyEnemy.bind(this));
        this.physics.add.collider(this.player, this.enemyRockets, this.damagePlayerRocket.bind(this));

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.o = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);

        this.updateTexts();
    }

    update() {
        if (this.gameOverCondition)
            return;

        // Velocity
        if (this.cursors.up.isDown && this.trueVelocity(this.player) < 300)
            this.accelerate(this.player, 100);
        else if (this.cursors.down.isDown && this.trueVelocity(this.player) > -150)
            this.accelerate(this.player, -100);
        else
            this.accelerate(this.player, 0);

        // Angular Velocity
        if (this.cursors.right.isDown && this.player.body.angularVelocity < 200)
            this.player.setAngularAcceleration(100 + (this.player.body.angularVelocity < 0) * this.player.body.angularDrag);
        else if (this.cursors.left.isDown && this.player.body.angularVelocity > -200)
            this.player.setAngularAcceleration(-100 - (this.player.body.angularVelocity > 0) * this.player.body.angularDrag);
        else
            this.player.setAngularAcceleration(0);

        // Launch Rockets
        if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && this.player.ammo > 0) {
            this.launchRocket();
        }

        // Shield
        if (Date.now() - this.player.shieldTime > 1000)
            this.player.setTint(0xffffff);

        // Reload
        if (this.player.ammo < 10 && Date.now() - this.player.reloadTime > 750)
            this.reload();

        // Heal
        if (this.player.health < 5 && Date.now() - this.player.healTime > 5000)
            this.heal();

        // Spawn Enemies
        if (this.enemies.getLength() < 30 && Date.now() - this.enemies.spawnTime > Math.max(200, 3000 - (Date.now() - this.zero) * 0.05))
            this.spawnEnemy();

        // Launch Enemy Rockets
        this.enemies.children.iterate(child => {
            if (child && child.hasRockets && Date.now() - child.lastRocket > 2000)
                this.launchEnemyRocket(child);
        })

        // Despawn objects out of the scene
        this.enemies.children.iterate(child => {
            if (child && this.outOfBounds(child)) {
                child.destroy();
                console.log('enemy out');
            }
        });

        this.rockets.children.iterate(child => {
            if (child && this.outOfBounds(child)) {
                child.destroy();
                console.log('rocket out');
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

    accelerate(object, acceleration) {
        object.setAcceleration(acceleration * Math.cos(object.rotation - Math.PI / 2), acceleration * Math.sin(object.rotation - Math.PI / 2))
    }

    trueVelocity(object) {
        return Math.sqrt(object.body.velocity.x ** 2 + object.body.velocity.y ** 2);
    }

    distance( /** @type Phaser.Types.Physics.Arcade.SpriteWithDynamicBody */object, x, y) {
        return Math.sqrt((object.body.x - x) ** 2 + (object.body.y - y) ** 2);
    }

    outOfBounds(object) {
        return object.x > config.width * 1.5 || object.x < config.width * -0.5 || object.y > config.height * 1.5 || object.y < config.height * -0.5;
    }

    damagePlayer(player, enemy) {
        if (Date.now() - player.shieldTime < 1000)
            return;
        player.shieldTime = player.healTime = Date.now();
        player.health--;
        player.setTint(0xff0000);
        this.updateTexts();
        if (player.health == 0)
            this.gameOver();
    }

    damagePlayerRocket(player, enemyRocket) {
        enemyRocket.destroy();
        if (Date.now() - player.shieldTime < 1000)
            return;
        player.shieldTime = player.healTime = Date.now();
        player.health--;
        player.setTint(0xff0000);
        this.updateTexts();
        if (player.health == 0)
            this.gameOver();
    }

    reload() {
        ++this.player.ammo;
        this.player.reloadTime = Date.now();
        this.updateTexts();
    }

    heal() {
        ++this.player.health
        this.player.healTime = Date.now();
        this.updateTexts();
    }

    launchRocket() {
        this.player.ammo--;
        var rocket = this.rockets.create(this.player.x, this.player.y, 'rocket');
        rocket.setVelocity(500 * Math.cos(this.player.rotation - Math.PI / 2), 500 * Math.sin(this.player.rotation - Math.PI / 2));
        rocket.rotation = this.player.rotation;
        this.updateTexts();
    }

    launchEnemyRocket(enemy) {
        var rocket = this.enemyRockets.create(enemy.x, enemy.y, 'rocket2');
        rocket.setVelocity(200 * Math.cos(enemy.rotation - Math.PI / 2), 200 * Math.sin(enemy.rotation - Math.PI / 2));
        rocket.rotation = enemy.rotation;
        rocket.body.mass = 0.2;
        enemy.lastRocket = Date.now();
    }

    spawnEnemy() {
        var x;
        var y;
        do {
            x = Phaser.Math.FloatBetween(0, config.width);
            y = Phaser.Math.FloatBetween(0, config.height);
        }
        while (this.distance(this.player, x, y) < 200);
        var strong = Phaser.Math.FloatBetween(0, 1) > Math.max(0.5, 1 - (Date.now() - this.zero) * 0.00001);
        var enemy = this.enemies.create(x, y, strong ? 'enemy2' : 'enemy');
        var enemySpeed = Phaser.Math.FloatBetween(30, 100);
        enemy.rotation = Phaser.Math.FloatBetween(0, 2 * Math.PI);
        enemy.setVelocity(enemySpeed * Math.cos(enemy.rotation - Math.PI / 2), enemySpeed * Math.sin(enemy.rotation - Math.PI / 2));
        enemy.body.mass = 1;
        enemy.hasRockets = strong;
        enemy.lastRocket = Date.now();
        this.enemies.spawnTime = Date.now();
    }

    destroyEnemy(rocket, enemy) {
        rocket.destroy();
        enemy.destroy();
        ++this.score;
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