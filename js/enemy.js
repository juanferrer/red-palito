/* globals THREE, Character, player, game, invisibleYPos, settings*/

/**
 * Single class meant to be used by players and enemies alike.
 * It has a THREE.Geometry, THREE.Material and THREE.Mesh among others.
 */
class Enemy extends Character { // eslint-disable-line no-unused-vars
	/**
     *
     * @param {string} charType - Type of character it is.
     */
	constructor() {
		super();
		this.isPlayer = false;
		this.moveSpeed = 3;
		this.color = 0x4CAF50;
		this.initialHP = 4;
		this.initialSpawnCountDown = Math.random();
		this.shouldSpawn = true;
		this.isSpawned = false;
		this.soundCounter = Math.randomInterval(2, 8);
		super.init();
	}

	/**
     * Set enemy to its initial state
     */
	reset() {
		this.HP = this.initialHP;
		this.shouldSpawn = true;
		this.isSpawned = false;
		this.position.set(0, invisibleYPos, 0);
		this.Mesh.rotation.y = 0;
	}

	/**
     * Reduce HP of enemy by an amount
     * @param {number} damageDealt - Amount by which HP is reduced
     */
	receiveDamage(damageDealt) {
		this.HP -= damageDealt;
		if (this.HP < 0) {
			this.die();
		}
	}

	/**
     * Follow player
     */
	moveTowardPlayer() {
		this.Mesh.lookAt(player.position);
		this.moveForward();
		if (settings.modelsEnabled) this.animationMixer.clipAction(this.animations.walk).play();
	}

	/**
     * Attack whatever is ahead.
     */
	attack() {
		let posVector = new THREE.Vector3(this.position.x, 1, this.position.z);
		if (this.attackCounter <= 0 && this.HP > 0) {
			let raycaster = new THREE.Raycaster(posVector, this.facingVector);
			let intersects = raycaster.intersectObjects([player.Mesh]);

			if (intersects.length > 0) {
				const firstIntersectedObject = intersects[0].object;
				if (firstIntersectedObject.id === player.id && player.HP > 0) {
					player.receiveDamage(this.damage);
				}
			}
			this.attackCounter = this.attackSpeed;
		}
	}


	/**
	 *
	 */
	die() {
		// TODO:
		// 1. Animation + sound
		// 2. setTimeout(disappear, time);
		this.isSpawned = false;
		this.spawnCountDown = this.initialSpawnCountDown;
		this.position.set(0, invisibleYPos, 0);
		game.enemiesKilled++;
	}

	/**
	 *
	 */
	playSound() {
		this.soundCounter = Math.randomInterval(2, 8);
		Audio.enemySounds[Math.randomInterval(0, 27)].play();
	}

	/**
	 *
	 */
	spawn() {
		super.spawn();
		if (!settings.modelsEnabled) this.position.y = 1;
	}
}
