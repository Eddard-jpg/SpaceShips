/**
 * Configuration options for an enemy.
 */
type EnemyConfig = {
    /**
     * The type of the enemy.
     */
    type: number;
    /**
     * The initial horizontal position of the enemy.
     */
    x?: number;
    /**
     * The initial vertical position of the enemy.
     */
    y?: number;
    /**
     * The initial rotation of the enemy.
     */
    rotation?: number;
    /**
     * Multipliers applied to enemy stats.
     */
    multipliers?: EnemyStatsMultipliers;
    /**
     * The default tint applied to the enemy.
     */
    defaultTint?: number;
    /**
     * Determines whether the enemy follows the player.
     */
    followsPlayer?: boolean;
    /**
     * Configuration options for the rocket launcher.
     */
    rocketLauncherConfig?: RocketLauncherConfig;
};

/**
 * Multipliers applied to enemy stats.
 */
type EnemyStatsMultipliers = {
    /**
     * The multiplier applied to the enemy's health.
     */
    health?: number;
    /**
     * The multiplier applied to the enemy's value.
     */
    value?: number;
    /**
     * The multiplier applied to the enemy's velocity.
     */
    velocity?: number;
    /**
     * The multiplier applied to the enemy's angular velocity.
     */
    angularVelocity?: number;
    /**
     * The multiplier applied to the enemy's scale.
     */
    scale?: number;
    /**
     * The multiplier applied to the enemy's density.
     */
    density?: number;
};

/**
 * Configuration options for a spawner.
 */
type SpawnOperationConfig = {
    /**
     * Initial period between spawns in milliseconds.
     */
    period: number;
    /**
     * Minimum possible period in milliseconds.
     * Default: 100.
     */
    minPeriod?: number;
    /**
     * Changes the period after each spawn.
     * If `multiplicative` is `true`, the period is multiplied by the `step` value;
     * otherwise, the `step` value is added to the period in milliseconds.
     * Note: For non-decreasing difficulty, use a `step` value in the range (0, 1] if `true`,
     * or (-infinity, 0] if `false`.
     * Default: 1 if multiplicative is true, 0 otherwise.
     */
    step?: number;
    /**
     * Determines whether the `step` value is treated as a multiplier (`true`)
     * or an additive value (`false`) when changing the period after each spawn.
     * Default: false.
     */
    multiplicative?: boolean;
    /**
     * The time in milliseconds after which the spawning begins.
     * Should always be non-negative.
     * Default: 0.
     */
    startAfter?: number;
    /**
     * The time in milliseconds after which the spawning stops.
     * If the value is less than `startAfter`, it will spawn enemies indefinitely.
     * Default: -1.
     */
    endAfter?: number;
    /**
     * Configuration for spawned enemies.
     */
    enemyConfig: EnemyConfig;
};

/**
 * Configuration for a rocket.
 */
type RocketConfig = {
    /**
     * The texture key for the rocket.
     */
    type: string;
    /**
     * The initial x-coordinate of the rocket.
     */
    x?: number;
    /**
     * The initial y-coordinate of the rocket.
     */
    y?: number;
    /**
     * The initial rotation of the rocket.
     */
    rotation?: number;
    /**
     * The velocity of the rocket.
     */
    velocity: number;
    /**
     * The damage dealt by the rocket upon hit.
     */
    damage?: number;
    /**
     * Determines whether the rocket is launched by an enemy. Default: false.
     */
    isEnemy?: boolean;
    /**
     * Determines whether the rocket follows the player. Only applicaple if `isEnemy` is true. Default: false.
     */
    isGuided?: boolean;
};

/**
 * Configuration for a rocket launching event.
 */
type RocketLaunchEventConfig = {
    /**
     * Determines `centerPosition`, `centerRotation`, `totalPositionDelta`, and `totalRotationDelta` based on a preset pattern.
     * Preset patterns are: "straight", "arc", "360", "random".
     * Overrides the related members.
     */
    presetPattern?: string;
    /**
     * The set patterns to choose randomly from. 
     * Chooses from all set patterns if left empty.
     * Repeating a pattern key will increase its likelyhood.
     * Only applicable if `presetPattern` is set to "random".
     */
    presetPatternChoices?: string[];
    /**
     * The position of the middle rocket (or average of 2 middle rockets if the number is even).
     * Overridden by `presetPattern`.
     * default: {x: 0, y: 0}.
     */
    centerPosition?: Phaser.Types.Math.Vector2Like;
    /**
     * The distance between the first and last rocket.
     * Overridden by `presetPattern`.
     * Only applicable if `rocketCount` > 1
     * default: {x: 0, y: 0}.
     */
    totalPositionDelta?: Phaser.Types.Math.Vector2Like;
    /**
     * The rotation of the middle rocket (or average of 2 middle rockets if the number is even).
     * Overridden by `isTargeted` and/or `presetPattern`.
     * default: 0.
     */
    centerRotation?: number;
    /**
     * The difference in rotation between the first and last rocket.
     * Overridden by `presetPattern`.
     * Only applicable if `rocketCount` > 1.
     * default: 0.
     */
    totalRotationDelta?: number;
    /**
     * How the rockets rotation is set with `centerRotation`. 
     * 
     * Valid options are "relative" (rotation = centerRotation + source's rotation), "absolute" (rotation = centerRotation), and "player" (rotation is towards the player).
     * 
     * Default: "relative".
     */
    target?: string;
    /**
     * The number of rockets to be fired.
     */
    rocketCount: number;
    /**
     * Configuration for the rockets launched.
     */
    rocketConfig: RocketConfig;
};

/**
 * Configuration for a rocket launching operation.
 */
type RocketLaunchOperationConfig = {
    /**
     * Configuration for the rocket launching events.
     */
    launchEventConfig: RocketLaunchEventConfig;
    /**
     * The frequency at which rockets are launched. Rockets will be launched every 100/`fireRate` seconds.
     */
    fireRate: number;
    /**
     * The delay before the rocket launching operation starts. Default: 0.
     */
    startAfter?: number,
    /**
     * The duration of the rocket launching operation after resuming before pausing. If non-positive, the operation continues indefinitely. Default: -1.
     */
    resumeFor?: number;
    /**
     * The duration of the pause between rocket launching operations. If non-positive, the operation pauses indefinitely. Default: -1.
     */
    pauseFor?: number;
};

    /**
     * Configuration options for a rocket launcher.
     */
type RocketLauncherConfig = {
    /**
     * Launching operations used. Default: []
     */
    OperationConfigs?: RocketLaunchOperationConfig[],
    /**
     * Determines whether the default operations are used in addition to added operations. Only used in the `EnemyConfig` context. Default: false.
     */
    keepDefaults?: boolean,
}