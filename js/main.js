var scene, camera, renderer;
var cubeG, cubeM, cube, cubeColor;
var planeG, planeM, plane, planeColor;
var light, lightG, lightM, lightMesh, lightColor;
var light2, lightM2, lightMesh2, lightColor2;
var light3, lightM3, lightMesh3, lightColor3;
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

	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.z = 10;

	// Models
	cubeColor = 0xF44336;
	cubeG = new THREE.IcosahedronGeometry(1);
	cubeM = new THREE.MeshPhongMaterial({ color: cubeColor });
	cube = new THREE.Mesh(cubeG, cubeM);
	cube.castShadow = true;
	cube.receiveShadow = false;
	scene.add(cube);

	planeColor = 0xFFFFFF;
	planeG = new THREE.PlaneGeometry(100, 100, 20, 20);
	planeM = new THREE.MeshPhongMaterial({ color: planeColor });
	plane = new THREE.Mesh(planeG, planeM);
	plane.castShadow = false;
	plane.receiveShadow = true;
	scene.add(plane);

	// Lights
	lightColor = 0x3F51B5;
	light = new THREE.PointLight(lightColor);
	light.castShadow = true;

	lightColor2 = 0xFFFFFF
	light2 = new THREE.PointLight();
	light2.castShadow = true;

	lightColor3 = 0x4CAF50;
	light3 = new THREE.PointLight(lightColor3);
	light3.castShadow = true;

	// Light models
	lightG = new THREE.SphereGeometry(0.3, 100, 100);
	lightM = new THREE.MeshBasicMaterial({ color: lightColor });
	lightMesh = new THREE.Mesh(lightG, lightM);
	light.add(lightMesh);

	lightM2 = new THREE.MeshBasicMaterial({ color: lightColor2 });
	lightMesh2 = new THREE.Mesh(lightG, lightM2);
	light2.add(lightMesh2);

	lightM3 = new THREE.MeshBasicMaterial({ color: lightColor3 });
	lightMesh3 = new THREE.Mesh(lightG, lightM3);
	light3.add(lightMesh3);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x212121, 1);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	document.body.appendChild(renderer.domElement);

	scene.add(light);
	scene.add(light2);
	scene.add(light3);

	plane.rotateX(Math.degToRad(-90));
	plane.translateZ(-3);
}

/**
 * Animate scene
 */
function animate() {

	requestAnimationFrame(animate);

	resolveInput();

	if (!isPaused) {

		if (valueX == null) valueX = 0;
		if (valueY == null) valueY = 0;
		if (counter == null) counter = 0;

		var steps = 200;
		var increase = Math.PI * 2 / steps;
		counter = counter < steps ? counter + 1 : 0

		light.position.x = 2 * Math.sin(valueX);
		light.position.y = 2 * Math.sin(valueX) / 3;
		light.position.z = 2 * -Math.cos(valueY);

		light2.position.x = 3.2 * Math.cos(valueX);
		light2.position.y = 2 * Math.sin(valueX);
		light2.position.z = 3.2 * Math.sin(valueY);

		light3.position.x = 5 * -Math.cos(valueX);
		light3.position.y = 2 * -Math.cos(valueX);
		light3.position.z = 2 * Math.sin(valueY);

		valueX += increase;
		valueY += increase;
		isPaused = false;
	}

	renderer.render(scene, camera);

}