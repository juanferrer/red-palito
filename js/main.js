/*global THREE, Stats, $
parseJSONToVar, spawnPointsInit, getRandomPosition, getNextHPDrop, getNextWeaponDrop
Bullet, Drop, Input, Menu, Player, Enemy
*/

let clock, scene, camera, renderer;
let player;
const playerColour = 0xF44336,
	planeColor = 0xFFFFFF;
let planeG, planeM, plane;
const planeSize = 50;

let lights = [];
const lightsAmount = 4;
let frameTime;

let enemies = [];

const enemyAmount = 300,
	initialEnemyAmount = 3;
let currentEnemyAmount = initialEnemyAmount;

let waveNumber = 1;
let isWaveSpawning = true;

let bullets = [];
const bulletsAmount = 30;

let weapons = [];
const gunFlareFalloffTime = [10, 10, 10, 1, 1];
const gunFlareColor = [0xF7EFB1, 0xF7EFB1, 0xF7EFB1, 0x0000FF, 0x0];
let gunFlare;

let listener, audioLoader;

let healthDropCounter, weaponDropCounter;
const healthDropTime = 25, weaponDropTime = 10;

let hpDrops = [],
	weaponDrops = [];
const hpDropAmount = 1,
	weaponDropAmount = 4;

let lightFlickerCounter = 0;

/* Materials */
const playerMaterial = new THREE.MeshPhongMaterial({ color: playerColour }),
	enemyMaterial = new THREE.MeshPhongMaterial({ color: 0x4CAF50 }),
	weaponDropMaterial = new THREE.MeshPhongMaterial({ color: 0xFF5722 }),
	hpDropMaterial = new THREE.MeshPhongMaterial({ color: 0x4CAF50 }),
	planeMaterial = new THREE.MeshPhongMaterial({ color: planeColor });

/* Geometries */
const characterGeometry = new THREE.BoxBufferGeometry(1, 2, 1),
	dropGeometry = new THREE.BoxBufferGeometry(1, 1, 1);

// DEBUG
let stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

init();
animate();

function reset() {
	setupPlayer();
	currentEnemyAmount = initialEnemyAmount;
	waveNumber = 1;
	isWaveSpawning = true;

	healthDropCounter = healthDropTime;
	weaponDropCounter = weaponDropTime;
}

/** Initialise scene */
function init() {

	clock = new THREE.Clock();
	frameTime = 0;

	// chrome.exe --allow-file-access-from-files --disable-web-security
	let parseResult = parseJSONToVar("weapons.json", "weapons", weapons);

	healthDropCounter = healthDropTime;
	weaponDropCounter = weaponDropTime;
	Input.keyboardInit();
	spawnPointsInit();

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
	parseResult.then(function () {
		Audio.loadWeaponSounds();
		setupPlayer();
		setGunFlare();

		player.Mesh.add(listener);
	});

	// Models
	for (let i = 0; i < bulletsAmount; ++i) {
		bullets.push(new Bullet());
	}

	for (let i = 0; i < enemyAmount; ++i) {
		addEnemy();
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
	const lightX = [15, 15, -15, -15],
		lightY = 20,
		lightZ = [15, -15, -15, 15],
		lightIntensity = 2,
		lightColor = 0xFFFFFF;
	let light = new THREE.AmbientLight(0xFFFFFF, 0.1);
	scene.add(light);
	for (let i = 0; i < lightsAmount; ++i) {
		lights.push(new THREE.PointLight(lightColor, lightIntensity, 30, 2));
		lights[lights.length - 1].castShadow = true;
		scene.add(lights[lights.length - 1]);
		lights[lights.length - 1].position.set(lightX[i], lightY, lightZ[i]);
	}

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x0, 1);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	document.body.appendChild(renderer.domElement);

	//plane.rotateX(Math.degToRad(-90));
	plane.translateY(planeSize / 4);

	/* Button actions */
	$("#start-button").click(() => {
		Menu.isMainMenu = false;
		reset();
	});
	$("#resume-button").click(() => {
		Input.isPaused = false;
	});
	$("#exit-button").click(() => {
		Menu.isMainMenu = true;
		Menu.hideMenu();
		Input.isPaused = false;
	});
	//requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

/** Prepare player for game */
function setupPlayer() {
	if (player === undefined) {
		player = new Player();
		player.addToScene();
		player.Mesh.add(camera);
	}

	player.reset();

	waveNumber = 0;
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

function addEnemy() {
	enemies.push(new Enemy());
	enemies[enemies.length - 1].addToScene();
}

/** Animate scene */
function animate() {
	stats.begin();
	requestAnimationFrame(animate);

	// if (player !== undefined) {
	if (player !== undefined) {

		updateUI();

		Input.resolveInput();

		if (!Input.isPaused && !Menu.isMainMenu) {

			updateAttackCounters();

			updateBullet();

			//updateLightFlicker();

			moveEnemies();
			updateSpawnCounters();

			collisions();

			updateDropCounters();

			if (!enemyAlive() && !isWaveSpawning) {
				spawnWave();
			}
		}
		if (player.HP === 0) {
			Menu.showMenu("end");
		}

		renderer.render(scene, camera);
	}
	frameTime = clock.getDelta();
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
		if (waveNumber > 0) {
			$("#wave-number")[0].innerHTML = waveNumber;
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
	for (let i = 0; i < enemyAmount; ++i) {
		if (enemies[i].attackCounter > 0) {
			enemies[i].attackCounter -= frameTime;
		}
	}
	if (player.attackCounter > 0) {
		player.attackCounter -= frameTime;
	}
}

/** Decrease bullet lifetime and dispose of bullets */
function updateBullet() {
	for (let i = 0; i < bulletsAmount; ++i) {
		if (bullets[i].isAlive) {
			bullets[i].lifeTime -= frameTime;
			bullets[i].position.add(bullets[i].direction.multiplyScalar(bullets[i].speed));
			//console.log(bullets[i].position);
		}
		if (bullets[i].lifeTime < 0) {
			bullets[i].reset();
		}
	}
	if (gunFlare.intensity > 0) {
		gunFlare.intensity -= frameTime * gunFlareFalloffTime[player.currentWeapon];
		if (gunFlare.intensity < 0) gunFlare.intensity = 0;
	}
}

/*function updateLightFlicker() {
	if (lightFlickerCounter < 0) {
		lights[0].intensity = 0;
		lightFlickerCounter = Math.randomInterval(0, 1);
	}
}*/

/** Move enemies towards player */
function moveEnemies() {
	for (let i = 0; i < enemyAmount; ++i) {
		if (enemies[i].isSpawned && enemies[i].HP > 0) {
			enemies[i].moveTowardPlayer();
		}
		else if (enemies[i].HP <= 0 && enemies[i].isSpawned) {
			// Enemy died
			// TODO: add death counter
			enemies[i].die();
		}
	}
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
				//console.log("Spawning");
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
	for (let i = 0; i < enemyAmount; ++i) {
		if (enemies[i].isSpawned) {
			// ...against every other active enemy...
			for (let j = i + 1; j < enemyAmount; ++j) {
				if (enemies[j].isSpawned) {
					while (enemies[j].position.distanceTo(enemies[i].position) < (enemies[i].radius + enemies[j].radius)) {
						let direction = enemies[i].position.clone().sub(enemies[j].position).normalize();
						enemies[i].position.add(direction.clone().multiplyScalar(enemies[i].moveSpeed * frameTime));
						enemies[j].position.add(direction.clone().multiplyScalar(-enemies[j].moveSpeed * frameTime));
					}
				}
			}
			//...and then the player
			while (enemies[i].position.distanceTo(player.position) < (enemies[i].radius + player.radius)) {
				let direction = enemies[i].position.clone().sub(player.position).normalize();
				enemies[i].position.add(direction.clone().multiplyScalar(enemies[i].moveSpeed * frameTime));
				//player.position.add(direction.clone().multiplyScalar(-player.radius / 10));
				enemies[i].attack();
			}
		}
	}
}

/** Collisions between characters and objects */
function objectCollisions() {
	// TODO: Health packs, weapon drops, walls, etc

	// Check each object against the player
	for (let i = 0; i < hpDropAmount; ++i) {
		if (hpDrops[i].isSpawned) {
			if (hpDrops[i].position.distanceTo(player.position) < (player.radius * 2)) {
				player.heal(hpDrops[i].value);
				hpDrops[i].unspawn();
			}
		}
	}
	for (let i = 0; i < weaponDropAmount; ++i) {
		if (weaponDrops[i].isSpawned) {
			if (weaponDrops[i].position.distanceTo(player.position) < (player.radius * 2)) {
				player.acquireWeapon(weaponDrops[i].value);
				weaponDrops[i].unspawn();
			}
		}
	}

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

	healthDropCounter -= frameTime;
	weaponDropCounter -= frameTime;

	if (healthDropCounter < 0) {
		healthDropCounter = healthDropTime;
		makeDrop("HP");
	}
	if (weaponDropCounter < 0) {
		weaponDropCounter = weaponDropTime;
		makeDrop("weapon");
	}
}

/**
 * Make a drop from the specified type
 * @param {string} type - Type of drop to be made
 */
function makeDrop(type) {
	// TODO:
	// 1. Calculate random position
	const position = getRandomPosition(planeSize);
	// 3. Set drop to position and calculate random index if weapon
	if (type == "weapon") {
		const value = Math.randomInterval(0, weapons.length - 1);
		let weapon = getNextWeaponDrop();
		if (!weapon.isSpawned) {
			weapon.spawn(position, value);
			//console.log(type + " dropped. " + value);
		}
	}

	if (type == "HP") {
		let hp = getNextHPDrop();
		if (!hp.isSpawned) {
			hp.spawn(position, 3);
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
	isWaveSpawning = true;
	waveNumber++;

	// TODO: increase number of enemies to spawn
	currentEnemyAmount += 2;

	// for (let i = 0; i < enemyAmount - currentEnemyAmount; ++i) {
	// 	addEnemy();
	// }

	for (let i = 0; i < currentEnemyAmount; ++i) {
		enemies[i].shouldSpawn = true;
	}
}
