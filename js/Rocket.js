// @ts-nocheck


class Rocket extends Phaser.Physics.Arcade.Sprite {

    /**
     * @param {Phaser.Physics.Arcade.Sprite} source The source of the rocket. Currently only used to set collisions.
     * @param {number} type The type of the rocket. Currently only affects the color.
     * @param {number} x The initial x coordinate of the rocket in the scene.
     * @param {number} y The initial y coordinate of the rocket in the scene.
     * @param {number} rotation The rotation of the rocket when spawning.
     * @param {number} velocity The velocity of the rocket when spawning. velocity on x and y axes are calculated from this and rotation.
     * @param {number} damage The amount of health deducted from the object hit by the rocket.
     */
    constructor(source, type, x, y, rotation, velocity, damage = 1) {
        super(source.scene, x, y, 'rocket' + type);
        source.rockets.add(this, true);

        this.scene = source.scene;
        this.rotation = rotation;
        this.setVelocity(velocity * Math.cos(rotation - Math.PI * 0.5), velocity * Math.sin(rotation - Math.PI * 0.5));
        this.damage = damage;

        // Displace the rocket by halfwidth to spawn from the edge instead of the center of the shooter.
        this.x += source.body.halfWidth * Math.cos(rotation - Math.PI * 0.5);
        this.y += source.body.halfWidth * Math.sin(rotation - Math.PI * 0.5);

        this.setDepth(1);
    }



}
