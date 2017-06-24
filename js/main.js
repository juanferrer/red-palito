var clock, scene, camera, renderer;
var player;
var planeG, planeM, plane, planeColor;
var light;
var frameTime;

var enemy = [];
var enemyAmount = 10;

init();
animate();


/**
 * Initialise scene
 */
function init() {

	clock = new THREE.Clock();
	frameTime = 0;

	keyboardInit();
	spawnPointsInit();

	scene = new THREE.Scene();

	// Camera
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.set(0, 40, 40);
	camera.rotateX(Math.degToRad(-40));

	// Models
	player = new Character("player");
	player.addToScene();
	player.Mesh.add(camera);

	enemy = new Array(enemyAmount);
	for (var i = 0; i < enemyAmount; ++i) {
		enemy[i] = new Character("minion");
		enemy[i].addToScene();
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
	clock.getElapsedTime();

	requestAnimationFrame(animate);

	resolveInput();

	moveEnemies();

	collisions();

	renderer.render(scene, camera);

	frameTime = clock.getDelta();
}

/**
 * Move enemies towards player
 */
function moveEnemies() {
	for (var i = 0; i < enemyAmount; ++i) {
		if (enemy[i].isSpawned) {
			enemy[i].moveTowardPlayer();
		}
		else {
			enemy[i].spawnCountDown -= frameTime;
			if (enemy[i].spawnCountDown < 0) {
				enemy[i].spawn();
				console.log("Spawning");
			}
		}
	}
}

/**
 * Detect and resolve collisions between models
 */
function collisions() {
	for (var i = 0; i < enemyAmount; ++i) {
		// Only check active enemies...
		if (enemy[i].isSpawned) {
			// ...against every other active enemy...
			for (var j = i + 1; j < enemyAmount; ++j) {
				if (enemy[j].isSpawned) {
					if (enemy[j].position.distanceTo(enemy[i].position) < (enemy[i].radius + enemy[j].radius))
				}
			}
			//...and then the player
		}
	}
}