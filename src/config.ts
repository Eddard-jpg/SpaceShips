import { GameConstants } from "./Constants";

export let levelsBeaten = localStorage.getItem('levels beaten') ?
    JSON.parse(localStorage.getItem('levels beaten')) :
    Array.from({ length: GameConstants.LEVEL_COUNT + 1 }, () => false);

export let nextLevel = JSON.parse(localStorage.getItem('next level') ?? '0');

export let levelsUnlocked = JSON.parse(localStorage.getItem('levels unlocked') ?? 'false');

export let cheatsEnabled = JSON.parse(localStorage.getItem('cheats enabled') ?? 'false');

export function beatLevel(level: number) {
    levelsBeaten[level] = true;
    localStorage.setItem('levels beaten', JSON.stringify(levelsBeaten));
    setNextLevel();
}

export function setNextLevel() {
    nextLevel = undefined;
    for (let level = 0; level <= GameConstants.LEVEL_COUNT; level++) {
        if (!levelsBeaten[level]) {
            nextLevel = level;
            break;
        }
    }

    nextLevel ??= 10;

    localStorage.setItem('next level', JSON.stringify(nextLevel));
}

export function unlockLevels() {
    levelsUnlocked = true;
    localStorage.setItem('levels unlocked', JSON.stringify(levelsUnlocked));
}

export function toggleCheats() {
    cheatsEnabled = !cheatsEnabled;
    localStorage.setItem('cheats enabled', JSON.stringify(cheatsEnabled));
}

export function resetData() {
    localStorage.removeItem('levels beaten');
    localStorage.removeItem('next level');
    localStorage.removeItem('levels unlocked');
    localStorage.removeItem('cheats enabled');

    levelsBeaten = Array.from({ length: GameConstants.LEVEL_COUNT + 1 }, () => false);
    nextLevel = 0;
    cheatsEnabled = levelsUnlocked = false;
}