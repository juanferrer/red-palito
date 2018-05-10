/* globals THREE, Enemy, player, settings, frameTime,
smallZombieGeometry, smallZombieMaterial, smallZombiePrepareMaterial, smallZombieDashMaterial*/

/**
 * Small enemy class (A.K.A. Zoomies)
 */
class SmallZombie extends Enemy { // eslint-disable-line no-unused-vars

	constructor() {
		super();
		this.moveSpeed = 4;// + Math.random();
		this.dashSpeed = 50;
		this.dashDistance = 15;
		this.distanceTraveled = 0;
		this.dashTime = 2;
		this.dashCountDown = this.dashTime;
		this.color = 0xd1b829; // Three stages: #D1B829, #D16729, #FF0000
		this.initialHP = 1;
		this.startingYPos = 0.5;
		this.sightDistance = 20;
		this.initialSpawnCountDown = Math.random();
		this.shouldSpawn = true;
		this.damage = 2;
		this.geometry = smallZombieGeometry;
		this.originalMaterial = smallZombieMaterial;
		this.material = this.originalMaterial;
		super.init();
	}

	/**
     * Follow player
     */
	moveTowardPlayer() {
		if (!this.isDashing) {
			this.lookAtPosition();
			this.moveForward();
			if (settings.modelsEnabled) this.animationMixer.clipAction(this.animations.walk).play();

			if (this.position.distanceTo(player.position) <= this.dashDistance) {
				this.isDashing = true;
				this.distanceTraveled = 0;
				this.targetPosition = new THREE.Vector3(player.position.x, this.position.y, player.position.z);
			}
		} else {
			if (this.dashCountDown > 1) {
				this.Mesh.material = smallZombiePrepareMaterial;
			} else {
				this.Mesh.material = smallZombieDashMaterial;
			}


			if (this.dashCountDown > 0) {
				this.lookAtPosition(this.targetPosition);
				this.dashCountDown -= frameTime;
			} else {
				this.dashForward();
				if (this.distanceTraveled >= this.dashDistance) {
					this.isDashing = false;
					this.dashCountDown = this.dashTime;
				}
			}
		}
	}

	moveForward() {
		super.moveForward();
		this.Mesh.material = this.originalMaterial;
	}

	dashForward() {
		let newPos = this.Mesh.position;
		newPos.add(this.facingVector.normalize().multiplyScalar(this.dashSpeed * frameTime));
		this.Mesh.position.set(newPos.x, newPos.y, newPos.z);
		this.correctOutOfBounds();
		this.distanceTraveled += this.dashSpeed * frameTime;
	}

	attack() {
		super.attack();
		this.dashCountDown = this.dashTime;
		this.distanceTraveled = 0;
		this.targetPosition = new THREE.Vector3();
		this.isDashing = false;
		Audio.smallZombieImpact.play();
		this.die();
	}

	/**
 	*
 	*/
	playSound() {
		this.soundCounter = Math.randomInterval(2, 8);
		Audio.enemySounds[Math.randomInterval(0, Audio.enemySoundsLength - 1)].play();
	}

}
