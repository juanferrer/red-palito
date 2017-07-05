var clock, scene, camera, renderer;
var player;
var planeG, planeM, plane, planeColor;
var planeSize = 100;
var light;
var frameTime;

var enemies = [];
var enemyAmount = 3;

var bullets = [];
var bulletsAmount = 5;

var weapons = [];

var healthDropCounter, weaponDropCounter, healthDropTime = 25, weaponDropTime = 10;

var hpDrops = [];
var weaponDrops = [];
var hpDropAmount = 1;
var weaponDropAmount = 4;


init();
animate();


/**
 * Initialise scene
 */
function init() {

	clock = new THREE.Clock();
	frameTime = 0;

	var parseResult = parseJSONToVar("https://raw.githubusercontent.com/JuanFerrer/Survival/master/weapons.json", "weapons", weapons);

	healthDropCounter = healthDropTime;
	weaponDropCounter = weaponDropTime;
	keyboardInit();
	spawnPointsInit();

	scene = new THREE.Scene();

	// Camera
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, 40, -40);
	camera.rotateY(Math.degToRad(-180));
	camera.rotateX(Math.degToRad(-45));

	// Load player asynchronously
	parseResult.then(function () {
		player = new Player();
		player.addToScene();
		player.Mesh.add(camera);
	});

	// Models
	for (var i = 0; i < bulletsAmount; ++i) {
		bullets.push(new Bullet());
	}

	enemies = new Array(enemyAmount);
	for (i = 0; i < enemyAmount; ++i) {
		enemies[i] = new Enemy();
		enemies[i].addToScene();
	}

	for (i = 0; i < hpDropAmount; ++i) {
		hpDrops.push(new Drop("HP"));
	}
	for (i = 0; i < weaponDropAmount; ++i) {
		weaponDrops.push(new Drop("weapon"));
	}

	planeColor = 0xFFFFFF;
	planeG = new THREE.PlaneGeometry(planeSize, planeSize, 20, 20);
	planeM = new THREE.MeshPhongMaterial({ color: planeColor });
	plane = new THREE.Mesh(planeG, planeM);
	plane.castShadow = false;
	plane.receiveShadow = true;
	scene.add(plane);

	// Lights
	var lightX = 10;
	var lightY = 20;
	var lightZ = 10;
	var lightIntensity = 0.7;
	lightColor = 0xFFFFFF;
	light = new THREE.PointLight(lightColor);
	light.castShadow = true;
	light.intensity = lightIntensity;
	scene.add(light);
	light.position.set(lightX, lightY, lightZ);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x212121, 1);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	document.body.appendChild(renderer.domElement);

	plane.rotateX(Math.degToRad(-90));
	plane.translateZ(0);
}

/**
 * Animate scene
 */
function animate() {
	requestAnimationFrame(animate);

	if (player !== undefined) {

		updateUI();

		resolveInput();
		if (!isPaused) {

			updateAttackCounters();

			updateBullet();

			moveEnemies();

			collisions();

			updateDropCounters();

			// TODO: Spawn new wave
		}

		renderer.render(scene, camera);

		frameTime = clock.getDelta();
		clock.getElapsedTime();
	}
}

function updateUI() {
	if (player.HP >= 0)
		document.getElementById("hp-bar").innerHTML = player.HP;
	if (weapons[1]) {
		document.getElementById("current-weapon-name").innerHTML = weapons[player.currentWeapon].name;
		document.getElementById("current-weapon-ammo").innerHTML = player.weaponsAmmo[player.currentWeapon];
	}
}

function updateAttackCounters() {
	for (var i = 0; i < enemyAmount; ++i) {
		if (enemies[i].attackCounter > 0) {
			enemies[i].attackCounter -= frameTime;
		}
	}
	if (player.attackCounter > 0) {
		player.attackCounter -= frameTime;
	}
}

/**
 * Decrease bullet lifetime and dispose of bullets
 */
function updateBullet() {
	for (var i = 0; i < bulletsAmount; ++i) {
		if (bullets[i].isAlive) {
			bullets[i].lifeTime -= frameTime;
			bullets[i].position.add(bullets[i].direction.multiplyScalar(bullets[i].speed));
			//console.log(bullets[i].position);
		}
		if (bullets[i].lifeTime < 0) {
			bullets[i].reset();
		}
	}
}

/**
 * Move enemies towards player
 */
function moveEnemies() {
	for (var i = 0; i < enemyAmount; ++i) {
		if (enemies[i].isSpawned && enemies[i].HP > 0) {
			enemies[i].moveTowardPlayer();
		}
		else {
			enemies[i].spawnCountDown -= frameTime;
			if (enemies[i].spawnCountDown < 0) {
				enemies[i].spawn();
				console.log("Spawning");
			}
		}
	}
}

/**
 * Detect and resolve collisions between models
 */
function collisions() {
	enemyCollisions();
	objectCollisions();
}

/** Collisions between enemy and player models */
function enemyCollisions() {
	// Check every active enemy...
	for (var i = 0; i < enemyAmount; ++i) {
		if (enemies[i].isSpawned) {
			// ...against every other active enemy...
			for (var j = i + 1; j < enemyAmount; ++j) {
				if (enemies[j].isSpawned) {
					if (enemies[j].position.distanceTo(enemies[i].position) < (enemies[i].radius + enemies[j].radius)) {
						var direction = enemies[i].position.clone().sub(enemies[j].position).normalize();
						enemies[i].position.add(direction.clone().multiplyScalar(enemies[i].radius / 10));
						enemies[j].position.add(direction.clone().multiplyScalar(-enemies[j].radius / 10));
					}
				}
			}
			//...and then the player
			while (enemies[i].position.distanceTo(player.position) < (enemies[i].radius + player.radius)) {
				var direction = enemies[i].position.clone().sub(player.position).normalize();
				enemies[i].position.add(direction.clone().multiplyScalar(enemies[i].radius / 10));
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
	for (var i = 0; i < hpDropAmount; ++i) {
		if (hpDrops[i].isSpawned) {
			if (hpDrops[i].position.distanceTo(player.position) < (player.radius)) {
				player.heal(hpDrops[i].value);
				hpDrops[i].unspawn();
			}
		}
	}
	for (var i = 0; i < weaponDropAmount; ++i) {
		if (weaponDrops[i].isSpawned) {
			if (weaponDrops[i].position.distanceTo(player.position) < (player.radius * 2)) {
				player.acquireWeapon(weaponDrops[i].value);
				weaponDrops[i].unspawn();
			}
		}
	}
}

/**
 * Decrease weapon and health drop counters
 */
function updateDropCounters() {
	for (var i = 0; i < weaponDropAmount; ++i) {
		weaponDrops[i].Mesh.rotateY(0.1);
	}
	for (var i = 0; i < hpDropAmount; ++i) {
		hpDrops[i].Mesh.rotateY(0.1);
	}

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
	var position = new THREE.Vector3(((Math.random() * planeSize) - (planeSize / 2.0)),
		1,
		((Math.random() * planeSize) - (planeSize / 2.0)));
	// 3. Set drop to position and calculate random index if weapon
	if (type == "weapon") {
		var value = Math.randomInterval(0, weapons.length - 1);
		var weapon = getNextWeaponDrop();
		if (!weapon.isSpawned) {
			weapon.spawn(position, value);
			console.log(type + " dropped. " + value);
		}
	}

	if (type == "HP") {
		var hp = getNextHPDrop();
		if (!hp.isSpawned) {
			hp.spawn(position, 3);
		}
	}
}

/** Trigger CSS nimations */
function triggerIncomingWaveAnim() {
	var wave = document.getElementById("wave-number");
	wave.classList.remove("incoming-wave-anim");
	void wave.offsetWidth;
	wave.classList.add("incoming-wave-anim");
}