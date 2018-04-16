const vertexShader = `

varying vec3 v_Position;
uniform float u_CompletionOffset;
uniform float u_Time;

void main() {
  v_Position = position + position * u_CompletionOffset;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(v_Position, 1.0);
}

`

const fragmentShader = `
varying vec3 v_Position;
uniform float u_Time;
uniform float u_CompletionOffset;

${require('./noise4.glsl')}


void main() {
  float n = 1.0 - 2.0 * abs(cnoise(vec4(v_Position * 3.0, u_Time)));
  gl_FragColor = vec4(1.0, 1.0, 1.0, n * (1.0 - u_CompletionOffset));
}
`

class Target extends THREE.Mesh {
  constructor(room) {
    super(
      new THREE.SphereBufferGeometry(0.3, 24, 16),
      new THREE.ShaderMaterial({
        vertexShader, fragmentShader,
        transparent: true,
        uniforms: {
          u_Time: { type: 'f', value: 0},
          u_CompletionOffset: { type: 'f', value: 0}
        },
      })
    )
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
