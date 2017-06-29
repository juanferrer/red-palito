//http://keycode.info/

var modelRotSpeed = 0.05;

var camMoveSpeed = 0.1;
var camRotSpeed = 0.01;

var keyState = {};

var isPaused = false;
var canTogglePause = true;

var canToggleShift = true;

/**
 * Initialise keyboard to keep track what keys have
 * are pressed
 */
function keyboardInit() {
	// https://stackoverflow.com/a/12273538/7179042
	// Keep track of what keys are down and update in loop
	window.addEventListener('keydown', function (e) {
		keyState[e.keyCode || e.which] = true;
	}, true);
	window.addEventListener('keyup', function (e) {
		keyState[e.keyCode || e.which] = false;
	}, true);
}

/**
 * Check what keys have been pressed since last
 * frame and react accordingly
 */
function resolveInput() {
	if (!isPaused) {

		// DEBUG: Numpad +
		if (keyState[107]) {
		}

		// Spacebar
		if (keyState[32]) {
			player.attack();
		}

		// Shift
		if (keyState[16]) {
			if (canToggleShift) {
				player.nextWeapon();
				canToggleShift = false;
			}
		}

		// A
		if (keyState[65]) {
			player.rotateLeft();
		}
		// D
		if (keyState[68]) {
			player.rotateRight();
		}
		// W
		if (keyState[87]) {
			player.moveForward();
		}
		// S
		if (keyState[83]) {
			player.moveBackward();
		}

		// unused

		// Left
		if (keyState[37]) {
			move(camera, "left");
		}
		// Right
		if (keyState[39]) {
			move(camera, "right");
		}
		// Up
		if (keyState[38]) {
			move(camera, "front");
		}
		// Down
		if (keyState[40]) {
			move(camera, "back");
		}

		// 0
		if (keyState[96]) {
			changeColor(0xFFFFFF);
		}

		// 1
		if (keyState[97]) {
			changeColor(0xF44336);
		}

		// 2
		if (keyState[98]) {
			changeColor(lightColor2);
		}

		// 3
		if (keyState[99]) {
			changeColor(lightColor3);
		}

		// End of unused
	}

	// P
	if (keyState[80]) {
		if (isPaused && canTogglePause) {
			isPaused = false;
			canTogglePause = false;
		}
		else if (!isPaused && canTogglePause) {
			isPaused = true;
			canTogglePause = false;
		}
	}
	if (!keyState[80]) {
		canTogglePause = true;
	}

	// Release shift
	if (!keyState[16]) {
		canToggleShift = true;
	}
}

/**
 * Change the color of the cube
 * @param {number} color - Hex literal
 */
function changeColor(color) {
	player.Material.color.setHex(color);
}

/**
 * 
 */
function rotateCube() {
	player.rotation.x += modelRotSpeed;
	player.rotation.y += modelRotSpeed;
}

/**
 * Move camera locally. TODO: global
 * @param {string} dir - Direction of movement
 * @param {THREE.Object3D} obj - Object to be moved
 */
function move(obj, dir) {
	switch (dir) {
		case "left":
			obj.translateX(-camMoveSpeed);
			break;
		case "right":
			obj.translateX(camMoveSpeed);
			break;
		case "front":
			obj.translateZ(-camMoveSpeed);
			break;
		case "back":
			obj.translateZ(camMoveSpeed);
			break;
	}
}

/**
 * Rotate camera locally. TODO: global
 * @param {string} dir - Direction of rotation
 * @param {THREE.Object3D} obj - Object to be moved
 */
function rotate(obj, dir) {
	switch (dir) {
		case "left":
			obj.rotateY(camRotSpeed);
			break;
		case "right":
			obj.rotateY(-camRotSpeed);
			break;
		case "up":
			obj.rotateX(camRotSpeed);
			break;
		case "down":
			obj.rotateX(-camRotSpeed);
			break;
	}
}