/* globals THREE, Character, player, game, invisibleYPos, settings,
	frameTime, getRandomPosition, damagedMaterial*/

/**
 * General enemy class
 */
class Enemy extends Character { // eslint-disable-line no-unused-vars

	constructor() {
		super();
		this.isPlayer = false;
		this.isSpawned = false;
		this.soundCounter = Math.randomInterval(2, 8);
		this.targetPosition = new THREE.Vector3();
		this.bloodEmissionTime = 0.05; // Seconds
		this.bloodAnimationTime = 1; // Seconds
		this.bloodCounter = -1;
		this.pointOfImpact = new THREE.Vector3();
		this.hurtMaterial = damagedMaterial;
		this.isPlayingSpawnAnimation = false;
		this.isPlayingBloodAnimation = false;
		this.particleSystem = new THREE.GPUParticleSystem({ maxParticles: 2500 });
	}

	init() {
		super.init();
	}

	/**  Set enemy to its initial state */
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
	receiveDamage(damageDealt, pointOfImpact) {
		this.triggerBlood(pointOfImpact);
		this.HP -= damageDealt;
		if (this.HP < 0) {
			this.die();
		}
	}

	/**  */
	triggerBlood(pointOfImpact) {
		this.isPlayingBloodAnimation = true;
		this.bloodCounter = 0;
		this.pointOfImpact = pointOfImpact;
		this.Mesh.material = damagedMaterial;
	}

	/**
	 * Make enemy turn towards specified position
	 * @param {THREE.Vector3} position
	 */
	lookAtPosition(position = player.position) {
		let vToPos = new THREE.Vector3(this.position.x - position.x, 0, this.position.z - position.z);

		let angleToFacePosition = this.facingVector.angleTo(vToPos);

		if (angleToFacePosition > 0.02) {
			let angleCheck = this.facingVector.angleTo(vToPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.degToRad(this.rotSpeed * frameTime)));
			if (angleToFacePosition > angleCheck) {
				this.rotateLeft();
			} else {
				this.rotateRight();
			}
		}

		//this.Mesh.lookAt(new THREE.Vector3(position.x, this.position.y, position.z));
	}

	/**  Follow player */
	moveTowardPlayer() {
		this.lookAtPosition();
		this.moveForward();
		if (settings.modelsEnabled) this.animationMixer.clipAction(this.animations.walk).play();
	}

	/** Attack whatever is ahead */
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


	/**  */
	die() {
		// TODO:
		// 1. Animation + sound
		// 2. setTimeout(disappear, time);
		this.isSpawned = false;
		this.spawnCountDown = this.initialSpawnCountDown;
		this.position.set(0, invisibleYPos, 0);
		game.enemiesKilled++;
		//this.isPlayingBloodAnimation = false;
		//this.bloodCounter = 0;
	}

	/**  */
	spawn() {
		super.spawn();
		//if (!settings.modelsEnabled) this.position.y -= 1;
		this.targetPosition = getRandomPosition();
		this.isPlayingSpawnAnimation = true;
		this.isPlayingBloodAnimation = false;
		this.Mesh.material = this.originalMaterial;
	}
}
