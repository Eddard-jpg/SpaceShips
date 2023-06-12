import { GameConstants, LevelConstants, PlayerConstants } from "../Constants";

import HUD from "./HUD";
import Player from "./Player";
import type Enemy from "./Enemy";
import Spawner from "./Spawner";
import type Rocket from "./Rocket";
import { beatLevel } from "../config";

export default class Level extends Phaser.Scene {

    static States = {
        RUNNING: Symbol('running'),
        PAUSED: Symbol('paused'),
        VICTORY: Symbol('victory'),
        DEFEAT: Symbol('defeat'),
    }

    static pauseMenuButtonStyle: Phaser.Types.GameObjects.Text.TextStyle = {
        fontSize: '24px',
        backgroundColor: '#808080',
        padding: { y: 15 },
        fixedWidth: 300,
        align: 'center',
    };

    static sureCheckMenuButtonStyle: Phaser.Types.GameObjects.Text.TextStyle = {
        fontSize: '24px',
        backgroundColor: '#808080',
        padding: { y: 15 },
        fixedWidth: 150,
        align: 'center',
    };

    state: Symbol;
    pauseMenu: Phaser.GameObjects.Container;
    sureCheckMenu: Phaser.GameObjects.Container;

    level: number | string;

    hint: string;

    background: Phaser.GameObjects.Image;

    HUD: HUD;

    player: Player;

    enemies: Phaser.GameObjects.Group;
    spawner: Spawner;
    activeSpawnOperationCount: number;
    
    boss: Enemy;

    rockets: Phaser.GameObjects.Group;

    pKey: Phaser.Input.Keyboard.Key;


    constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }


    create() {

        this.background = this.add.image(0, 0, 'sky').setOrigin(0, 0);
        this.background.setScale(Number(this.cameras.main.width) / this.background.width, Number(this.cameras.main.height) / this.background.height);

        this.HUD = new HUD(this);

        this.player = new Player(this, Number(this.cameras.main.width) * 0.5, Number(this.cameras.main.height) * 0.8);

        this.enemies = this.add.group();
        this.spawner = new Spawner(this);
        this.activeSpawnOperationCount = 0;

        this.rockets = this.add.group();

        this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        Object.keys(this.matter.world.walls).forEach(key => {
            let wall: MatterJS.BodyType = this.matter.world.walls[key]
            wall.collisionFilter = {
                category: 1,
                mask: PlayerConstants.COLLISION_CATEGORY,
                group: 0
            };
            wall.friction = 0;
        });

        this.state = Level.States.RUNNING;
        this.time.paused = false;

    }


    update() {

        if (this.state == Level.States.DEFEAT || this.state == Level.States.PAUSED) { return; }

        if (Phaser.Input.Keyboard.JustDown(this.pKey) && this.state != Level.States.VICTORY) { this.pause(); }

        if (this.activeSpawnOperationCount == 0 && this.enemies.getLength() == 0 &&
            this.level != GameConstants.LEVEL_COUNT && this.level != 0 &&
            this.state != Level.States.VICTORY) { this.victory(); }

        this.HUD.update();

        this.player.update();

        this.enemies.children.iterate((child: Enemy) => {
            if (child) {
                child.update();
            }
            return true;
        });

        this.rockets.children.iterate((child: Rocket) => {
            if (child) {
                child.update();
            }
            return true;
        });
    }

    showPauseMenu() {
        this.pauseMenu = this.add.container().setDepth(5);

        const menuBackground = this.add.graphics().fillStyle(0x000000, 0.7)
            .fillRect(0, 0, this.cameras.main.width, this.cameras.main.height).setDepth(2);

        const continueButton = this.createButton(this.cameras.main.width / 2, this.cameras.main.height / 2 - 75, 'Continue', Level.pauseMenuButtonStyle, this.resume);
        const restartButton = this.createButton(continueButton.x, continueButton.y + 75, 'Restart Level', Level.pauseMenuButtonStyle, this.restartButtonEvent);
        const exitButton = this.createButton(continueButton.x, continueButton.y + 150, 'Exit to Main Menu', Level.pauseMenuButtonStyle, this.exitButtonEvent);

        this.pauseMenu.add([menuBackground, continueButton, restartButton, exitButton]);
    }

    createButton(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle, callback: CallableFunction) {
        return this.add.text(x, y, text, style).setOrigin(0.5).setInteractive({}).on('pointerdown', callback, this).setDepth(2);
    }

    pause() {
        this.state = Level.States.PAUSED;
        this.matter.pause();
        this.time.paused = true;
        this.showPauseMenu();
        this.HUD.texts.hintText.setVisible(false);
    }

    resume() {
        if (this.pauseMenu) {
            this.pauseMenu.destroy();
            this.pauseMenu = null;
        }

        let countdown = 3;
        let countdownText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, countdown.toString(), { font: '24px' }).setOrigin(0.5).setDepth(5);
        setTimeout(() => countdownText.text = (--countdown).toString(), 500);
        setTimeout(() => countdownText.text = (--countdown).toString(), 1000);
        setTimeout(() => {
            countdownText.setVisible(false);
            this.state = Level.States.RUNNING;
            this.matter.resume();
            this.time.paused = false;
        }, 1500);
    }

    victory() {
        beatLevel(0);
        beatLevel(this.level as number);
        this.state = Level.States.VICTORY;
        this.time.delayedCall(2000, this.HUD.victory, [], this.HUD);
    }

    defeat() {
        this.spawner.destroy();
        this.state = Level.States.DEFEAT
        this.matter.pause();
        this.time.removeAllEvents();
        this.player.endGame();
        this.HUD.defeat();
    }

    restartButtonEvent() { this.sureCheck('Restart Level', this.restart); }

    exitButtonEvent() { this.sureCheck('Exit to Main Menu', this.exit); }

    restart() { this.scene.start(this.scene.key); }

    exit() { this.scene.start('Menu'); }

    nextLevel() { this.scene.start('Level' + (Number(this.level) + 1)) }

    sureCheck(text: string, callback: CallableFunction) {

        this.pauseMenu.each(button => { if (button instanceof Phaser.GameObjects.Text) { button.input.enabled = false; } });

        this.sureCheckMenu = this.add.container().setDepth(10);

        const menuBackground = this.add.graphics();
        menuBackground.fillStyle(0x404040, 1);
        menuBackground.fillRect(this.cameras.main.width / 2 - 300, this.cameras.main.height / 2 - 25, 600, 150);

        const label = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Are You Sure You Want to ' + text + '?', { font: '20px' }).setOrigin(0.5).setDepth(2);
        const noButton = this.createButton(label.x - 100, label.y + 75, 'No', Level.sureCheckMenuButtonStyle, this.cancelSureCheck);
        const yesButton = this.createButton(label.x + 100, label.y + 75, 'Yes', Level.sureCheckMenuButtonStyle, callback);

        this.sureCheckMenu.add([menuBackground, label, noButton, yesButton]);
    }

    cancelSureCheck() {
        this.sureCheckMenu.destroy();
        this.sureCheckMenu = null;
        this.pauseMenu.each(button => { if (button instanceof Phaser.GameObjects.Text) { button.input.enabled = true; } });
    }

}