//http://keycode.info/

var modelRotSpeed = 0.05;

var camMoveSpeed = 0.1;
var camRotSpeed = 0.01;

var keyState = {};

var isPaused = false;
var canChangePause = true;

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
			move("left");
		}
		// Right
		if (keyState[39]) {
			move("right");
		}
		// Up
		if (keyState[38]) {
			move("front");
		}
		// Down
		if (keyState[40]) {
			move("back");
		}

		// A
		if (keyState[65]) {
			rotate("left");
		}
		// D
		if (keyState[68]) {
			rotate("right");
		}
		// W
		if (keyState[87]) {
			rotate("up");
		}
		// S
		if (keyState[83]) {
			rotate("down");
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
		if (isPaused && canChangePause) {
			isPaused = false;
			canChangePause = false;
		}
		else if (!isPaused && canChangePause) {
			isPaused = true;
			canChangePause = false;
		}
	}

	if (!keyState[80]) {
		canChangePause = true;
	}
}

/**
 * Change the color of the cube
 * @param {number} color - Hex literal
 */
function changeColor(color) {
	cube.material.color.setHex(color);
}

/**
 * 
 */
function rotateCube() {
	cube.rotation.x += modelRotSpeed;
	cube.rotation.y += modelRotSpeed;
}

/**
 * Move camera locally. TODO: global
 * @param {string} dir - Direction of movement
 */
function move(dir) {
	switch (dir) {
		case "left":
			//camera.position.x -= camMoveSpeed
			camera.translateX(-camMoveSpeed);
			break;
		case "right":
			// camera.position.x += camMoveSpeed
			camera.translateX(camMoveSpeed);
			break;
		case "front":
			// camera.position.z -= camMoveSpeed
			camera.translateZ(-camMoveSpeed);
			break;
		case "back":
			// camera.position.z += camMoveSpeed
			camera.translateZ(camMoveSpeed);
			break;
	}
}

/**
 * Rotate camera locally. TODO: global
 * @param {string} dir - Direction of rotation
 */
function rotate(dir) {
	switch (dir) {
		case "left":
			// camera.rotation.y += camRotSpeed;
			camera.rotateY(camRotSpeed);
			break;
		case "right":
			// camera.rotation.y -= camRotSpeed;
			camera.rotateY(-camRotSpeed);
			break;
		case "up":
			// camera.rotation.x += camRotSpeed;
			camera.rotateX(camRotSpeed);
			break;
		case "down":
			// camera.rotation.x -= camRotSpeed;
			camera.rotateX(-camRotSpeed);
			break;
	}
}