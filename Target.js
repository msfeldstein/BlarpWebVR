const PlasmaMaterial = require('./materials/Plasma')

class Target extends THREE.Mesh {
  constructor(room) {
    super(
      new THREE.SphereBufferGeometry(0.3, 24, 16),
      new PlasmaMaterial()
    )
    this.name = "Target"
    this.box = new THREE.Box3()
    this.room = room
  }

  randomize(room) {
    this.box.setFromObject(room)
    this.position.x = this.box.min.x + (this.box.max.x - this.box.min.x) * Math.random()
    this.position.y = this.box.min.y + (this.box.max.y - this.box.min.y) * Math.random()
    this.position.z = this.box.min.z + (this.box.max.z - this.box.min.z) * Math.random()
  }

  trigger() {
    const self = this
    this.tween = new TWEEN.Tween(this.material.uniforms.u_CompletionOffset)
      .to({value: 1}, 700)
      .easing(TWEEN.Easing.Quintic.Out)
      .onComplete(function() {
        this.tween = null
        self.dispatchEvent({
          type: 'TriggerAnimationComplete'
        })
      })
      .start()
  }

  spawn() {
    this.randomize(this.room)
    this.material.uniforms.u_CompletionOffset.value = 1
    var self = this
    this.tween = new TWEEN.Tween(this.material.uniforms.u_CompletionOffset)
      .to({value: 0}, 700)
      .easing(TWEEN.Easing.Quintic.Out)
      .onComplete(function() {
        this.tween = null
        self.dispatchEvent({
          type: 'SpawnAnimationComplete'
        })
      })
      .start()
  }

  update(t) {
    this.material.uniforms.u_Time.value = t
  }
}

module.exports = Target
