class Weapon { // eslint-disable-line no-unused-vars
	constructor() {
		this.name = "";             // Name of the weapon
		this.damage = 0;            // Damage applied by the weapon
		this.recharge = 0;          // Weapon cooldown
		this.accuracy = 0;          // Accuracy of weapon. Added to produce shot variation
		this.ammo = 0;              // Current ammunition
		this.ammoOnPickup = 0;      // Ammunition received on pickup
		this.gunflareColor = 0x0;   // Color of the gunflare. Used on animation
		this.gunflareFalloff = 0;   // How quick the gunflare goes away
		this.soundFile = "";        // File associated to the weapon on attack
	}
}
