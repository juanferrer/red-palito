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
		for (let i = 0; i < Audio.enemySoundsLength; ++i) {
			Audio.enemySounds.push(new THREE.Audio(listener));
			this.loadSoundFile(Audio.enemySounds[i], `sounds/enemies/zombie${i < 10 ? "0" + i : i}.wav`, 0.4);
		}
		for (let i = 0; i < Audio.bigEnemySoundsLength; ++i) {
			Audio.bigEnemySounds.push(new THREE.Audio(listener));
			this.loadSoundFile(Audio.bigEnemySounds[i], `sounds/enemies/big-zombie${i < 10 ? "0" + i : i}.wav`, 0.4);
		}
		Audio.waveChangeSound = new THREE.Audio(listener);
		this.loadSoundFile(Audio.waveChangeSound, "sounds/enemies/wave-change.wav", 2);
	}

	static loadPlayerSounds() {
		for (let i = 0; i < 3; ++i) {
			Audio.playerDeathSounds.push(new THREE.Audio(listener));
			this.loadSoundFile(Audio.playerDeathSounds[i], `sounds/player/dying0${i}.wav`);
		}
	}

	static loadSoundFile(sound, file, volume = 1) {
		audioLoader.load(file, function (buffer) {
			// audioLoader.load(weaponSoundFile[i], function (buffer) {
			sound.setBuffer(buffer);
			sound.setVolume(volume);
		});
	}

}

Audio.weaponSounds = [];
Audio.weaponFiles = ["sounds/weapons/pistol.wav", "sounds/weapons/ak-47.wav", "sounds/weapons/shotgun.wav", "sounds/weapons/laser.wav"];
Audio.gainHPSound;
Audio.gainHPFile = "sounds/pickups/gain-hp.wav";
Audio.pickupSound;
Audio.pickupFile = "sounds/pickups/pickup.wav";
Audio.enemySoundsLength = 28;
Audio.enemySounds = [];
Audio.bigEnemySoundsLength = 7;
Audio.bigEnemySounds = [];
Audio.playerDeathSounds = [];
Audio.waveChangeSound;
