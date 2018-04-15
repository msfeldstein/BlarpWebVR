const direction = new THREE.Vector3
const worldPosition = new THREE.Vector3

class Ball extends THREE.Object3D{
  constructor(room) {
    super()
    this.bounds = room
    this.radius = 0.2
    this.mesh = new THREE.Mesh(
      new THREE.SphereBufferGeometry(this.radius),
      new THREE.MeshBasicMaterial()
    )
    this.velocity = new THREE.Vector3()
    this.add(this.mesh)
    this.box = new THREE.Box3()
  }

  attract(controller) {
    if (!controller.getButtonState('trigger')) {
      return
    }
    controller.getWorldPosition(worldPosition)
    direction.subVectors(worldPosition, this.position)
    direction.normalize()
    direction.multiplyScalar(0.001)
    this.velocity.add(direction)
  }

  update() {
    this.box.setFromObject(this.bounds)
    const box = this.box
    if (this.position.x > box.max.x && this.velocity.x > 0 ||
        this.position.x < box.min.x && this.velocity.x < 0) {
      this.velocity.x = -this.velocity.x * 0.5
    }
    if (this.position.y > box.max.y && this.velocity.y > 0 ||
        this.position.y < box.min.y && this.velocity.y < 0) {
      this.velocity.y = -this.velocity.y * 0.5
    }
    if (this.position.z > box.max.z && this.velocity.z > 0 ||
        this.position.z < box.min.z && this.velocity.z < 0) {
      this.velocity.z = -this.velocity.z * 0.5
    }
    this.position.add(this.velocity)
    this.velocity.multiplyScalar(0.999)
  }
}

module.exports = Ball
