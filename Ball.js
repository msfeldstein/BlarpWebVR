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
      mass: 0,
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
    direction.multiplyScalar(0.002)
    this.body.applyImpulse(zero, direction)
  }

  die() {
    this.body.sleep()
    this.body.linearVelocity.set(0, 0, 0)
    this.mesh.material.color.setHex(0xff0000)
  }

  disappear() {
    this.body.linearVelocity.set(0, 0, 0)
    this.body.mass = 1
    this.mesh.material.transparent = true
    this.mesh.material.needsUpdate = true
    new TWEEN.Tween(this.mesh.material)
      .to({opacity: 0}, 500)
      .start()
  }

  update() {
    if (!this.body) return
    this.position.copy(this.body.getPosition())
  }
}

module.exports = Ball
