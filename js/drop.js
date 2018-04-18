/* globals THREE, scene,

dropGeometry, hpDropMaterial, weaponDropMaterial */

class Drop {
	constructor(type) {
		this.type = type;
		if (type == "HP") {
			this.Material = hpDropMaterial;
		} else {
			this.Material = weaponDropMaterial;
		}
		this.value = 0;
		this.isSpawned = false;
		this.Geometry = dropGeometry;
		this.Mesh = new THREE.Mesh(this.Geometry, this.Material);
		this.Mesh.receiveShadow = true;
		this.Mesh.castShadow = true;
		scene.add(this.Mesh);
		this.position.set(0, -10, 0);
	}

	/**
     * Set the drop to its initial state
     */
	reset() {
		this.isSpawned = false;
		this.position.set(0, -10, 0);
	}

	get position() {
		return this.Mesh.position;
	}

	/**
     * Spawn at given position
     * @param {THREE.Vector3} pos - Spawn point
     * @param {number} value - Either HP to regenerate or weapon index to pickup
     */
	spawn(pos, value) {
		this.value = value;
		this.Mesh.position.set(pos.x, 1, pos.z);
		this.isSpawned = true;
	}

	/**
     * Return to invisible position and reset state
     */
	unspawn() {
		this.Mesh.position.set(0, -10, 0);
		this.isSpawned = false;
	}
}

Drop.weaponDropSpawnedThisWave = false;
Drop.wavesSinceHPDrop = 0;		// Increased at the end of each wave and reset after spawning an HP drop
Drop.wavesBetweenHPDrop = 5; 	// Waves that can go on between HP drops
