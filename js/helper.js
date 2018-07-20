/* globals $, THREE, bullets,
weaponDrops, weaponDropAmount, hpDrops, hpDropAmount, planeSize*/

let currentBullet = 0;
let currentWeaponDrop = 0;
let currentHPDrop = 0;

/**
 * Math polyfill degrees to radians
 * @param {number} x - Degrees to be converted
 */
Math.degToRad = function (x) {
	return x * (Math.PI / 180.0);
};

/**
 * Math polyfill radians to degrees
 * @param {number} x - Radians to be converted
 */
Math.radToDeg = function (x) {
	return x * (180.0 / Math.PI);
};

/**
 * Get a random int between min and max
 * @param {number} min Lower number, inclusive
 * @param {*} max Upper boundary, exclusive
 */
Math.randomInterval = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

/** Get the next bullet to be shoot */
function getNextBullet() { // eslint-disable-line no-unused-vars
	let bullet = bullets[currentBullet];
	bullet.isAlive = true;
	currentBullet = currentBullet < bullets.length - 1 ? currentBullet + 1 : 0;
	return bullet;
}

/**
 * Put JSON in a var and allow the caller to wait until the execution is finished
 * @param {string} file - URI to JSON file to be read
 * @param {Object} object - Object in JSOn to be extracted
 * @param {Object} copyTo - Reference to object to be copied to
 */
function parseJSONToVar(file, object, copyTo) { // eslint-disable-line no-unused-vars
	return $.getJSON(file, function (data) {
		data[object].forEach(v => {
			copyTo.push(v);
		});
	});
}

/** Get the next weapon drop ready */
function getNextWeaponDrop() { // eslint-disable-line no-unused-vars
	const wd = weaponDrops[currentWeaponDrop];
	currentWeaponDrop = currentWeaponDrop < weaponDropAmount - 1 ? currentWeaponDrop + 1 : 0;
	return wd;
}

/** Get the next HP drop ready */
function getNextHPDrop() { // eslint-disable-line no-unused-vars
	const hpd = hpDrops[currentHPDrop];
	currentHPDrop = currentHPDrop < hpDropAmount - 1 ? currentHPDrop + 1 : 0;
	return hpd;
}

/**
 * Get a random position in a plane of maxSize * maxSize
 * @param {number} maxSize Size of plane
 */
function getRandomPosition(maxSize = planeSize) { // eslint-disable-line no-unused-vars
	return new THREE.Vector3(((Math.random() * maxSize) - (maxSize / 2.0)),
		0,
		((Math.random() * maxSize) - (maxSize / 2.0)));
}
