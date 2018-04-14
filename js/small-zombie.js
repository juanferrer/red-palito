/* globals THREE, Enemy, player, settings, frameTime,
smallZombieGeometry, smallZombieMaterial, smallZombiePrepareMaterial, smallZombieDashMaterial*/

/**
 * Single class meant to be used by players and enemies alike.
 * It has a THREE.Geometry, THREE.Material and THREE.Mesh among others.
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
		this.targetPosition = new THREE.Vector3();
		this.color = 0xAE9F4C; // Three stages: #ae9f4c, #d15629, #fa0000
		this.initialHP = 1;
		this.initialSpawnCountDown = Math.random();
		this.shouldSpawn = true;
		this.damage = 2;
		this.geometry = smallZombieGeometry;
		this.material = smallZombieMaterial;
		super.init();
	}

	/**
     * Follow player
     */
	moveTowardPlayer() {
		if (!this.isDashing) {
			this.Mesh.material = smallZombieMaterial;
			this.Mesh.lookAt(player.position);
			this.moveForward();
			if (settings.modelsEnabled) this.animationMixer.clipAction(this.animations.walk).play();

			if (this.position.distanceTo(player.position) <= this.dashDistance) {
				this.isDashing = true;
				this.distanceTraveled = 0;
				this.targetPosition = new THREE.Vector3(player.position.x, player.position.y, player.position.z);
			}
		} else {
			if (this.dashCountDown > 1) {
				this.Mesh.material = smallZombiePrepareMaterial;
			} else {
				this.Mesh.material = smallZombieDashMaterial;
			}


			if (this.dashCountDown > 0) {
				this.Mesh.lookAt(this.targetPosition);
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
		this.die();
	}


}
