/**
 * Single class meant to be used by players and enemies alike.
 * It has a THREE.Geometry, THREE.Material and THREE.Mesh among others.
 */
class Character {
    /**
     * 
     * @param {string} charType - Type of character it is. 
     */
    constructor(charType) {

        this.moveSpeed = 0;
        this.color = 0;
        this.initialHP = 0;
        this.isPlayer = false;
        this.initialSpawnCountDown = 0;
        this.radius = 0.5;
        this.spawnCountDown = this.initialSpawnCountDown;
        this.isSpawned = false;
        this.rotSpeed = 60;
        this.attackCounter = 0;
        this.attackSpeed = 1;
    }

    init() {
        this.Geometry = new THREE.BoxGeometry(1, 2, 1);
        this.Material = new THREE.MeshLambertMaterial({ color: this.color });
        this.Mesh = new THREE.Mesh(this.Geometry, this.Material);
        this.Mesh.castShadow = true;
        this.Mesh.receiveShadow = true;
        this.HP = this.initialHP;
        this.damage = 1;
    }

    addToScene() {
        this.Mesh.translateY(this.isPlayer ? 1 : -10);
        scene.add(this.Mesh);
    }

    /**
     * Get the unique id from the mesh. Used to know what object was hit during raycasting
     */
    get id() {
        return this.Mesh.id;
    }

    /**
     * Get the position of the model
     * @returns {THREE.Vector3}
     */
    get position() {
        return this.Mesh.position;
    }

    /**
     * Gets the facing vector of the model. A.K.A. Forward
     * @returns {THREE.Vector3}
     */
    get facingVector() {
        var matrix = new THREE.Matrix4();
        matrix.extractRotation(this.Mesh.matrix);

        var direction = new THREE.Vector3(0, 0, 1);
        return direction.applyMatrix4(matrix).normalize();
    }

    moveForward() {
        this.Mesh.translateZ(this.moveSpeed / 60);
    }

    moveBackward() {
        this.Mesh.translateZ(-this.moveSpeed / 60);
    }

    rotateRight() {
        this.Mesh.rotateY(Math.degToRad(-this.rotSpeed / 60));
    }

    rotateLeft() {
        this.Mesh.rotateY(Math.degToRad(this.rotSpeed / 60));
    }

    die() {
        // TODO:
        // 1. Animation + sound
        // 2. setTimeout(disappear, time);
    }

    /**
     * 
     * @param {number} delay - Time in miliseconds to wait until spawn
     */
    spawn() {
        // 1. Reset stats
        this.HP = this.initialHP;
        this.spawnCountDown = this.initialSpawnCountDown;
        // 2. Find spawnPoint
        var spawnPoint = getNextSpawnPoint();
        // 3. Move to spawnPoint
        this.Mesh.position.set(spawnPoint.x, spawnPoint.y, spawnPoint.z);
        // 4. Allow yourself to check if it is spawned or not
        this.isSpawned = true;
    }
}