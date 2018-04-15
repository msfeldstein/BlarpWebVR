class Colliders {
  constructor() {
    this.colliders = []
    this.tempVec = new THREE.Vector3()
    this.tempVec2 = new THREE.Vector3()
  }

  addSphericalCollider(mesh, optionalRadius) {
    let radius = optionalRadius
    if (!radius) {
      mesh.geometry.computeBoundingSphere()
      throw "needs a radius currently"
    }
    this.colliders.push({
      type: 'sphere',
      radius: radius,
      mesh: mesh
    })
  }

  addBoxCollider(object3D, optionalBox) {

  }

  update() {
    for (let i = 0; i < this.colliders.length; i++) {
      const first = this.colliders[i]
      for (let j = i + 1; j < this.colliders.length; j++) {
        const second = this.colliders[j]
        const p1 = first.mesh.getWorldPosition(this.tempVec)
        const p2 = second.mesh.getWorldPosition(this.tempVec2)
        if (p1.distanceTo(p2) <= first.radius + second.radius) {
          first.mesh.dispatchEvent({type: Colliders.CollideEvent, other: second})
          second.mesh.dispatchEvent({type: Colliders.CollideEvent, other: first})
        }
      }
    }
  }
}

Colliders.CollideEvent = 'Collide'

module.exports = Colliders
