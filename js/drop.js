class Drop {
    constructor(type) {
        this.type = type;
        if (type == "HP") {
            // this.color = 0x4CAF50;
            this.Material = hpDropMaterial;
            this.pickUp = function () {
                // TODO: Add HP to picker
            }
        } else {
            // this.color = 0xFF5722;
            this.Material = weaponDropMaterial;
            this.pickUp = function () {
                // TODO: Add weapon and ammo to picker
            }
        }
        this.value = 0;
        this.isSpawned = false;
        this.Geometry = dropGeometry;
        this.Mesh = new THREE.Mesh(this.Geometry, this.Material);
        this.Mesh.receiveShadow = true;
        this.Mesh.castShadow = true;
        scene.add(this.Mesh);
        //this.Mesh.rotateY(Math.degToRad(45));
        //this.Mesh.rotateX(Math.degToRad(45));
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
        this.Mesh.position.set(pos.x, pos.y, pos.z);
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