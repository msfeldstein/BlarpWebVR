class RestartButton extends THREE.Mesh {
  constructor(camera) {
    super(
      new THREE.PlaneBufferGeometry(1, 1),
      new THREE.MeshBasicMaterial()
    )
    camera.add(this)
    this.position.z = -1
  }
}

module.exports = RestartButton
