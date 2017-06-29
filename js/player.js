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
        this.ownedWeapons = [0];
        this.weaponsAmmo = [-1];
        this.currentWeapon = 0;
        super.init();
        this.attackSpeed = 1;
        this.accuracy = 0.5;
        this.damage = 2;
        //this.acquireWeapon(0);
        //this.updateWeaponStats();
    }

    /**
     * Change current weapon to next owned weapon
     */
    nextWeapon() {
        this.triggerWeaponChangeAnim();
        // DEBUG
        if (this.ownedWeapons.length == 1) {
            console.log("DEBUG: add UZI");
            this.acquireWeapon(1);
        }
        this.currentWeapon = this.currentWeapon < this.ownedWeapons.length - 1 ? this.currentWeapon + 1 : 0;
        // Update stats
        this.updateWeaponStats();
    }

    /**
     * Set stats to those of the weapon
     */
    updateWeaponStats() {
        this.attackSpeed = weapons[this.ownedWeapons[this.currentWeapon]].speed;
        this.accuracy = weapons[this.ownedWeapons[this.currentWeapon]].accuracy;
        this.damage = weapons[this.ownedWeapons[this.currentWeapon]].damage;
    }

    /**
     * Add weapon index to the owned weapons
     * @param {number} index - Weapon number to add
     */
    acquireWeapon(index) {
        //if (this.ownedWeapons.indexOf(index))
        this.ownedWeapons.push(index);
        if (this.weaponsAmmo[index]) {
            this.weaponsAmmo[index] += weapons[index].ammo;
        }
        else {
            this.weaponsAmmo.push(weapons[index].ammo);
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

    receiveDamage(damageDealt) {
        this.HP -= damageDealt;
        this.triggerLostHPAnim();
        if (this.HP <= 0) {
            this.die();
        }
    }

    triggerLostHPAnim() {
        var element = document.getElementById("hp-bar");
        element.classList.remove("gained-hp-anim");
        element.classList.remove("lost-hp-anim");
        void element.offsetWidth;
        element.classList.add("lost-hp-anim");
    }

    triggerGainedHPAnim() {
        var element = document.getElementById("hp-bar");
        element.classList.remove("gained-hp-anim");
        element.classList.remove("lost-hp-anim");
        void element.offsetWidth;
        element.classList.add("gained-hp-anim");
    }

    triggerBulletAnim() {
        var element = document.getElementById("current-weapon-ammo");
        element.classList.remove("changed-weapon-anim");
        element.classList.remove("used-bullet-anim");
        void element.offsetWidth;
        element.classList.add("used-bullet-anim");
    }

    triggerWeaponChangeAnim() {
        var weapon = document.getElementById("current-weapon-name");
        var ammo = document.getElementById("current-weapon-ammo");
        weapon.classList.remove("changed-weapon-anim");
        ammo.classList.remove("changed-weapon-anim");
        ammo.classList.remove("used-bullet-anim");
        void weapon.offsetWidth;
        void ammo.offsetWidth;
        weapon.classList.add("changed-weapon-anim");
        ammo.classList.add("changed-weapon-anim");
    }

    // heal(damageHealed) {
    //     element.classList.remove("lost-hp-anim");
    //     element.classList.remove("gained-hp-anim");
    //     void element.offsetWidth;
    //     element.classList.add("gained-hp-anim");
    // }

    /**
     * 
     */
    die() {
        // TODO:
        // 1. Animation + sound
        // 2. setTimeout(disappear, time);
    }
}