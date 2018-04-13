/* globals THREE, Enemy, player, game, invisibleYPos, settings,
zombieGeometry, zombieMaterial */

/**
 * Single class meant to be used by players and enemies alike.
 * It has a THREE.Geometry, THREE.Material and THREE.Mesh among others.
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
		this.geometry = zombieGeometry;
		this.material = zombieMaterial;
		super.init();
	}

	/**
     * Follow player
     */
	moveTowardPlayer() {
		this.Mesh.lookAt(player.position);
		this.moveForward();
		if (settings.modelsEnabled) this.animationMixer.clipAction(this.animations.walk).play();
	}
}
