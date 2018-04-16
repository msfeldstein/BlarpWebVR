class Wand extends THREE.Object3D {
  constructor(controller) {
    super()
    this.controller = controller
    this.rings = []
    for (var r = 0.05; r < 0.15; r += 0.05) {
      const mesh = new THREE.Mesh(
        new THREE.TorusBufferGeometry(r, 0.003, 16, 100),
        new THREE.MeshBasicMaterial()
      )
      mesh.rotSpeedX = 1 + Math.random() * 0.5
      mesh.rotSpeedY = 1 + Math.random() * 0.5
      mesh.rotSpeedZ = 1 + Math.random() * 0.5
      this.rings.push(mesh)
      this.add(mesh)
    }
    controller.add(this)
  }

  update() {
    this.position.z = this.controller.getAxes()[1]
    const speed = 0.01 + this.controller.getButtonValue('trigger') * 0.1
    this.rings.forEach(ring => {
      ring.rotation.x += ring.rotSpeedX * speed
      ring.rotation.y += ring.rotSpeedY * speed
      ring.rotation.z += ring.rotSpeedZ * speed
    })
  }
}

module.exports = Wand
