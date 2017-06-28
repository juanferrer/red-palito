class Bullet {
    constructor() {
        this.Geometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 5, 1);
        this.Material = new THREE.MeshBasicMaterial();
        this.Mesh = new THREE.Mesh(this.Geometry, this.Material);
        this.isAlive = false;
        scene.add(this.Mesh);
        this.Mesh.rotateX(Math.degToRad(90));
        this.Mesh.position.y = -1;
        this.initialLifeTime = 1;
        this.lifeTime = this.initialLifeTime;
        this.direction = null;
        this.speed = 2;
    }

    get position() {
        return this.Mesh.position;
    }

    /**
     * 
     * @param {THREE.Vector3} pos - Spawning position
     * @param {THREE.Vector3} dir - Facing direction of bullet
     */
    spawn(pos, dir) {
        this.direction = dir;
        this.isAlive = true;
        this.lifeTime = this.initialLifeTime;
        this.Mesh.position.set(pos.x, 3, pos.z);
        this.orient();
    }

    /**
     * Orient bullet towards target
     * @param {THREE.Vector3} dir - Facing direction of bullet
     */
    orient() {
        //this.dir;
    }

}