
const vertexShader = `
attribute float pointNumber;
varying float v_PointNumber;

void main() {
  v_PointNumber = pointNumber;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

`

const fragmentShader = `
varying float v_PointNumber;
uniform float u_Time;
uniform float u_TriggerValue;


void main() {
  float rest = fract(1.0 - v_PointNumber * 10.0 - u_Time);
  float active = fract(v_PointNumber * 10.0 - 4.0 * u_Time);

  vec3 restColor = vec3(0.3);
  vec3 activeColor = vec3(1.0, 0.0, 0.0);
  vec3 color = mix(restColor, activeColor, u_TriggerValue);
  float alpha = mix(rest, active, u_TriggerValue);
  gl_FragColor = vec4(color, alpha);
}
`

class GuideLine extends THREE.Line {
  constructor(ball, wand) {
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([0, 0, 0, 0, 0, 0])
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const ptnums = new Float32Array([0, 1])
    geometry.addAttribute('pointNumber', new THREE.BufferAttribute(ptnums, 1))
    const material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      transparent: true,
      uniforms: {
        u_Time: { type: 'f', value: 0 },
        u_TriggerValue: { type: 'f', value: 0 }
      }
    })
    super(
      geometry, material
    )
    this.ball = ball
    this.wand = wand
    this.frustumCulled = false
    this.tmpV = new THREE.Vector3()
  }

  update(t) {
    const positions = this.geometry.attributes.position.array
    this.ball.getWorldPosition(this.tmpV)
    positions[0] = this.tmpV.x
    positions[1] = this.tmpV.y
    positions[2] = this.tmpV.z
    this.wand.getWorldPosition(this.tmpV)
    positions[3] = this.tmpV.x
    positions[4] = this.tmpV.y
    positions[5] = this.tmpV.z
    this.geometry.attributes.position.needsUpdate = true
    this.material.uniforms.u_Time.value = t
    this.material.uniforms.u_TriggerValue.value = this.wand.attraction
  }
}

module.exports = GuideLine
