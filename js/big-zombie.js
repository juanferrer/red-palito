/* globals Enemy,
bigZombieGeometry, bigZombieMaterial */

/**
 * Single class meant to be used by players and enemies alike.
 * It has a THREE.Geometry, THREE.Material and THREE.Mesh among others.
 */
class BigZombie extends Enemy { // eslint-disable-line no-unused-vars

	constructor() {
		super();
		this.moveSpeed = 2;// + Math.random();
		this.color = 0x724CAE;
		this.initialHP = 15;
		this.initialSpawnCountDown = Math.random();
		this.shouldSpawn = true;
		this.radius = 1;
		this.startingYPos = 2;
		this.damage = 5;
		this.geometry = bigZombieGeometry;
		this.material = bigZombieMaterial;
		super.init();
	}

	/**
	 *
	 */
	playSound() {
		this.soundCounter = Math.randomInterval(2, 8);
		Audio.bigEnemySounds[Math.randomInterval(0, Audio.bigEnemySoundsLength - 1)].play();
	}
}
