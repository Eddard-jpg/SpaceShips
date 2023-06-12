import Phaser from "phaser";

/**
 * Returns the rotation of the vector from A to B.
 * @param A First vector.
 * @param B Second vector.
 * @returns the rotation from A to B.
 */
export function rotationAToB(A: Phaser.Types.Math.Vector2Like, B: Phaser.Types.Math.Vector2Like) {
    return Math.atan2(B.y - A.y, B.x - A.x);
}

/**
 * Takes a 2d vector and an angle, returns the vector rotated by that angle.
 * @param vector the vector to be rotated.
 * @param angle the angle of rotation in Radian.
 * @returns the rotated vector.
 */
export function rotateVector(vector: Phaser.Types.Math.Vector2Like, angle: number) {
    return {
        x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle),
    };
}

/**
 * Calculates the euclidean distance between two vectors.
 * @param A First vector
 * @param B Second vector
 * @returns the distance between A and B.
 */
export function distance(A: Phaser.Types.Math.Vector2Like, B: Phaser.Types.Math.Vector2Like): number {
    return Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2);
}

export function secondsToHMS(time: number) {

    var S = (time % 60).toString();
    if (S.length < 2) S = '0' + S;
    time = (time - time % 60) / 60;

    var M = (time % 60).toString();
    if (M.length < 2) M = '0' + M;
    time = (time - time % 60) / 60;

    var H = (time).toString();
    if (H.length < 2) H = '0' + H;
    if (H == '00') H = '';

    return H + (H.length ? ':' : '') + M + ':' + S;
}

/**
 * returns the equivalent angle in the range [-PI, PI].
 * @param angle The angle in radian.
 * 
 */
export function normalizeAngle(angle: number): number {
    angle %= Math.PI * 2;
    if (angle > Math.PI) { angle -= Math.PI * 2; }
    if (angle < -Math.PI) { angle += Math.PI * 2; }
    return angle;
}