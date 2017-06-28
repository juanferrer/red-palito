class Bullet {
    constructor() {
        this.Geometry = new THREE.CylinderGeometry(0.05, 0.05, 5, 5, 1);
        this.Material = new THREE.MeshBasicMaterial();
        this.Mesh = new THREE.Mesh(this.Geometry, this.Material);
        this.isAlive = false;
        scene.add(this.Mesh);
        this.initialYPos = -10;
        this.Mesh.position.y = this.initialYPos;
        this.initialLifeTime = 1;
        this.lifeTime = this.initialLifeTime;
        this.direction = null;
        this.speed = 1.4;
    }

    get position() {
        return this.Mesh.position;
    }

    /**
     * 
     * @param {THREE.Vector3} pos - Spawning position
     * @param {THREE.Vector3} dir - Facing direction of bullet
     * @param {number} acc - Shot accuracy
     */
    spawn(pos, dir, acc) {
        this.direction = dir;
        this.isAlive = true;
        this.lifeTime = this.initialLifeTime;
        this.Mesh.position.set(pos.x, 1, pos.z);
        this.orient(acc);
    }

    /**
     * Orient bullet towards target
     * @param {number} acc - Shot accuracy
     */
    orient(acc) {
        var randX = (Math.random() + (acc - 0.5)) / 50;
        var randZ = (Math.random() + (acc - 0.5)) / 50;

        this.direction.add(new THREE.Vector3(randX, 0, randZ));
        this.Mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), this.direction.normalize());
    }


    /**
     * Set bullet to its initial state
     */
    reset() {
        this.isAlive = false;
        this.direction = null;
        this.position.set(0, this.initialYPos, 0);
    }

    /**
 * Gets the Y vector of the model. A.K.A. Upward
 * @returns {THREE.Vector3}
 */
    get frontVector() {
        var matrix = new THREE.Matrix4();
        matrix.extractRotation(this.Mesh.matrix);

        var dir = new THREE.Vector3(0, 0, 1);
        return dir.applyMatrix4(matrix).normalize();
    }

}