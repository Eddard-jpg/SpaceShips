import Phaser from "phaser";
import { EnemyConstants, PlayerConstants } from "../Constants";
import type Level from "./Level";
import type Player from "./Player";
import type Enemy from "./Enemy";

export default class Rocket extends Phaser.Physics.Matter.Sprite {

    body: MatterJS.BodyType;
    scene: Level;

    damage: number;

    /**
     * @param source The source of the rocket. Currently only used to set collisions.
     * @param config The configuration of the rocket.
     */
    constructor(source: Player | Enemy, config: RocketConfig) {
        super(source.scene.matter.world, config.x, config.y, config.type);
        source.scene.rockets.add(this, true);

        this.scene = source.scene;
        this.rotation = config.rotation;
        this.setVelocity(config.velocity * Math.cos(config.rotation), config.velocity * Math.sin(config.rotation));
        this.damage = config.damage;

        // Displace the rocket by source's halfwidth to spawn near the edge instead of the center of the shooter.
        this.x += source.displayWidth / 2 * Math.cos(config.rotation);
        this.y += source.displayWidth / 2 * Math.sin(config.rotation);

        this.setSensor(true);
        this.setCollisionCategory(config.isEnemy ? EnemyConstants.ROCKET_COLLISION_CATEGORY : PlayerConstants.ROCKET_COLLISION_CATEGORY);
        this.setCollidesWith(config.isEnemy ? PlayerConstants.COLLISION_CATEGORY : EnemyConstants.COLLISION_CATEGORY);
        this.setOnCollide((data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
            if (!(data.bodyA.gameObject && data.bodyB.gameObject)) {
                return;
            }
            if (this == data.bodyA.gameObject) {
                data.bodyB.gameObject.takeDamage(this.damage, true);
            } else {
                data.bodyA.gameObject.takeDamage(this.damage, true);
            }
            this.destroy();
        })
        this.setDepth(1);

        this.setFrictionAir(0);

        // Doesn't work. The check for ignoreGravity flag was removed in Engine._bodiesApplyGravity for some reason.
        this.setIgnoreGravity(true);
    }

    /**
    * Determines whether the rocket is out of the scope of the game to destroy it.
    * @returns {boolean}
    */
    outOfBounds(): boolean {
        return this.x < -600 || this.x > Number(this.scene.game.config.width) + 600 || this.y < -600 || this.y > Number(this.scene.game.config.height) + 600;
    }

    update(): void {
        if (this.outOfBounds()) {
            super.destroy();
        }

    }


}
