class ControllerModel extends THREE.Object3D {
  constructor() {
    super()
    const mat = new THREE.MeshStandardMaterial()
    for (var i = 1; i < 6; i++) {
      const ring =new THREE.Mesh(
        new THREE.TorusBufferGeometry(.15 - i * .02, .01),
        mat
      )
      this.add(ring)
      ring.rotation.x = Math.PI / 2
      ring.position.y = -i * .1
    }
    this.rotation.x = -Math.PI / 2
  }
}

module.exports = ControllerModel