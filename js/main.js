var scene, camera, renderer;
var playerG, playerM, player, cubeColor;
var planeG, planeM, plane, planeColor;
var light, lightG, lightM, lightMesh, lightColor;
var valueX, valueY, counter;

var isRight = false;
var isUp = false;

init();
animate();


/**
 * Initialise scene
 */
function init() {

	keyboardInit();

	scene = new THREE.Scene();

	// Models
	cubeColor = 0xF44336;
	playerG = new THREE.IcosahedronGeometry(1);
	playerM = new THREE.MeshPhongMaterial({ color: cubeColor });
	player = new THREE.Mesh(playerG, playerM);
	player.castShadow = true;
	player.receiveShadow = false;
	scene.add(player);

	planeColor = 0xFFFFFF;
	planeG = new THREE.PlaneGeometry(100, 100, 20, 20);
	planeM = new THREE.MeshPhongMaterial({ color: planeColor });
	plane = new THREE.Mesh(planeG, planeM);
	plane.castShadow = false;
	plane.receiveShadow = true;
	scene.add(plane);

	// Camera
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.set(0, 20, 20);
	camera.rotateX(Math.degToRad(-50));

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

	player.translateY(0.8);

	plane.rotateX(Math.degToRad(-90));
	plane.translateZ(0);
}

/**
 * Animate scene
 */
function animate() {

	requestAnimationFrame(animate);

	resolveInput();

	if (isCamLocked) {
		camera.lookAt(player.position);
	}

	renderer.render(scene, camera);

}