/*global Menu, player, camera, lightColor2, lightColor3,
modelRotSpeed, camMoveSpeed, camRotSpeed
*/

//http://keycode.info/
class Input {

	/**
	 * Initialise keyboard to keep track what keys have
	 * are pressed
	 */
	static keyboardInit() {
		// https://stackoverflow.com/a/12273538/7179042
		// Keep track of what keys are down and update in loop
		window.addEventListener("keydown", e => {
			Input.keyState[e.keyCode || e.which] = true;
		}, true);
		window.addEventListener("keyup", e => {
			Input.keyState[e.keyCode || e.which] = false;
		}, true);
	}

	/**
	 * Check what keys have been pressed since last
	 * frame and react accordingly
	 */
	static resolveInput() {
		if (!Menu.isMainMenu) {
			if (!Input.isPaused) {

				// DEBUG: Numpad +
				if (Input.keyState[107]) {
					//
				}

				// Spacebar
				if (Input.keyState[32]) {
					player.attack();
				}

				// Shift
				if (Input.keyState[16]) {
					if (Input.canToggleShift) {
						player.nextWeapon();
						Input.canToggleShift = false;
					}
				}

				// A
				if (Input.keyState[65]) {
					player.rotateLeft();
				}
				// D
				if (Input.keyState[68]) {
					player.rotateRight();
				}
				// W
				if (Input.keyState[87]) {
					player.moveForward();
				}
				// S
				if (Input.keyState[83]) {
					player.moveBackward();
				}

				// unused

				// Left
				if (Input.keyState[37]) {
					this.move(camera, "left");
				}
				// Right
				if (Input.keyState[39]) {
					this.move(camera, "right");
				}
				// Up
				if (Input.keyState[38]) {
					this.move(camera, "front");
				}
				// Down
				if (Input.keyState[40]) {
					this.move(camera, "back");
				}

				// 0
				if (Input.keyState[96]) {
					this.changeColor(0xFFFFFF);
				}

				// 1
				if (Input.keyState[97]) {
					this.changeColor(0xF44336);
				}

				// 2
				if (Input.keyState[98]) {
					this.changeColor(lightColor2);
				}

				// 3
				if (Input.keyState[99]) {
					this.changeColor(lightColor3);
				}

				// End of unused
			}

			// P
			if (Input.keyState[80]) {
				if (Input.isPaused && Input.canTogglePause) {
					Input.isPaused = false;
					Input.canTogglePause = false;
				}
				else if (!Input.isPaused && Input.canTogglePause) {
					Input.isPaused = true;
					Input.canTogglePause = false;
				}
			}
		}
		if (!Input.keyState[80]) {
			Input.canTogglePause = true;
		}

		// Release shift
		if (!Input.keyState[16]) {
			Input.canToggleShift = true;
		}
	}

	/**
	 * Change the color of the cube
	 * @param {number} color - Hex literal
	 */
	static changeColor(color) {
		player.Material.color.setHex(color);
	}

	/**
	 *
	 */
	static rotateCube() {
		player.rotation.x += modelRotSpeed;
		player.rotation.y += modelRotSpeed;
	}

	/**
	 * Move camera locally. TODO: global
	 * @param {string} dir - Direction of movement
	 * @param {THREE.Object3D} obj - Object to be moved
	 */
	static move(obj, dir) {
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
	static rotate(obj, dir) {
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
}

Input.modelRotSpeed = 0.05;

Input.camMoveSpeed = 0.1;
Input.camRotSpeed = 0.01;

Input.keyState = {};

Input.isPaused = false;
Input.canTogglePause = true;

Input.canToggleShift = true;
