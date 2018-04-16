var MeshLine = require( 'three.meshline' );

class GuideLine extends THREE.Line {
  constructor(ball, controller) {
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([0, 0, 0, 0, 0, 0])
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const material = new THREE.LineBasicMaterial({
      linewidth: 3
    })
    super(
      geometry, material
    )
    this.ball = ball
    this.controller = controller
    this.frustumCulled = false
    this.tmpV = new THREE.Vector3()
  }

  update() {
    const positions = this.geometry.attributes.position.array
    this.ball.getWorldPosition(this.tmpV)
    positions[0] = this.tmpV.x
    positions[1] = this.tmpV.y
    positions[2] = this.tmpV.z
    this.controller.getWorldPosition(this.tmpV)
    positions[3] = this.tmpV.x
    positions[4] = this.tmpV.y
    positions[5] = this.tmpV.z
    this.geometry.attributes.position.needsUpdate = true
  }
}

module.exports = GuideLine
