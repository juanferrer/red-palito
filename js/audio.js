class Audio {

    /** */
static loadWeaponSounds() {
	for (let i = 0; i < weapons.length; ++i) {
		Audio.weaponSounds.push(new THREE.Audio(listener));
		this.loadSoundFile(Audio.weaponSounds[i], Audio.weaponFiles[i]);
	}
	Audio.gainHPSound = new THREE.Audio(listener);
	this.loadSoundFile(Audio.gainHPSound, Audio.gainHPFile);
	Audio.pickupSound = new THREE.Audio(listener);
	this.loadSoundFile(Audio.pickupSound, Audio.pickupFile);
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