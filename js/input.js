//http://keycode.info/

var modelRotSpeed = 0.05;

var camMoveSpeed = 0.1;
var camRotSpeed = 0.01;

var keyState = {};

var isPaused = false;
var canTogglePause = true;
var isCamLocked = true;
var canToggleCamLock = true;

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
		// Spacebar
		if (keyState[32]) {
			rotateCube();
		}

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

		// A
		if (keyState[65]) {
			rotate(player, "left");
		}
		// D
		if (keyState[68]) {
			rotate(player, "right");
		}
		// W
		if (keyState[87]) {
			move(player, "front");
		}
		// S
		if (keyState[83]) {
			move(player, "back");
		}

		// 0
		if (keyState[96]) {
			changeColor(cubeColor);
		}

		// 1
		if (keyState[97]) {
			changeColor(lightColor);
		}

		// 2
		if (keyState[98]) {
			changeColor(lightColor2);
		}

		// 3
		if (keyState[99]) {
			changeColor(lightColor3);
		}
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

	// Tab
	if (keyState[17]) {
		if (isCamLocked && canToggleCamLock) {
			isCamLocked = false;
			canToggleCamLock = false;
		}
		else if (!isCamLocked && canToggleCamLock) {
			isCamLocked = true;
			canToggleCamLock = false;
		}
	}

	if (!keyState[17]) {
		canToggleCamLock = true;
	}
}

/**
 * Change the color of the cube
 * @param {number} color - Hex literal
 */
function changeColor(color) {
	player.material.color.setHex(color);
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