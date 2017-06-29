var clock, scene, camera, renderer;
var player;
var planeG, planeM, plane, planeColor;
var light;
var frameTime;

var enemies = [];
var enemyAmount = 3;

var bullets = [];
var bulletsAmount = 5;

var weapons = [];

init();
animate();


/**
 * Initialise scene
 */
function init() {

	clock = new THREE.Clock();
	frameTime = 0;

	parseJSONToVar("https://raw.githubusercontent.com/JuanFerrer/Survival/master/weapons.json", "weapons", weapons);

	keyboardInit();
	spawnPointsInit();

	scene = new THREE.Scene();

	// Camera
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, 40, -40);
	camera.rotateY(Math.degToRad(-180));
	camera.rotateX(Math.degToRad(-45));

	// Models
	player = new Player();
	player.addToScene();
	player.Mesh.add(camera);

	for (var i = 0; i < bulletsAmount; ++i) {
		bullets.push(new Bullet());
	}

	enemies = new Array(enemyAmount);
	for (i = 0; i < enemyAmount; ++i) {
		enemies[i] = new Enemy();
		enemies[i].addToScene();
	}

	planeColor = 0xFFFFFF;
	planeG = new THREE.PlaneGeometry(100, 100, 20, 20);
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

	updateUI();

	resolveInput();
	if (!isPaused) {

		updateAttackCounters();

		updateBullet();

		moveEnemies();

		collisions();
	}

	renderer.render(scene, camera);

	frameTime = clock.getDelta();
	clock.getElapsedTime();
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