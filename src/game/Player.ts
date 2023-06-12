import Phaser from "phaser";
import { EnemyConstants, LevelConstants, PlayerConstants } from "../Constants";
import Level from "./Level";
import RocketLauncher from "./RocketLauncher";
import { cheatsEnabled } from "../config";
import type Enemy from "./Enemy";
import { distance, rotationAToB } from "../functions";


export default class Player extends Phaser.Physics.Matter.Sprite {


    body: MatterJS.BodyType;
    scene: Level;

    level: number;
    score: number;
    scoreThreshold: number[];

    health: number;
    maxHealth: number;
    healPeriod: number;
    healEvent: Phaser.Time.TimerEvent;

    ammo: number;
    maxAmmo: number;
    reloadPeriod: number;
    reloadEvent: Phaser.Time.TimerEvent;

    isShielded: boolean;
    shieldDuration: number;
    unshield: Phaser.Time.TimerEvent;

    rocketLauncher: RocketLauncher;

    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd: {
        w: Phaser.Input.Keyboard.Key;
        a: Phaser.Input.Keyboard.Key;
        s: Phaser.Input.Keyboard.Key;
        d: Phaser.Input.Keyboard.Key;
    };
    spaceBar: Phaser.Input.Keyboard.Key;
    zKey: Phaser.Input.Keyboard.Key;
    xKey: Phaser.Input.Keyboard.Key;
    cKey: Phaser.Input.Keyboard.Key;

    /**
     * @param {Level} scene The scene to which the player belongs
     * @param {number} x The initial x coordinate of the player in the scene
     * @param {number} y The initial x coordinate of the player in the scene
     */
    constructor(scene: Level, x: number, y: number) {
        super(scene.matter.world, x, y, 'player');
        scene.add.existing(this);

        this.scene = scene;
        this.rotation = -Math.PI / 2;
        this.setBounce(PlayerConstants.BOUNCE);
        this.setFriction(PlayerConstants.FRICTION, PlayerConstants.FRICTION_AIR);
        this.setDensity(cheatsEnabled ? this.body.density * 5 : this.body.density);

        this.score = 0;
        this.level = 0;

        this.health = this.maxHealth = PlayerConstants.HEALTH_VALUES[this.level];
        this.healPeriod = PlayerConstants.HEAL_PERIOD_VALUES[this.level];
        this.healEvent = scene.time.addEvent({
            delay: this.healPeriod,
            callback: this.heal,
            callbackScope: this,
            loop: true,
            paused: true
        });

        this.ammo = this.maxAmmo = PlayerConstants.AMMO_VALUES[this.level];
        this.reloadPeriod = PlayerConstants.RELOAD_PERIOD_VALUES[this.level];
        this.reloadEvent = scene.time.addEvent({
            delay: this.reloadPeriod,
            callback: this.reload,
            callbackScope: this,
            loop: true,
            paused: true
        });

        this.isShielded = false;
        this.shieldDuration = PlayerConstants.SHIELD_DURATION_VALUES[this.level];

        this.rocketLauncher = new RocketLauncher(this);

        this.setCollisionCategory(PlayerConstants.COLLISION_CATEGORY);
        this.setCollidesWith(LevelConstants.WALLS_COLLISION_CATEGORY | EnemyConstants.COLLISION_CATEGORY | EnemyConstants.ROCKET_COLLISION_CATEGORY);

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = {
            'w': scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            'a': scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            's': scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            'd': scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        }
        this.spaceBar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.zKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.xKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.cKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    }

    update() {
        if (this.scene.state == Level.States.VICTORY) { this.restore(); }

        if (this.cursors.up.isDown || this.wasd['w'].isDown) {
            this.thrust(PlayerConstants.MAX_VELOCITY_VALUES[this.level] * PlayerConstants.FRICTION_AIR * this.body.mass / LevelConstants.DELTA_TIME_SQUARED);
        } else if (this.cursors.down.isDown || this.wasd['s'].isDown) {
            this.thrust(-PlayerConstants.MAX_VELOCITY_VALUES[this.level] * PlayerConstants.FRICTION_AIR * this.body.mass / LevelConstants.DELTA_TIME_SQUARED);
        }

        // MatterJS considers positive torque to be clockwise.
        if ((this.cursors.left.isDown || this.wasd['a'].isDown)) {
            this.body.torque = -PlayerConstants.MAX_ANGULAR_VELOCITY_VALUES[this.level] * PlayerConstants.FRICTION_AIR * this.body.inertia / LevelConstants.DELTA_TIME_SQUARED;
        } else if ((this.cursors.right.isDown || this.wasd['d'].isDown)) {
            this.body.torque = PlayerConstants.MAX_ANGULAR_VELOCITY_VALUES[this.level] * PlayerConstants.FRICTION_AIR * this.body.inertia / LevelConstants.DELTA_TIME_SQUARED;
        }


        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) { this.launchRocket(); }

        if (this.level < PlayerConstants.SCORE_THRESHOLD_VALUES.length && this.score >= PlayerConstants.SCORE_THRESHOLD_VALUES[this.level]) { this.levelUp(); }

        if (cheatsEnabled) {
            if (Phaser.Input.Keyboard.JustDown(this.zKey)) { this.levelUp(); }
            if (this.xKey.isDown) { this.pushEverything(0.003); }
            if (this.cKey.isDown) { this.pullEverything(0.003); }
        }

    }

    restore() {

        this.health = this.maxHealth - 1;
        this.heal()
        this.ammo = this.maxAmmo - 1;
        this.reload();
    }

    heal() {
        ++this.health
        if (this.health == this.maxHealth) {
            this.healEvent.paused = true;
            this.healEvent.elapsed = 0;
        }
    }

    reload() {
        ++this.ammo;
        if (this.ammo == this.maxAmmo) {
            this.reloadEvent.paused = true;
            this.reloadEvent.elapsed = 0;
        }
    }

    takeDamage(damage = 1) {
        if (this.isShielded || this.scene.state != Level.States.RUNNING) { return; }

        this.healEvent.paused = false;

        this.health -= damage;
        this.isShielded = true;
        this.setTint(0xff0000);

        this.unshield = this.scene.time.addEvent({
            delay: this.shieldDuration,
            callback: () => {
                this.isShielded = false;
                this.setTint(0xffffff);
            },
            callbackScope: this
        });


        if (this.health <= 0) {
            this.setTint(0x800000);
            this.scene.defeat();
        }
    }

    launchRocket() {
        if (this.ammo == 0) { return; }
        if (this.ammo == this.maxAmmo) {
            this.reloadEvent.paused = false;
            this.reloadEvent.elapsed = 0;
        }
        this.ammo--;
        this.rocketLauncher.launchOnce({
            rocketConfig: {
                type: "rocket1",
                velocity: PlayerConstants.ROCKET_VELOCITY_VALUES[this.level]
            },
            presetPattern: PlayerConstants.FIRE_TYPE_VALUES[this.level],
            rocketCount: PlayerConstants.ROCKET_COUNT_VALUES[this.level],
        });
    }

    levelUp() {
        this.scene.HUD.levelUp();
        if (this.level < PlayerConstants.SCORE_THRESHOLD_VALUES.length) this.level++;

        this.setScale(PlayerConstants.SCALE_FACTORS[this.level]);

        this.health = this.maxHealth = PlayerConstants.HEALTH_VALUES[this.level];
        this.healPeriod = PlayerConstants.HEAL_PERIOD_VALUES[this.level];
        this.healEvent.reset({
            delay: this.healPeriod,
            callback: this.heal,
            callbackScope: this,
            loop: true,
            paused: true
        });


        this.ammo = this.maxAmmo = PlayerConstants.AMMO_VALUES[this.level];
        this.reloadPeriod = PlayerConstants.RELOAD_PERIOD_VALUES[this.level];
        this.reloadEvent.reset({
            delay: this.reloadPeriod,
            callback: this.reload,
            callbackScope: this,
            loop: true,
            paused: true
        });


        this.shieldDuration = PlayerConstants.SHIELD_DURATION_VALUES[this.level];
    }

    pullEverything(force: number) {
        this.pushEverything(-force);
    }

    pushEverything(_force: number) {
        this.scene.enemies.children.each((enemy: Enemy) => {
            let force = _force * (100 / distance(this, enemy)) ** 0.5;
            if (!enemy) { return; }
            let angle = rotationAToB(this, enemy);
            this.applyForce(new Phaser.Math.Vector2(-force * Math.cos(angle), -force * Math.sin(angle)))
            enemy.applyForce(new Phaser.Math.Vector2(force * Math.cos(angle), force * Math.sin(angle)));
            return true;
        });
    }

    endGame() {
        this.unshield.remove();
    }

}