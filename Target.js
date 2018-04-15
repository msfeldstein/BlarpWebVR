class Target extends THREE.Mesh {
  constructor() {
    super(
      new THREE.SphereBufferGeometry(0.3),
      new THREE.MeshBasicMaterial({color: 0xff0000})
    )
    this.box = new THREE.Box3()
  }

  randomize(room) {
    this.box.setFromObject(room)
    this.position.x = this.box.min.x + (this.box.max.x - this.box.min.x) * Math.random()
    this.position.y = this.box.min.y + (this.box.max.y - this.box.min.y) * Math.random()
    this.position.z = this.box.min.z + (this.box.max.z - this.box.min.z) * Math.random()
  }

  spawn(room) {
    this.randomize(room)
  }
}

module.exports = Target
