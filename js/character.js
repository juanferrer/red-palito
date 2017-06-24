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
        switch (charType) {
            case "player":
                this.isPlayer = true;
                this.moveSpeed = 10;
                this.color = 0xF44336;
                this.initialHP = 10;
                this.ownedWeapons = [];
                this.currentWeapon = 0;
                this.initialSpawnCountDown = 5;

                /**
                 * Change current weapon to next owned weapon
                 */
                this.nextWeapon = function () {
                    currentWeapon++;
                }
                break;
            case "minion":
                this.isPlayer = false;
                this.moveSpeed = 3;
                this.color = 0xFFFFFF;
                this.initialHP = 2;
                this.initialSpawnCountDown = Math.random();

                /**
                 * Follow player
                 */
                this.moveTowardPlayer = function () {
                    this.Mesh.lookAt(player.position);
                    this.moveBackward();    // What??? Why backward? Well, it works... Don't touch it
                }
                break;
        }
        this.spawnCountDown = this.initialSpawnCountDown;
        this.isSpawned = false;
        this.rotSpeed = 60;
        this.HP = this.initialHP;
        this.attackSpeed = 1;
        this.damage = 1;
        this.Geometry = new THREE.BoxGeometry(1, 2, 1);
        this.Material = new THREE.MeshLambertMaterial({ color: this.color });
        this.Mesh = new THREE.Mesh(this.Geometry, this.Material);
        this.Mesh.castShadow = true;
        this.Mesh.receiveShadow = true;
    }

    addToScene() {
        this.Mesh.translateY(this.isPlayer ? 1 : -10);
        scene.add(this.Mesh);
    }

    get position() {
        return this.Mesh.position;
    }

    /**
     * If holding a weapon, shoot. Otherwise, attack whatever is
     * in ahead.
     */
    attack() {
        // TODO
    }

    moveForward() {
        this.Mesh.translateZ(-this.moveSpeed / 60);
    }

    moveBackward() {
        this.Mesh.translateZ(this.moveSpeed / 60);
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