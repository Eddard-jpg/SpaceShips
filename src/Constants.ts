export const GameConstants = {
    MIN_WIDTH: 1280,
    MAX_WIDTH: 2560,
    MIN_HEIGHT: 720,
    MAX_HEIGHT: 1440,
    ASPECT_RATIO: 16 / 9,
    LEVEL_COUNT: 10,

}

export const LevelConstants = {
    WALLS_COLLISION_CATEGORY: 1,
    WALLS_BOUNCE: 0.6,

    DELTA_TIME: 1000 / 60,
    DELTA_TIME_SQUARED: (1000 / 60) * (1000 / 60),
};

export const PlayerConstants = {
    FRICTION: 0.02,
    FRICTION_AIR: 0.02,

    BOUNCE: 0.7,

    SCORE_THRESHOLD_VALUES: [35, 100, 300, 1000, 2500, 5000],

    HEALTH_VALUES: [5, 7, 9, 12, 15, 20, 30],
    HEAL_PERIOD_VALUES: [4000, 3750, 3500, 3250, 3000, 2500, 2500],

    AMMO_VALUES: [10, 12, 14, 16, 18, 20, 20],
    RELOAD_PERIOD_VALUES: [750, 700, 650, 600, 550, 500, 500],

    SHIELD_DURATION_VALUES: [800, 900, 1000, 1150, 1300, 1500, 1500],

    MAX_VELOCITY_VALUES: [5, 5.5, 6, 6.75, 7.5, 8.5, 10],
    MAX_ANGULAR_VELOCITY_VALUES: [0.075, 0.08, 0.085, 0.09, 0.095, 0.1, 0.11],
    SCALE_FACTORS: [1, 1.1, 1.2, 1.35, 1.5, 1.7, 2],

    FIRE_TYPE_VALUES: ["straight", "straight", "straight", "arc", "arc", "arc", "arc"],
    ROCKET_DAMAGE_VALUES: [],
    ROCKET_COUNT_VALUES: [1, 2, 3, 5, 7, 11, 15],
    ROCKET_VELOCITY_VALUES: [10, 12, 15, 17, 20, 25, 30],

    COLLISION_CATEGORY: 2,
    ROCKET_COLLISION_CATEGORY: 8,
};

export const EnemyConstants = {
    FRICTION: 0.02,
    FRICTION_AIR: 0.02,

    BOUNCE: 0.7,

    HEALTH_VALUES: [1, 3, 8, 20, 100],
    VALUE_POINTS: [1, 5, 20, 50, 250],

    MAX_VELOCITY_MIN_VALUES: [1.25, 1.75, 2.25, 1.75, 0.4],
    MAX_VELOCITY_MAX_VALUES: [2.75, 3.25, 3.75, 3.25, 0.4],

    MAX_ANGULAR_VELOCITY: 0.025,

    SCALE_FACTORS: [1, 1.3, 1.4, 2, 5],
    DENSITY_VALUES: [0.0008, 0.001, 0.001, 0.0013, 0.003],

    COLLISION_CATEGORY: 4,
    ROCKET_COLLISION_CATEGORY: 16,
};

export const tutorialTexts = [
    "Welcome to SpaceShips!\n\n" +
    "In this tutorial, you will learn the basics of the game and how to play.\n\n" +
    "Feel free to skip the tutorial at any time.",

    "You are the pilot of a little cute spaceship, and your primary goal is to survive each level.",

    "Control your spaceship using WASD or arrow keys.\n\n" +
    "Press the Spacebar to fire rockets and eliminate enemies.\n\n" +
    "Press P to pause the game at any time.\n\n" +
    "Take a moment to get familiar with the controls. Press Next when you're ready.",

    "Be careful! Enemies will appear and try to attack you.\n\n" +
    "If an enemy ship or its weapons hit you, your health will decrease.\n\n" +
    "If your health reaches zero, it's game over. :c",

    "Destroying enemy ships will earn you points and increase your score.\n\n" +
    "As your score grows, your spaceship will level up!\n\n" +
    "Survive the upcoming wave and defeat as many enemy ships as possible to level up.",

    "Upon leveling up, your spaceship becomes bigger, stronger, faster, and more resilient.\n\n" +
    "You will also fully restore your health and ammo, which can save you in tough situations.",

    "That's it the tutorial. You are now ready to save the galaxy or whatever. :3\n\n" +
    "Good luck! c:"
];