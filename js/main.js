/*global THREE, Stats, $
parseJSONToVar, getRandomPosition, getNextHPDrop, getNextWeaponDrop
Bullet, Drop, Input, Menu, Player, Zombie, BigZombie, SmallZombie, settings
*/

let clock, scene, camera, renderer;
let player;
const playerColour = 0xF44336,
	planeColor = 0xFFFFFF;
let planeG, planeM, plane;
const planeSize = 50;

let light;
const lightsAmount = 4; // eslint-disable-line no-unused-vars
let frameTime;

let enemies = [];

const enemyAmount = 300,
	initialEnemyAmount = 3;
let currentEnemyAmount = initialEnemyAmount;

let game = {

	waveNumber: 1,
	enemiesKilled: 0,
	packagesReceived: 0,
	bulletsUsed: 0,
	statsUpdated: false
};

let isWaveSpawning = true;


let bullets = [];
const bulletsAmount = 30;

let weapons = [];
const gunFlareFalloffTime = [10, 10, 10, 1, 1];
const gunFlareColor = [0xF7EFB1, 0xF7EFB1, 0xF7EFB1, 0x0000FF, 0x0]; // eslint-disable-line no-unused-vars
let gunFlare;

let listener, audioLoader; // eslint-disable-line no-unused-vars

let healthDropCounter, weaponDropCounter;
const healthDropTime = 30, weaponDropTime = 20;

let hpDrops = [],
	weaponDrops = [];
const hpDropAmount = 1,
	weaponDropAmount = 4;

const invisibleYPos = 100; // eslint-disable-line no-unused-vars

let lightFlickerCounter = 0; // eslint-disable-line no-unused-vars

/* Materials */
const playerMaterial = new THREE.MeshPhongMaterial({ color: playerColour, skinning: settings.modeslEnabled ? true : false }), // eslint-disable-line no-unused-vars
	zombieMaterial = new THREE.MeshPhongMaterial({ color: 0x4CAF50, skinning: settings.modeslEnabled ? true : false }), // eslint-disable-line no-unused-vars
	bigZombieMaterial = new THREE.MeshPhongMaterial({ color: 0x724CAE, skinning: settings.modeslEnabled ? true : false }), // eslint-disable-line no-unused-vars
	smallZombieMaterial = new THREE.MeshPhongMaterial({ color: 0xD1B829, skinning: settings.modeslEnabled ? true : false }), // eslint-disable-line no-unused-vars
	smallZombiePrepareMaterial = new THREE.MeshPhongMaterial({ color: 0xD16729, skinning: settings.modeslEnabled ? true : false }), // eslint-disable-line no-unused-vars
	smallZombieDashMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000, skinning: settings.modeslEnabled ? true : false }), // eslint-disable-line no-unused-vars
	weaponDropMaterial = new THREE.MeshPhongMaterial({ color: 0xFF5722 }), // eslint-disable-line no-unused-vars
	hpDropMaterial = new THREE.MeshPhongMaterial({ color: 0x4CAF50 }), // eslint-disable-line no-unused-vars
	planeMaterial = new THREE.MeshPhongMaterial({ color: planeColor }); // eslint-disable-line no-unused-vars

/* Geometries */
let characterGeometry = new THREE.BoxBufferGeometry(1, 2, 1), // eslint-disable-line no-unused-vars
	zombieGeometry = new THREE.BoxBufferGeometry(1, 2, 1), // eslint-disable-line no-unused-vars
	bigZombieGeometry = new THREE.BoxBufferGeometry(2, 4, 2), // eslint-disable-line no-unused-vars
	smallZombieGeometry = new THREE.BoxBufferGeometry(1, 1, 1), // eslint-disable-line no-unused-vars
	dropGeometry = new THREE.BoxBufferGeometry(1, 1, 1); // eslint-disable-line no-unused-vars


// DEBUG
let stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

let modelLoader = new THREE.JDLoader();

/**
 * Window resize event handler
 */
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}
if (settings.modelsEnabled) loadModels(init);
else init();
animate();

function reset() {
	setupPlayer();
	currentEnemyAmount = initialEnemyAmount;
	game.waveNumber = 1;
	game.bulletsUsed = game.enemiesKilled = game.packagesReceived = 0;
	isWaveSpawning = true;

	healthDropCounter = healthDropTime;
	weaponDropCounter = weaponDropTime;
}

function loadModels(callback) {
	modelLoader.load("./models/enemy.jd", data => {
		characterGeometry = data.geometries[0];
		callback();
	});
}

function getWeapons() { // eslint-disable-line no-unused-vars
	let parseResult = parseJSONToVar("weapons.json", "weapons", weapons);
	parseResult.then(() => {
		Audio.loadWeaponSounds();
		Audio.loadPickupSounds();
		Audio.loadEnemySounds();
		Audio.loadPlayerSounds();
		listener.setMasterVolume(settings.masterVolume);
		setupPlayer();
		setGunFlare();

		player.Mesh.add(listener);
	});
}

/** Initialise scene */
function init() {
	clock = new THREE.Clock();
	frameTime = 0;

	//loadModels(getWeapons);


	healthDropCounter = healthDropTime;
	weaponDropCounter = weaponDropTime;
	Input.keyboardInit();

	scene = new THREE.Scene();

	// Camera
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, 40, -40);
	camera.rotateY(Math.degToRad(-180));
	camera.rotateX(Math.degToRad(-45));
	gunFlare = new THREE.PointLight(0x0, 0, 10, 2);

	listener = new THREE.AudioListener();
	audioLoader = new THREE.AudioLoader();

	// Load player asynchronously
	let parseResult = parseJSONToVar("weapons.json", "weapons", weapons);
	parseResult.then(function () {
		Audio.loadWeaponSounds();
		Audio.loadPickupSounds();
		Audio.loadEnemySounds();
		Audio.loadPlayerSounds();
		listener.setMasterVolume(settings.masterVolume);
		setupPlayer();
		setGunFlare();

		player.Mesh.add(listener);
	});

	// Models
	for (let i = 0; i < bulletsAmount; ++i) {
		bullets.push(new Bullet());
	}

	for (let i = 0; i < enemyAmount; ++i) {
		if (i !== 0 && i % 15 === 0) enemies.push(new BigZombie());
		else if (i !== 0 && i % 5 === 0) enemies.push(new SmallZombie());
		else enemies.push(new Zombie());

		enemies[enemies.length - 1].addToScene();
	}

	for (let i = 0; i < hpDropAmount; ++i) {
		hpDrops.push(new Drop("HP"));
	}
	for (let i = 0; i < weaponDropAmount; ++i) {
		weaponDrops.push(new Drop("weapon"));
	}

	planeG = new THREE.BoxGeometry(planeSize, planeSize / 2, planeSize);
	planeM = planeMaterial;
	plane = new THREE.Mesh(planeG, planeM);
	plane.material.side = THREE.BackSide;

	plane.castShadow = false;
	plane.receiveShadow = true;
	scene.add(plane);

	// Lights
	const lightIntensity = 2,
		lightColor = 0xFFFFFF;
	let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
	scene.add(ambientLight);

	light = new THREE.PointLight(lightColor, lightIntensity, 50, 2);
	light.castShadow = true;
	scene.add(light);
	light.position.set(0, 20, 0);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x0, 1);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	document.body.appendChild(renderer.domElement);

	plane.translateY(planeSize / 4);

	/* Button actions */
	$("#start-button").click(() => {
		Menu.isMainMenu = false;
		Menu.showUI();
		reset();
	});
	$("#resume-button").click(() => {
		Input.isPaused = false;
	});
	$("#exit-button").click(() => {
		Menu.isMainMenu = true;
		Menu.hideMenu();
		Input.isPaused = false;
		Menu.hideUI();
		reset();
	});

	$("#play-again-button").click(() => {
		Menu.isMainMenu = false;
		Menu.hideMenu();
		Input.isPaused = false;
		Menu.showUI();
		reset();
	});

	$("#settings-button").click(() => {
		applySettings();
		Menu.isMainMenu = false;
		Menu.showMenu("settings");
		Input.isPaused = true;
		Menu.hideUI();
	});

	$("#save-settings-button").click(() => {
		saveSettings();
		applySettings();
		$("#exit-button").click();
	});

	$("#cancel-settings-button").click(() => {
		$("#exit-button").click();
	});
	//requestAnimationFrame(animate);
	renderer.render(scene, camera);
	Menu.hideUI();
}

/** Save settings in settings object */
function saveSettings() {
	settings.masterVolume = parseFloat($("#volume-slider").val());

	localStorage.setItem("settings", JSON.stringify(settings));
}

/** Pass setting values to controls and game logic */
function applySettings() {
	listener.setMasterVolume(settings.masterVolume);
	$("#volume-slider").val(settings.masterVolume);
}

/** Prepare player for game */
function setupPlayer() {
	if (player === undefined) {
		player = new Player();
		player.addToScene();
		player.Mesh.add(camera);
	}

	player.reset();

	game.waveNumber = 0;
	currentEnemyAmount = initialEnemyAmount;

	hpDrops.forEach(drop => {
		drop.reset();
	});

	weaponDrops.forEach(drop => {
		drop.reset();
	});

	enemies.forEach(enemy => {
		enemy.reset();
	});
}

/** Set the position of the gun flare */
function setGunFlare() {
	gunFlare.position.add(new THREE.Vector3(0, 0.5, 1.3));
	gunFlare.rotateY();
	gunFlare.castShadow = true;
	player.Mesh.add(gunFlare);
}

/** Animate scene */
function animate() {
	stats.begin();
	requestAnimationFrame(animate);

	if (player !== undefined) {

		updateUI();

		Input.resolveInput();

		if (!Input.isPaused && !Menu.isMainMenu) {

			updateAttackCounters();

			updateSoundCounters();

			updateBullet();

			if (settings.modelsEnabled) updateAnimationMixers();

			//updateLightFlicker();

			if (player.isTurning) {
				player.rotateRight(600);
				if (player.angleRotated >= 170) player.isTurning = false;
			}

			moveEnemies();
			updateSpawnCounters();
			collisions();

			updateDropCounters();

			if (!enemyAlive() && !isWaveSpawning) {
				spawnWave();
			}
		} if (player.isDead && !game.statsUpdated) {
			$("#hp-bar")[0].innerHTML = player.HP;
			Menu.showMenu("end");
			Input.isPaused = true;
			$("#wave-num-stat").html(game.waveNumber);
			$("#enemies-killed-stat").html(game.enemiesKilled);
			$("#packages-received-stat").html(game.packagesReceived);
			$("#bullets-used-stat").html(game.bulletsUsed);
			game.statsUpdated = true;
		}
		renderer.render(scene, camera);
		frameTime = clock.getDelta();
	}
	stats.end();
}

/** Update elements from the UI */
function updateUI() {
	if (Menu.isMainMenu && !Menu.isShowingMenu) {
		Menu.showMenu("main");

	} else if (Input.isPaused && !Menu.isShowingMenu) {
		Menu.showMenu("pause");
	} else if (!Input.isPaused && !Menu.isMainMenu) {
		Menu.hideMenu();
		if (game.waveNumber > 0) {
			$("#wave-number")[0].innerHTML = game.waveNumber;
		}
		if (player.HP >= 0) {
			$("#hp-bar")[0].innerHTML = player.HP;
		}
		if (weapons[1]) {
			$("#current-weapon-name")[0].innerHTML = weapons[player.currentWeapon].name;
			$("#current-weapon-ammo")[0].innerHTML = player.weaponsAmmo[player.currentWeapon];
		}
	}
}

/** Decrease attack cooldowns */
function updateAttackCounters() {
	enemies.forEach(e => {
		if (e.isSpawned && e.attackCounter > 0) {
			e.attackCounter -= frameTime;
		}
	});
	for (let i = 0; i < weapons.length; ++i) {
		if (player.attackCounter[i] > 0) {
			player.attackCounter[i] -= frameTime;
		}
	}
}

function updateSoundCounters() {
	enemies.forEach(e => {
		if (e.isSpawned) {
			if (e.soundCounter > 0) {
				e.soundCounter -= frameTime;
			} else if (e.soundCounter < 0) {
				e.playSound();
			}
		}
	});

}

/** Decrease bullet lifetime and dispose of bullets */
function updateBullet() {
	bullets.forEach(b => {
		if (b.isAlive) {
			b.lifeTime -= frameTime;
			b.position.add(b.direction.multiplyScalar(b.speed));
			//console.log(bullets[i].position);
		}
		if (b.lifeTime < 0) {
			b.reset();
		}
	});

	if (gunFlare.intensity > 0) {
		gunFlare.intensity -= frameTime * gunFlareFalloffTime[player.currentWeapon];
		if (gunFlare.intensity < 0) gunFlare.intensity = 0;
	}
}

/**
 * Go through all mixers and update their state
 */
function updateAnimationMixers() {
	player.animationMixer.update(frameTime);
	enemies.forEach(e => {
		if (e.isSpawned) e.animationMixer.update(frameTime);
	});
}

/** Move enemies towards player */
function moveEnemies() {
	enemies.forEach(e => {
		if (e.isSpawned && e.HP > 0) {
			e.moveTowardPlayer();
		}
		else if (e.HP <= 0 && e.isSpawned) {
			// Enemy died
			// TODO: add death counter
			e.die();
		}
	});
}

function updateSpawnCounters() {
	for (let i = 0; i < currentEnemyAmount; ++i) {
		if (enemies[i].shouldSpawn) {
			enemies[i].spawnCountDown -= frameTime;

			if (enemies[i].spawnCountDown < 0) {
				enemies[i].spawn();
				if (isWaveSpawning && i == currentEnemyAmount - 1) {
					isWaveSpawning = false;
				}
			}
		} else if (enemies[i].isPlayingSpawnAnimation && enemies[i].position.y < 1) {
			enemies[i].Mesh.translateY(0.2);
			if (enemies[i].position.y > enemies[i].startingYPos) {
				enemies[i].position.y = enemies[i].startingYPos;
				enemies[i].isPlayingSpawnAnimation = false;
			}
		}
	}
}

/** Detect and resolve collisions between models */
function collisions() {
	enemyCollisions();
	objectCollisions();
	wallCollisions();
}

/** Collisions between enemy and player models */
function enemyCollisions() {
	// Check every active enemy...
	enemies.forEach(a => {
		if (a.isSpawned) {
			enemies.forEach(b => {
				if (b.isSpawned) {
					if (b.position.distanceTo(a.position) < (a.radius + b.radius)) {
						let direction = a.position.clone().sub(b.position).normalize();
						a.position.add(direction.clone().multiplyScalar(a.moveSpeed * frameTime));
						b.position.add(direction.clone().multiplyScalar(-b.moveSpeed * frameTime));
					}
				}
			});
			while (a.position.distanceTo(player.position) < (a.radius + player.radius)) {
				let direction = a.position.clone().sub(player.position).normalize();
				a.position.add(direction.clone().multiplyScalar(a.moveSpeed * frameTime));
				//player.position.add(direction.clone().multiplyScalar(-player.radius / 10));
				a.attack();
			}
		}
	});
}

/** Collisions between characters and objects */
function objectCollisions() {
	// TODO: Health packs, weapon drops, walls, etc

	// Check each object against the player
	hpDrops.forEach(d => {
		if (d.isSpawned) {
			if (d.position.distanceTo(player.position) < (player.radius * 2)) {
				player.heal(d.value);
				d.unspawn();
				game.packagesReceived++;
			}
		}
	});
	weaponDrops.forEach(d => {
		if (d.isSpawned) {
			if (d.position.distanceTo(player.position) < (player.radius * 2)) {
				player.acquireWeapon(d.value);
				d.unspawn();
				game.packagesReceived++;
			}
		}
	});
}

/** Check if character against the walls */
function wallCollisions() {

}

/** Decrease weapon and health drop counters */
function updateDropCounters() {
	weaponDrops.forEach(function (v) {
		v.Mesh.rotateY(0.1);
	});

	hpDrops.forEach(function (v) {
		v.Mesh.rotateY(0.1);
	});

	if (Drop.weaponDropSpawnedThisWave) {
		weaponDropCounter -= frameTime;
	}
	if (player.HP < 10 && Drop.wavesSinceHPDrop >= Drop.wavesBetweenHPDrop) {
		healthDropCounter -= frameTime;
	}

	if (healthDropCounter < 0) {
		healthDropCounter = healthDropTime;
		makeDrop("HP");
	}
	if (weaponDropCounter < 0) {
		weaponDropCounter = weaponDropTime;
		makeDrop("weapon");
		Drop.weaponDropSpawnedThisWave = true;
	}
}

/**
 * Make a drop from the specified type
 * @param {string} type - Type of drop to be made
 */
function makeDrop(type) {
	// 1. Calculate random position
	const position = getRandomPosition(planeSize);
	// 2. Set drop to position and calculate random index if weapon
	if (type == "weapon") {
		const value = Math.randomInterval(1, weapons.length - 1);
		let weapon = getNextWeaponDrop();
		if (!weapon.isSpawned) {
			weapon.spawn(position, value);
		}
	}

	if (type == "HP") {
		let hp = getNextHPDrop();
		if (!hp.isSpawned) {
			Drop.wavesSinceHPDrop = 0;
			hp.spawn(position, 2);
		}
	}
}

/** Trigger CSS animations */
function triggerIncomingWaveAnim() {
	let wave = $("#wave-number")[0];
	wave.classList.remove("incoming-wave-anim");
	void wave.offsetWidth;
	wave.classList.add("incoming-wave-anim");
}

/**
 * Check if there's any enemy alive
 * @returns {bool} Whether any enemy is alive
 */
function enemyAlive() {
	for (let i = 0; i < currentEnemyAmount; ++i) {
		if (enemies[i].isSpawned) {
			return true;
		}
	}
	return false;
}

/** */
function spawnWave() {
	triggerIncomingWaveAnim();
	Audio.waveChangeSound.play();
	isWaveSpawning = true;
	game.waveNumber++;

	if (!Drop.weaponDropSpawnedThisWave) {
		makeDrop("weapon");
	}
	Drop.weaponDropSpawnedThisWave = false;
	Drop.wavesSinceHPDrop++;

	// TODO: increase number of enemies to spawn
	currentEnemyAmount += 2;

	for (let i = 0; i < currentEnemyAmount; ++i) {
		enemies[i].shouldSpawn = true;
	}
}
