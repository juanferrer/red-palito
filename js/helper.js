
/**
 * Polyfill degrees to radians
 * @param {number} x - Degrees to be converted
 */
Math.degToRad = function (x) {
    return x * (Math.PI / 180.0);
}


/**
 * Polyfill radians to degrees
 * @param {number} x - Radians to be converted
 */
Math.radToDeg = function (x) {
    return x * (180.0 / Math.PI);
}
