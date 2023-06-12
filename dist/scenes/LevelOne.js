"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Level_1 = __importDefault(require("./Level"));
const EnemySpawner_1 = __importDefault(require("../game/EnemySpawner"));
class LevelOne extends Level_1.default {
    constructor() {
        super("Level1");
    }
    create() {
        super.create();
        this.enemySpawners = [
            new EnemySpawner_1.default(this, 0, 3000, 300, -20, false, 5000, 80000),
            new EnemySpawner_1.default(this, 1, 5000, 700, -50, false, 15000),
            new EnemySpawner_1.default(this, 2, 15000, 7500, 0.8, true, 45000),
            new EnemySpawner_1.default(this, 3, 30000, 10000, 0.7, true, 65000),
            new EnemySpawner_1.default(this, 0, 3000, 1000, 0.99, true, 80000, -1, { velocity: 10 }),
            new EnemySpawner_1.default(this, 4, 60000, 30000, -15000, false, 125000, -1, { x: Number(this.game.config.width) / 2, y: -200, rotation: Math.PI / 2 }),
        ];
    }
    update() {
        super.update();
    }
}
exports.default = LevelOne;
