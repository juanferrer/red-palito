/*global Menu, player, $,
modelRotSpeed, camMoveSpeed, camRotSpeed,
updateUI
*/

//http://keycode.info/
class Input {

	/** Initialise keyboard to keep track what keys are pressed */
	static keyboardInit() {
		// https://stackoverflow.com/a/12273538/7179042
		// Keep track of what keys are down and update in loop
		window.addEventListener("keydown", e => {
			/*Input.keyState[e.keyCode || e.which] = true;
			if (Input.keyLastPressed[e.keyCode || e.which] != null) {
				let doublePressTimeout = $("#double-press-slider").val(); // miliseconds
				Input.keyDoublePress[e.keyCode || e.which] = new Date().getTime() - Input.keyLastPressed[e.keyCode || e.which].getTime() < doublePressTimeout;
			}*/
			Input.keydown(e.keyCode || e.which);
		}, true);
		window.addEventListener("keyup", e => {
			/*Input.keyState[e.keyCode || e.which] = false;
			Input.keyLastPressed[e.keyCode || e.which] = new Date();*/
			Input.keyup(e.keyCode || e.which);
		}, true);
	}

	/** Initialise the mobile controller to map button press to keypress */
	static mobileControllerInit() {
		let buttonArray = ["up-button", "down-button", "left-button", "right-button", "shift-button", "attack-button", "pause-button"];

		buttonArray.forEach(id => {
			$(`#${id}`).on("touchstart", e => {
				/*let artificialE = new KeyboardEvent("keydown", { "keyCode": e.target.getAttribute("data-keycode") });
				window.dispatchEvent(artificialE);*/
				Input.keydown(parseInt(e.target.getAttribute("data-keycode")));
			});
			$(`#${id}`).on("touchend", e => {
				/*let artificialE = new KeyboardEvent("keyup", { "keyCode": e.target.getAttribute("data-keycode") });
				window.dispatchEvent(artificialE);*/
				Input.keyup(parseInt(e.target.getAttribute("data-keycode")));
			});
		});
	}

	/**
	 * React to a keydown event
	 * @param {number} keyCode
	 */
	static keydown(keyCode) {
		Input.keyState[keyCode] = true;
		if (Input.keyLastPressed[keyCode] != null) {
			let doublePressTimeout = $("#double-press-slider").val(); // miliseconds
			Input.keyDoublePress[keyCode] = new Date().getTime() - Input.keyLastPressed[keyCode].getTime() < doublePressTimeout;
		}
	}

	/**
	 * React to a keyup event
	 * @param {number} keyCode
	 */
	static keyup(keyCode) {
		Input.keyState[keyCode] = false;
		Input.keyLastPressed[keyCode] = new Date();
	}

	/** Check what keys have been pressed since last frame and react accordingly */
	static resolveInput() {
		if (!Menu.isMainMenu) {
			if (!Input.isPaused) {

				// DEBUG: Numpad +
				if (Input.keyState[107]) {
					//
				}

				// Spacebar
				if (Input.keyState[Input.keys.attack]) {
					player.attack();
				}

				// Shift
				if (Input.keyState[Input.keys.shift]) {
					if (Input.canToggleShift) {
						player.nextWeapon();
						Input.canToggleShift = false;
					}
				}

				// A
				if (Input.keyState[Input.keys.left]) {
					player.rotateLeft();
				}
				// D
				if (Input.keyState[Input.keys.right]) {
					player.rotateRight();
				}
				// W
				if (Input.keyState[Input.keys.forward]) {
					player.moveForward();
				}
				// S
				if (Input.keyState[Input.keys.backward]) {
					if (Input.keyDoublePress[Input.keys.backward]) {
						Input.keyDoublePress[Input.keys.backward] = false;
						Input.keyLastPressed[Input.keys.backward] = null;
						player.turnAround();
					}
					player.moveBackward();
				}

				// #region unused
				/*
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

				*/
				// #endregion unused
			}

			// Escape
			if (Input.keyState[Input.keys.pause]) {
				if (Input.isPaused && Input.canTogglePause) {
					Input.isPaused = false;
					Input.canTogglePause = false;
				}
				else if (!Input.isPaused && Input.canTogglePause) {
					Input.isPaused = true;
					Input.canTogglePause = false;
				}
				updateUI();
			}
		}
		if (!Input.keyState[Input.keys.pause]) {
			Input.canTogglePause = true;
		}

		// Release shift
		if (!Input.keyState[Input.keys.shift]) {
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
	 * Rotate locally
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
Input.keyDoublePress = {};
Input.keyLastPressed = {};

Input.isPaused = false;
Input.canTogglePause = true;

Input.canToggleShift = true;

Input.keys = {
	"attack": 32,
	"shift": 16,
	"left": 65,
	"right": 68,
	"forward": 87,
	"backward": 83,
	"pause": 27,
};

$("#up-button").attr("data-keycode", Input.keys.forward);
$("#down-button").attr("data-keycode", Input.keys.backward);
$("#left-button").attr("data-keycode", Input.keys.left);
$("#right-button").attr("data-keycode", Input.keys.right);
$("#attack-button").attr("data-keycode", Input.keys.attack);
$("#shift-button").attr("data-keycode", Input.keys.shift);
$("#pause-button").attr("data-keycode", Input.keys.pause);
