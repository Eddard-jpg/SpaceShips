import Phaser from "phaser";
import { GameConstants, LevelConstants } from "../Constants";
import { cheatsEnabled, levelsBeaten, levelsUnlocked, nextLevel, resetData, toggleCheats, unlockLevels as unlockLevels } from "../config";
import Level from "./Level";
import type Enemy from "./Enemy";
import type Rocket from "./Rocket";
import { titleStyle, menuButtonStyle, beatenLevelsStyle, unlockedLevelsStyle, lockedLevelsStyle } from "../styles";

export default class Menu extends Level {
    constructor() {
        super('Menu');
    }

    mainMenu: Phaser.GameObjects.Container;
    levelsMenu: Phaser.GameObjects.Container;
    settingsMenu: Phaser.GameObjects.Container;

    create() {
        this.runBackground();
        this.showMainMenu();
    }

    createButton(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle, callback: CallableFunction) {
        return this.add.text(x, y, text, style).setOrigin(0.5).setInteractive().on('pointerdown', callback, this);
    }

    hideAll() {
        this.mainMenu?.destroy();
        this.levelsMenu?.destroy();
        this.settingsMenu?.destroy();
    }

    showMainMenu() {
        this.hideAll();

        let centerX = Math.floor(Number(this.game.config.width) / 2);

        let title = this.add.text(centerX, 100, 'SpaceShips', titleStyle).setOrigin(0.5);

        let startButton = this.createButton(centerX, 200, 'Play', menuButtonStyle, this.start);
        let levelsButton = this.createButton(centerX, 275, 'Levels', menuButtonStyle, this.showLevels);
        let survivalButton = this.createButton(centerX, 350, 'Survival', menuButtonStyle, this.startSurvival);
        let settingsButton = this.createButton(centerX, 425, 'Settings', menuButtonStyle, this.showSettings);

        this.mainMenu = this.add.container().setDepth(2);
        this.mainMenu.add([title, startButton, levelsButton, survivalButton, settingsButton]);
    }

    showLevels() {
        this.hideAll();

        let centerX = Math.floor(Number(this.game.config.width) / 2);

        let title = this.add.text(centerX, 100, 'Levels', titleStyle).setOrigin(0.5);
        let backButton = this.createButton(centerX, 600, 'Back', menuButtonStyle, this.showMainMenu);

        this.levelsMenu = this.add.container().setDepth(2);
        this.levelsMenu.add([title, backButton]);

        let remainingUnlocked = 3;
        for (let level = 0; level <= GameConstants.LEVEL_COUNT; level++) {
            let levelButton: Phaser.GameObjects.Text;
            if (level == 0) {
                levelButton = this.add.text(centerX, 250, "Tutorial", menuButtonStyle).setOrigin(0.5).setDepth(2);
            } else if (levelsUnlocked) {
                levelButton = this.add.text(
                    centerX - 200 + 100 * ((level - 1) % 5),
                    340 + Math.floor((level - 1) / 5) * 100,
                    String(level),
                    levelsBeaten[level] ? beatenLevelsStyle : unlockedLevelsStyle
                ).setOrigin(0.5).setDepth(2);
            } else {
                levelButton = this.add.text(
                    centerX - 200 + 100 * ((level - 1) % 5),
                    340 + Math.floor((level - 1) / 5) * 100,
                    String(level),
                    levelsBeaten[level] ? beatenLevelsStyle : remainingUnlocked > 0 ? unlockedLevelsStyle : lockedLevelsStyle,
                ).setOrigin(0.5).setDepth(2);
            }
            if (levelsUnlocked || !level || levelsBeaten[level] || remainingUnlocked-- > 0) { levelButton.setInteractive().on('pointerdown', () => { this.scene.start('Level' + level); }); }
            this.levelsMenu.add(levelButton);

        };

    }

    showSettings() {
        this.hideAll();

        let centerX = Math.floor(Number(this.game.config.width) / 2);

        let title = this.add.text(centerX, 100, 'Settings', titleStyle).setOrigin(0.5);

        let toggleCheatsButton = this.createButton(centerX, 250, (cheatsEnabled ? 'Disable' : 'Enable') + ' Cheats', menuButtonStyle, this.toggleCheats);
        let cheatsHint = this.add.text(centerX + 200, 250, 'Try Z, X, C.');
        let unlockLevelsButton = this.createButton(centerX, 350, "Unlock All Levels", menuButtonStyle, unlockLevels);
        let resetDataButton = this.createButton(centerX, 450, 'Reset Data', menuButtonStyle, this.resetData);
        let backButton = this.createButton(centerX, 600, 'Back', menuButtonStyle, this.showMainMenu);

        this.settingsMenu = this.add.container().setDepth(2);
        this.settingsMenu.add([title, toggleCheatsButton, cheatsHint, unlockLevelsButton, resetDataButton, backButton]);
    }

    start() {
        console.log(nextLevel);
        this.scene.start('Level' + nextLevel);
    }

    startSurvival() { this.scene.start('LevelX'); }

    toggleCheats() {
        toggleCheats();
        this.showSettings();
    }

    resetData() {
        resetData();
        this.showMainMenu();
    }


    runBackground() {
        super.create();
        this.HUD.hideAll();
        this.player.y = this.cameras.main.height / 2;
        this.player.setCollidesWith(LevelConstants.WALLS_COLLISION_CATEGORY);
        this.player.setVisible(false);

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
            },
            period: 4000,
            minPeriod: 1000,
            step: -50,
            startAfter: 2000,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                multipliers: {
                    velocity: 3
                },
            },
            period: 3000,
            minPeriod: 1000,
            step: -50,
            startAfter: 55000,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                multipliers: {
                    velocity: 10
                },
            },
            period: 3000,
            minPeriod: 1000,
            step: -50,
            startAfter: 90000,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 2,
            },
            period: 8000,
            minPeriod: 4000,
            step: -100,
            startAfter: 10000,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 3,
            },
            period: 15000,
            minPeriod: 7500,
            step: 0.95,
            multiplicative: true,
            startAfter: 25000,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 4,
            },
            period: 25000,
            minPeriod: 10000,
            step: 0.9,
            multiplicative: true,
            startAfter: 40000,
        });

        this.spawner.addOperation({
            enemyConfig: {
                type: 1,
                multipliers: {
                    velocity: 2,
                    scale: 10,
                    density: 10,
                },
            },
            period: 60000,
            startAfter: 75000,
        })
    }

    update(): void {

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
}