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
        //if (this.ownedWeapons.length == 1) {
        //    console.log("DEBUG: add UZI");
        //    this.acquireWeapon(1);
        //}
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
            var bullet = getNextBullet();
            bullet.spawn(this.position, this.facingVector, this.accuracy);
            var raycaster = new THREE.Raycaster(this.position, this.facingVector);
            var enemyMeshes = [];
            for (var e = 0; e < enemyAmount; ++e) {
                enemyMeshes.push(enemies[e].Mesh);
            }
            var intersects = raycaster.intersectObjects(enemyMeshes);

            if (intersects.length > 0) {
                var firstIntersectedObject = intersects[0].object;

                for (var i = 0; i < enemyAmount; ++i) {
                    if (firstIntersectedObject.id === enemies[i].id && enemies[i].HP > 0) {
                        enemies[i].receiveDamage(this.damage);
                    }
                }

            }
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

    /**
     * 
     */
    die() {
        // TODO:
        // 1. Animation + sound
        // 2. setTimeout(disappear, time);
    }
}