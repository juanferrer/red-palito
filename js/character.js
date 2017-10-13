/**
 * Single class meant to be used by this.Players and enemies alike.
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
        this.Geometry = characterGeometry;
        this.Material = enemyMaterial;
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
        let matrix = new THREE.Matrix4();
        matrix.extractRotation(this.Mesh.matrix);

        let direction = new THREE.Vector3(0, 0, 1);
        return direction.applyMatrix4(matrix).normalize();
    }

    correctOutOfBounds() {
        if (this.Mesh.position.x + this.radius > (planeSize / 2)) {
            this.Mesh.position.x = (planeSize / 2) - this.radius;
        }
        else if (this.Mesh.position.x - this.radius < -(planeSize / 2)) {
            this.Mesh.position.x = (-planeSize / 2) + this.radius;
        }
        if (this.Mesh.position.z + this.radius > (planeSize / 2)) {
            this.Mesh.position.z = (planeSize / 2) - this.radius;
        }
        else if (this.Mesh.position.z - this.radius < -(planeSize / 2)) {
            this.Mesh.position.z = (-planeSize / 2) + this.radius;
        }
    }

    moveForward() {
        let newPos = this.Mesh.position;
        newPos.add(this.facingVector.normalize().multiplyScalar(this.moveSpeed * frameTime));
        this.Mesh.position.set(newPos.x, newPos.y, newPos.z);
        this.correctOutOfBounds();
    }

    moveBackward() {
        let newPos = this.Mesh.position;
        newPos.add(this.facingVector.normalize().multiplyScalar(-this.moveSpeed * frameTime));
        this.Mesh.position.set(newPos.x, newPos.y, newPos.z);
        this.correctOutOfBounds();
    }

    rotateRight() {
        this.Mesh.rotateY(Math.degToRad(-this.rotSpeed * frameTime));
    }

    rotateLeft() {
        this.Mesh.rotateY(Math.degToRad(this.rotSpeed * frameTime));
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
        let spawnPoint = getRandomPosition(planeSize);
        // 3. Move to spawnPoint
        this.Mesh.position.set(spawnPoint.x, spawnPoint.y, spawnPoint.z);
        // 4. Allow yourself to check if it is spawned or not
        this.isSpawned = true;
        this.shouldSpawn = false;
    }
}