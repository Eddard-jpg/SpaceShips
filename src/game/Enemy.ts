import Phaser from "phaser";
import { EnemyConstants, LevelConstants, PlayerConstants } from "../Constants";
import type Level from "./Level";
import RocketLauncher from "./RocketLauncher";
import { normalizeAngle, rotationAToB } from "../functions";


export default class Enemy extends Phaser.Physics.Matter.Sprite {

    scene: Level;

    body: MatterJS.BodyType;

    level: number;
    health: number;
    value: number;
    maxVelocity: number;
    maxAngularVelocity: number;
    followsPlayer: boolean;

    rocketLauncher: RocketLauncher;

    defaultTint: number;
    untint: Phaser.Time.TimerEvent;


    /**
     * @param {Level} scene The scene to which this enemy belongs.
     * @param {number} type The enemy type.
     * @param {EnemyConfig} config Configuration for the enemy.
     */
    constructor(scene: Level, type: number, config: EnemyConfig) {
        super(scene.matter.world, config.x, config.y, 'enemy' + type);

        this.rotation = config.rotation;
        this.followsPlayer = config.followsPlayer;

        this.setTint(this.defaultTint = config.defaultTint);

        this.setBounce(EnemyConstants.BOUNCE);
        this.setFriction(EnemyConstants.FRICTION, EnemyConstants.FRICTION_AIR);

        this.setCollisionCategory(EnemyConstants.COLLISION_CATEGORY);
        this.setCollidesWith(PlayerConstants.COLLISION_CATEGORY | PlayerConstants.ROCKET_COLLISION_CATEGORY | EnemyConstants.COLLISION_CATEGORY);
        this.setOnCollide((data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
            if (data.bodyA.gameObject == scene.player) {
                data.bodyA.gameObject.takeDamage()
            }
            if (data.bodyB.gameObject == scene.player) {
                data.bodyB.gameObject.takeDamage()
            }
        });

    }

    update() {
        this.thrust(this.maxVelocity * EnemyConstants.FRICTION_AIR * this.body.mass / LevelConstants.DELTA_TIME_SQUARED);

        if (this.followsPlayer) {
            let playerDirection = rotationAToB(this, this.scene.player);
            let myDirection = normalizeAngle(this.rotation);
            if (playerDirection < myDirection) { playerDirection += Math.PI * 2; }

            if (playerDirection - myDirection < myDirection + Math.PI * 2 - playerDirection) {
                this.body.torque = this.maxAngularVelocity * this.body.frictionAir * this.body.inertia / LevelConstants.DELTA_TIME_SQUARED;
            } else {
                this.body.torque = -this.maxAngularVelocity * this.body.frictionAir * this.body.inertia / LevelConstants.DELTA_TIME_SQUARED;
            }
        }
        if (this.outOfBounds()) { this.destroy(); }
    }

    takeDamage(damage = 1, byPlayer = false) {

        this.health -= damage
        if (this.health <= 0) {
            if (byPlayer) {
                this.scene.player.score += this.value;
            }
            this.destroy();
            return;
        }

        this.setTint(0xff0000);
        this.untint?.remove();
        this.untint = this.scene.time.addEvent({
            delay: 200,
            callback: () => { this.setTint(this.defaultTint); },
            callbackScope: this,
        });
    }

    /**
    * Determines whether the enemy is out of the scope of the scene to destroy it.
    * @returns {boolean}
    */
    outOfBounds(): boolean {
        return this.x < -600 || this.x > Number(this.scene.game.config.width) + 600 || this.y < -600 || this.y > Number(this.scene.game.config.height) + 600;
    }

    destroy() {
        this.untint?.destroy();
        this.rocketLauncher?.destroy();
        super.destroy();
    }

}