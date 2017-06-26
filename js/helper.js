
/**
 * Math polyfill degrees to radians
 * @param {number} x - Degrees to be converted
 */
Math.degToRad = function (x) {
    return x * (Math.PI / 180.0);
}

/**
 * Math polyfill radians to degrees
 * @param {number} x - Radians to be converted
 */
Math.radToDeg = function (x) {
    return x * (180.0 / Math.PI);
}

var currentSpawnPoint = 0;
var spawnPoints = [];
var spawnPointsX = [15, -5, -12, 10];
var spawnPointsZ = [6, -8, 9, -3];

/**
 * 
 */
function spawnPointsInit() {
    for (var i = 0; i < spawnPointsX.length; ++i) {
        spawnPoints[i] = new THREE.Vector3(spawnPointsX[i], 1, spawnPointsZ[i]);
    }
}

/**
 * Get next available spawn point
 * @return {THREE.Object3D}
 */
function getNextSpawnPoint() {
    var spawnPoint = spawnPoints[currentSpawnPoint];
    currentSpawnPoint = currentSpawnPoint < spawnPoints.length - 1 ? currentSpawnPoint + 1 : 0;
    return spawnPoint;
}

var currentBullet = 0;

function getNextBullet() {
    var bullet = bullets[currentBullet];
    bullet.isAlive = true;
    currentBullet = currentBullet < bullets.length - 1 ? currentBullet + 1 : 0;
    return bullet;
}