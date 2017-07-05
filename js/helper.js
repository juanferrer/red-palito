
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

Math.randomInterval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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

/**
 * Put JSON in a var and allow the caller to wait until the execution is finished
 * @param {*} file - URI to JSON file to be read
 * @param {*} object - Object in JSOn to be extracted
 * @param {*} copyTo - Reference to object to be copied to
 */
function parseJSONToVar(file, object, copyTo) {
    return $.getJSON(file, function (data) {
        for (var i = 0; i < data[object].length; ++i) {
            copyTo.push(data[object][i]);
        }
    });
}

var currentWeaponDrop = 0;

function getNextWeaponDrop() {
    var wd = weaponDrops[currentWeaponDrop];
    currentWeaponDrop = currentWeaponDrop < weaponDropAmount - 1 ? currentWeaponDrop + 1 : 0;
    return wd;
}

var currentHPDrop = 0;

function getNextHPDrop() {
    var hpd = hpDrops[currentHPDrop];
    currentHPDrop = currentHPDrop < hpDropAmount - 1 ? currentHPDrop + 1 : 0;
    return hpd;
}