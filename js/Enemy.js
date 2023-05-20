// @ts-nocheck


class Enemy extends Phaser.Physics.Arcade.Sprite {

    /**
     * @param {Phaser.Scene} scene The scene to which this enemy belongs
     * @param {number} level The level of the enemy, higher level enemies are generally stronger, the lowest is 0 and the highest is (currently) 3
     * @param {number} x The initial x coordinate of the enemy in the scene
     * @param {number} y The initial y coordinate of the enemy in the scene
     * @param {number} rotation The rotation of the enemy when spawning
     * @param {number} velocity The velocity of the enemy when spawning. velocity on x and y axes are calculated from this and rotation. 
     * Default is randomised based on level
     */
    constructor(scene, level, x, y, rotation, velocity = null) {
        super(scene, x, y, 'enemy' + (level + 1));
        scene.enemies.add(this, true);


        this.scene = scene
        this.rockets = scene.physics.add.group();
        this.rocketLauncher = new RocketLauncher(this);

        this.level = level;
        this.rotation = rotation;
        velocity = velocity ?? Phaser.Math.FloatBetween([75, 100, 125, 100, 20][level], [125, 150, 175, 150, 20][level]);
        this.setVelocity(velocity * Math.cos(rotation - Math.PI * 0.5), velocity * Math.sin(rotation - Math.PI * 0.5));
        this.setScale([1, 1.3, 1.4, 2, 4][level]);
        this.setBounce(0.2);
        this.body.immovable = [false, false, false, false, true][level];

        this.health = [1, 3, 8, 20, 100][level];
        this.value = [1, 5, 20, 50, 500][level];
        this.fireType = [
            this.rocketLauncher.launchStraight.bind(this.rocketLauncher),
            this.rocketLauncher.launchStraight.bind(this.rocketLauncher),
            this.rocketLauncher.launchStraight.bind(this.rocketLauncher),
            this.rocketLauncher.launch360.bind(this.rocketLauncher),
            this.rocketLauncher.launchRandom.bind(this.rocketLauncher)
        ][level];
        this.fireRate = [0, 50, 100, 200, 100][level];
        this.rocketCount = [0, 1, 1, 8, 20][level];
        this.rocketVelocity = [0, 300, 400, 750, 200][level];
        this.target = [false, false, true, false, true][level];

        this.rocketLauncher.setOperation(
            level + 1,
            this.fireType,
            this.fireRate,
            this.rocketCount,
            this.rocketVelocity,
            this.target
        );
        scene.physics.add.overlap(scene.player, this.rockets, scene.rocketHit.bind(scene));
        // Don't swap the first two arguments even if it's more intuitive. player is a sprite while rockets is a group. player will always be passed to rocketHit as the first arg. Learned the hard way :3

        this.unTint = scene.time.addEvent({});

    }

    takeDamage(damage = 1, byPlayer = false) {

        this.setTint(0xff0000);
        this.unTint.remove();
        this.unTint = this.scene.time.addEvent({
            delay: 200,
            callback: () => { this.setTint(0xffffff); },
            callbackScope: this,
        });

        this.health -= damage
        if (this.health <= 0) {
            if (byPlayer) this.scene.player.score += this.value;
            this.destroy();
        }
    }

    rotationToPlayer() {
        return Math.atan2(this.scene.player.y - this.y, this.scene.player.x - this.x)
    }

    update() {
        this.rockets.children.iterate(child => {
            if (child && this.scene.outOfBounds(child))
                child.destroy();
        });
        if (this.scene.outOfBounds(this))
            this.takeDamage();
    }

    destroy() {
        this.rocketLauncher.destroy()
        this.unTint.destroy();
        super.destroy();
    }

}