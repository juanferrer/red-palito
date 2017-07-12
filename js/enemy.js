/**
 * Single class meant to be used by players and enemies alike.
 * It has a THREE.Geometry, THREE.Material and THREE.Mesh among others.
 */
class Enemy extends Character {
    /**
     * 
     * @param {string} charType - Type of character it is. 
     */
    constructor() {
        super();
        this.isPlayer = false;
        this.moveSpeed = 3;
        this.color = 0x4CAF50;
        this.initialHP = 4;
        this.initialSpawnCountDown = Math.random();
        this.shouldSpawn = true;
        super.init();
    }

    /**
     * Reduce HP of enemy by an amount
     * @param {number} damageDealt - Amount by which HP is reduced 
     */
    receiveDamage(damageDealt) {
        this.HP -= damageDealt;
        if (this.HP < 0) {
            this.die();
        }
    }

    /**
     * Follow player
     */
    moveTowardPlayer() {
        this.Mesh.lookAt(player.position);
        this.moveForward();
    }

    /**
     * Attack whatever is ahead.
     */
    attack() {
        if (this.attackCounter <= 0 && this.HP > 0) {
            var raycaster = new THREE.Raycaster(this.position, this.facingVector);
            var intersects = raycaster.intersectObjects([player.Mesh]);

            if (intersects.length > 0) {
                var firstIntersectedObject = intersects[0].object;
                if (firstIntersectedObject.id === player.id && player.HP > 0) {
                    player.receiveDamage(this.damage);
                }
            }
            this.attackCounter = this.attackSpeed;
        }
    }


    die() {
        // TODO:
        // 1. Animation + sound
        // 2. setTimeout(disappear, time);
        this.isSpawned = false;
        this.spawnCountDown = this.initialSpawnCountDown;
        this.position.y = -2;
    }
}