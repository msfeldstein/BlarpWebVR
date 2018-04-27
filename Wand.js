
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
  float alpha = sin(v_PointNumber * 20.0 + u_Time);
  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
`


class Wand extends THREE.Object3D {
  constructor(controller) {
    super()
    this.controller = controller
    this.rings = []
    for (var r = 0.05; r < 0.15; r += 0.05) {
      const mesh = new THREE.Mesh(
        new THREE.TorusBufferGeometry(r, 0.003, 16, 100),
        new THREE.MeshBasicMaterial({color: 0xff0000})
      )
      mesh.rotSpeedX = 1 + Math.random() * 0.5
      mesh.rotSpeedY = 1 + Math.random() * 0.5
      mesh.rotSpeedZ = 1 + Math.random() * 0.5
      this.rings.push(mesh)
      this.add(mesh)
    }
    controller.add(this)
    this.createLines()
    this.attraction = 0
    this.worldPosTmp = new THREE.Vector3()
  }

  initPhysics(world) {
    this.body = world.add({
      type: 'sphere',
      size: [0.2, 0.2, 0.2],
      pos: [0, 0, 0],
      move: false,
      belongsTo: 2,
      collidesWith: 0xffffffff
    })
  }

  createLines() {
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
        u_TriggerValue: { type: 'f', value: 1 }
      }
    })
    const line = new THREE.Line(geometry, material)
    this.controller.add(line)
    this.line = line
  }

  updateLines(t) {
    const positions = this.line.geometry.attributes.position.array
    positions[5] = this.position.z
    this.line.geometry.attributes.position.needsUpdate = true
    this.line.material.uniforms.u_Time.value = t
  }

  update(t) {
    this.position.z = this.controller.padY * 2
    console.log(this.position)
    if (this.body) this.body.setPosition(this.getworldPosTmp(this.worldPosTmp))
    this.updateLines(t)
    this.attraction = this.controller.TriggerLevel
    const speed = 0.01 + this.controller.TriggerLevel * 0.1 || 0
    console.log("Speed", speed)
    this.rings.forEach(ring => {
      ring.rotation.x += ring.rotSpeedX * speed
      ring.rotation.y += ring.rotSpeedY * speed
      ring.rotation.z += ring.rotSpeedZ * speed
    })
  }
}

module.exports = Wand
