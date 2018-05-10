/* globals Enemy,
zombieGeometry, zombieMaterial */

/**
 * Basic enemy class
 */
class Zombie extends Enemy { // eslint-disable-line no-unused-vars

	constructor() {
		super();
		this.moveSpeed = 3;// + Math.random();
		this.color = 0x4CAF50;
		this.initialHP = 4;
		this.initialSpawnCountDown = Math.random();
		this.shouldSpawn = true;
		this.damage = 1;
		this.startingYPos = 1;
		this.sightDistance = 25;
		this.geometry = zombieGeometry;
		this.material = zombieMaterial;
		super.init();
	}

	/**  */
	playSound() {
		this.soundCounter = Math.randomInterval(2, 8);
		Audio.enemySounds[Math.randomInterval(0, Audio.enemySoundsLength - 1)].play();
	}
}
