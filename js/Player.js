// @ts-nocheck


class Player extends Phaser.Physics.Arcade.Sprite {

    /**
     * @param {Phaser.Scene} scene The scene to which the player belongs
     * @param {number} x The initial x coordinate of the player in the scene
     * @param {number} y The initial x coordinate of the player in the scene
     */
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.score = 0;

        this.body.maxAngular = 200;
        this.setAngularDrag(100);
        this.setDamping(true)
        this.setDrag(0.4, 0.4);
        this.setBounce(0.4);
        this.setCollideWorldBounds();

        this.health = this.maxHealth = 10;
        this.healPeriod = 3000;
        this.healEvent = scene.time.addEvent({
            delay: this.healPeriod,
            callback: this.heal,
            callbackScope: this,
            loop: true,
            paused: true
        });

        this.ammo = this.maxAmmo = 10;
        this.reloadPeriod = 500;
        this.reloadEvent = scene.time.addEvent({
            delay: this.reloadPeriod,
            callback: this.reload,
            callbackScope: this,
            loop: true,
            paused: true
        });

        this.shield = false;
        this.shieldDuration = 1500;

        this.rocketLauncher = new RocketLauncher(this);

        this.rockets = scene.physics.add.group();
        this.level = 0;
        this.scoreThreshold = [35, 100, 250, 500, 1000]
        this.rocketType = [
            this.rocketLauncher.launchStraight.bind(this.rocketLauncher),
            this.rocketLauncher.launchStraight.bind(this.rocketLauncher),
            this.rocketLauncher.launchStraight.bind(this.rocketLauncher),
            this.rocketLauncher.launchArc.bind(this.rocketLauncher),
            this.rocketLauncher.launchArc.bind(this.rocketLauncher),
            this.rocketLauncher.launchArc.bind(this.rocketLauncher),
        ];
        this.rocketCount = [1, 2, 3, 5, 7, 11];
        this.rocketVelocity = [500, 600, 750, 850, 1000, 1250];

        scene.physics.add.collider(this, scene.enemies, this.takeDamage.bind(this));
        scene.physics.add.overlap(scene.enemies, this.rockets, scene.rocketHit.bind(scene));

        // Keys

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = {
            'w': scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            'a': scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            's': scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            'd': scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        }
        this.spaceBar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    /**
     * Sets the player acceleration in x and y based on its rotation.
     * @param {number} acceleration 
     */
    accelerate(acceleration) {
        this.setAcceleration(acceleration * Math.cos(this.rotation - Math.PI * 0.5), acceleration * Math.sin(this.rotation - Math.PI * 0.5))
    }

    heal() {
        ++this.health
        if (this.health == this.maxHealth)
            this.healEvent.paused = true;
    }

    reload() {
        ++this.ammo;
        if (this.ammo == this.maxAmmo)
            this.reloadEvent.paused = true;
    }

    takeDamage(damage = 1) {
        if (this.shield)
            return;

        this.healEvent.paused = false;

        this.health -= typeof damage == Number ? damage : 1;
        this.shield = true;
        this.setTint(0xff0000);

        this.unshield = this.scene.time.addEvent({
            delay: this.shieldDuration,
            callback: () => {
                this.shield = false;
                this.setTint(0xffffff);
            },
            callbackScope: this
        });


        if (this.health <= 0)
            this.scene.gameOver();
    }

    launchRocket() {
        if (this.ammo == this.maxAmmo)
            this.reloadEvent.paused = false;
        this.ammo--;
        this.rocketType[this.level](1, this.rocketCount[this.level], this.rocketVelocity[this.level]);
    }

    update() {
        // Acceleration
        if (this.cursors.up.isDown || this.wasd['w'].isDown)
            this.accelerate(100);
        else if (this.cursors.down.isDown || this.wasd['s'].isDown)
            this.accelerate(-75);
        else
            this.accelerate(0);

        // Angular Acceleration
        if ((this.cursors.right.isDown || this.wasd['d'].isDown))
            this.setAngularAcceleration(100 + (this.body.angularVelocity < 0) * 2 * this.body.angularDrag);
        else if ((this.cursors.left.isDown || this.wasd['a'].isDown))
            this.setAngularAcceleration(-100 - (this.body.angularVelocity > 0) * 2 * this.body.angularDrag);
        else
            this.setAngularAcceleration(0);


        if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && this.ammo > 0)
            this.launchRocket();


        if (this.level < this.scoreThreshold.length && this.score >= this.scoreThreshold[this.level]) {
            this.scene.HUD.levelUp();
            this.level++;
            this.health = ++this.maxHealth;
            this.healEvent.paused = true;
            this.setScale(1 + this.level / 50);
        }

        this.rockets.children.iterate(child => {
            if (child && this.scene.outOfBounds(child))
                child.destroy();
        });
    }

    gameOver() {
        this.unshield.remove();
        this.setTint(0x800000);
    }

}