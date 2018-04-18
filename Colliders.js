const getBoundingRadius = (object3D) => {
  const sphere = new THREE.Sphere()
  object3D.traverse(o => {
    if (o.geometry) {
      o.geometry.computeBoundingSphere()
      sphere.radius = Math.max(sphere.radius, o.geometry.boundingSphere.radius)
    }
  })
  return sphere.radius
}

class Colliders {
  constructor() {
    this.colliders = []
    this.currentCollisions = {}
    this.tempVec = new THREE.Vector3()
    this.tempVec2 = new THREE.Vector3()
  }

  addSphericalCollider(mesh, optionalRadius) {
    let radius = optionalRadius
    if (!radius) {
      radius = getBoundingRadius(mesh)
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
    this.colliders.forEach(c => c.mesh.updateMatrix())
    for (let i = 0; i < this.colliders.length; i++) {
      const first = this.colliders[i]
      for (let j = i + 1; j < this.colliders.length; j++) {
        const second = this.colliders[j]
        const key = first.mesh.uuid + '-' + second.mesh.uuid
        const p1 = first.mesh.getWorldPosition(this.tempVec)
        const p2 = second.mesh.getWorldPosition(this.tempVec2)
        if (p1.distanceTo(p2) <= first.radius + second.radius) {
          if (this.currentCollisions[key]) {
            continue
          }
          this.currentCollisions[key] = true
          first.mesh.dispatchEvent({type: Colliders.CollideEvent, other: second.mesh})
          second.mesh.dispatchEvent({type: Colliders.CollideEvent, other: first.mesh})
        } else {
          delete this.currentCollisions[key]
        }
      }
    }
  }
}

Colliders.CollideEvent = 'Collide'

module.exports = Colliders
