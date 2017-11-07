/* global THREE, weapons, listener, audioLoader */

class Audio {

	/** */
	static loadWeaponSounds() {
		for (let i = 0; i < weapons.length; ++i) {
			Audio.weaponSounds.push(new THREE.Audio(listener));
			this.loadSoundFile(Audio.weaponSounds[i], Audio.weaponFiles[i]);
		}
	}

	static loadPickupSounds() {
		Audio.gainHPSound = new THREE.Audio(listener);
		this.loadSoundFile(Audio.gainHPSound, Audio.gainHPFile);
		Audio.pickupSound = new THREE.Audio(listener);
		this.loadSoundFile(Audio.pickupSound, Audio.pickupFile);
	}

	static loadEnemySounds() {
		for (let i = 0; i < 28; ++i) {
			Audio.enemySounds.push(new THREE.Audio(listener));
			this.loadSoundFile(Audio.enemySounds[i], `sounds/enemies/zombie${i < 10 ? "0" + i : i}.wav`);
		}
	}

	static loadSoundFile(variable, file) {
		audioLoader.load(file, function (buffer) {
			// audioLoader.load(weaponSoundFile[i], function (buffer) {
			variable.setBuffer(buffer);
		});
	}

}

Audio.weaponSounds = [];
Audio.weaponFiles = ["sounds/pistol.wav", "sounds/ak-47.wav", "sounds/shotgun.wav", "sounds/laser.wav"];
Audio.gainHPSound;
Audio.gainHPFile = "sounds/gain-hp.wav";
Audio.pickupSound;
Audio.pickupFile = "sounds/pickup.wav";
Audio.enemySounds = [];
