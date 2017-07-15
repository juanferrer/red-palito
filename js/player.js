/**
 * Single class meant to be used by players and enemies alike.
 * It has a THREE.Geometry, THREE.Material and THREE.Mesh among others.
 */
class Player extends Character {
    /**
     * 
     * @param {string} charType - Type of character it is. 
     */
    constructor() {
        super();
        this.isPlayer = true;
        this.moveSpeed = 10;
        this.color = 0xF44336;
        this.initialHP = 10;
        this.ownedWeapons = [];
        this.weaponsAmmo = [];
        for (var i = 0; i < weapons.length; ++i) {
            this.ownedWeapons.push(false);
            this.weaponsAmmo.push(0);
        }
        this.currentWeapon = 0;
        super.init();
        this.attackSpeed = 1;
        this.accuracy = 0.5;
        this.damage = 2;
        this.acquireWeapon(0);
        this.updateWeaponStats();
    }

    /**
     * Change current weapon to next owned weapon
     */
    nextWeapon() {
        // DEBUG
        if (!this.ownedWeapons[3]) {
            console.log("DEBUG: add laser");
            this.acquireWeapon(3);
        }
        this.triggerWeaponChangeAnim();
        // Update stats
        setTimeout(function () {
            do {
                // player instead of this because it's a callback
                player.currentWeapon = player.currentWeapon < player.ownedWeapons.length - 1 ? player.currentWeapon + 1 : 0;
            } while (!player.ownedWeapons[player.currentWeapon] && !player.currentWeapon == 0)
            player.updateWeaponStats();
        }, 200);
    }

    /**
     * Set stats to those of the weapon
     */
    updateWeaponStats() {
        this.attackSpeed = weapons[this.currentWeapon].speed;
        this.accuracy = weapons[this.currentWeapon].accuracy;
        this.damage = weapons[this.currentWeapon].damage;
    }

    /**
     * Add weapon index to the owned weapons
     * @param {number} index - Weapon number to add
     */
    acquireWeapon(index) {
        if (!this.ownedWeapons[index]) {
            this.ownedWeapons[index] = true;
        }
        if (this.weaponsAmmo[index] >= 0 && weapons[index].ammo > 0) {
            this.weaponsAmmo[index] += weapons[index].ammo;
        }
        else {
            this.weaponsAmmo[index] = weapons[index].ammo;
        }
    }

    /**
    * Attack whatever is ahead.
    */
    attack() {
        if (this.weaponsAmmo[this.currentWeapon] == 0) {
            //this.weaponsAmmo.slice(this.ownedWeapons[this.currentWeapon], 1);
            //this.ownedWeapons.slice(this.currentWeapon, 1);
            this.nextWeapon();
        }
        if (this.attackCounter <= 0) {
            if (this.weaponsAmmo[this.currentWeapon] > 0)
                this.weaponsAmmo[this.currentWeapon]--;
            this.triggerBulletAnim();
            this.useWeapon();
            this.attackCounter = this.attackSpeed;
        }
    }

    /**
     * Reduce HP by amount
     * @param {number} damageDealt - Total damage received
     */
    receiveDamage(damageDealt) {
        this.HP -= damageDealt;
        this.triggerLostHPAnim();
        if (this.HP <= 0) {
            this.die();
        }
    }

    /**
     * Increase HP by amount
     * @param {number} hpHealed - Total HP gained
     */
    heal(hpHealed) {
        this.HP += hpHealed;
        this.triggerGainedHPAnim();
    }

    /** Trigger CSS nimations */
    triggerLostHPAnim() {
        var element = document.getElementById("hp-bar");
        element.classList.remove("gained-hp-anim");
        element.classList.remove("lost-hp-anim");
        void element.offsetWidth;
        element.classList.add("lost-hp-anim");
    }

    /** Trigger CSS nimations */
    triggerGainedHPAnim() {
        var element = document.getElementById("hp-bar");
        element.classList.remove("gained-hp-anim");
        element.classList.remove("lost-hp-anim");
        void element.offsetWidth;
        element.classList.add("gained-hp-anim");
    }

    /** Trigger CSS nimations */
    triggerBulletAnim() {
        var element = document.getElementById("current-weapon-ammo");
        element.classList.remove("changed-weapon-anim");
        element.classList.remove("used-bullet-anim");
        void element.offsetWidth;
        element.classList.add("used-bullet-anim");
    }

    /** Trigger CSS nimations */
    triggerWeaponChangeAnim() {
        var weapon = document.getElementById("current-weapon-stats");
        weapon.classList.remove("changed-weapon-anim");
        void weapon.offsetWidth;
        weapon.classList.add("changed-weapon-anim");
    }

    useWeapon() {
        this.weaponAnimation();
    }


    /**
     * Check whether the bullet hit a target
     * @param {THREE.Vector3} dirVector - Target direction of bullet
     * @param {bool} resilient - Whether the bullet should go through enemies
     */
    bulletHitCheck(dirVector, resilient = false) {
        var raycaster = new THREE.Raycaster(this.position, dirVector);
        var enemyMeshes = [];
        for (var e = 0; e < enemyAmount; ++e) {
            enemyMeshes.push(enemies[e].Mesh);
        }
        var intersects = raycaster.intersectObjects(enemyMeshes);

        if (intersects.length > 0) {

            if (resilient) {
                for (var j = 0; j < intersects.length; ++j) {
                    for (var i = 0; i < enemyAmount; ++i) {
                        if (intersects[j].object.id === enemies[i].id && enemies[i].HP > 0) {
                            enemies[i].receiveDamage(this.damage);
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < enemyAmount; ++i) {
                    if (intersects[0].object.id === enemies[i].id && enemies[i].HP > 0) {
                        enemies[i].receiveDamage(this.damage);
                    }
                }
            }
        }
    }

    /**
     * Make the animation for the different weapons
     */
    weaponAnimation() {
        var bullet;
        switch (this.currentWeapon) {
            // Single shot weapons
            case 0: case 1:
                bullet = getNextBullet();
                bullet.Mesh.scale.y = 1;
                // bullet.prepareBulletForWeapons(weapons[this.currentWeapon]);
                bullet.spawn(this.position, this.facingVector, this.accuracy);
                this.bulletHitCheck(bullet.direction);
                break;
            // Special cases

            // Shotgun: multiple shots in an outward direction
            case 2:
                var dirVector, randX, randY, randZ;
                for (var i = 0; i < 5; ++i) {
                    bullet = getNextBullet();
                    bullet.Mesh.scale.y = 1;
                    // bullet.prepareBulletForWeapons(weapons[this.currentWeapon]);
                    dirVector = this.facingVector;
                    randX = (Math.random() / 5) - 0.1;
                    randY = (Math.random() / 5) - 0.1;
                    randZ = (Math.random() / 5) - 0.1;
                    dirVector.add(new THREE.Vector3(randX, randY, randZ));
                    console.log(dirVector);
                    bullet.spawn(this.position, dirVector, this.accuracy);
                    this.bulletHitCheck(bullet.direction);
                }
                break;
            // Laser: single, long ray. Damages everything in it's path
            case 3:
                bullet = getNextBullet();
                bullet.Mesh.scale.y = 10;
                bullet.Material.color.setHex(0x0000FF);
                var posOffset = bullet.Mesh.scale.y * 2 + 5;
                var laserBeamPos = new THREE.Vector3(this.position.x + this.facingVector.x * posOffset, this.position.y + this.facingVector.y * posOffset, this.position.z + this.facingVector.z * posOffset);
                bullet.spawn(laserBeamPos, this.facingVector, this.accuracy, 0, 0.1);
                this.bulletHitCheck(bullet.direction, true);
                break;
        }
    }

    /**
     * 
     */
    die() {
        // TODO:
        // 1. Animation + sound
        // 2. setTimeout(disappear, time);
    }
}