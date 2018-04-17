const direction = new THREE.Vector3
const worldPosition = new THREE.Vector3
const zero = new THREE.Vector3()
class Ball extends THREE.Object3D{
  constructor(room) {
    super()
    this.name = "Ball"
    this.bounds = room
    this.radius = 0.2
    this.mesh = new THREE.Mesh(
      new THREE.SphereBufferGeometry(this.radius),
      new THREE.MeshBasicMaterial()
    )
    this.add(this.mesh)
    this.box = new THREE.Box3()
  }

  initPhysics(world, position) {
    this.body = world.add({
      type: 'sphere',
      size: [0.2, 0.2, 0.2],
      pos: [position.x, position.y, position.z],
      move: true,
      friction: 0.2,
      restitution: 0.2,
      belongsTo: 1,
      collidesWith: 0xffffffff
    })
  }

  attract(controller, target) {
    if (!controller.getButtonState('trigger')) {
      return
    }
    target.getWorldPosition(worldPosition)
    direction.subVectors(worldPosition, this.position)
    direction.normalize()
    direction.multiplyScalar(0.001)
    this.body.applyImpulse(zero, direction)
  }

  update() {
    if (!this.body) return
    this.position.copy(this.body.getPosition())
  }
}

module.exports = Ball
