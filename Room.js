const Howl = require('howler').Howl
console.log("HOWL", Howl)
const vertexShader = `
attribute vec3 center;
attribute float facenum;
uniform float u_ShatterAmount;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 randVec(float f) {
  return vec3(
    3.14 * fract(sin(f * 310.9090)),
    3.14 * fract(sin(f * 120.9090)),
    3.14 * fract(sin(f * 10.9090))
  );
}

mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

void main() {
  vec4 p = vec4(position - center, 1.0);
  // float t = abs(sin(u_Time));
  float t = u_ShatterAmount;
  vec4 rotated = rotationMatrix(randVec(facenum), t) * p;
  float amt = (center.y + 0.5);
  p = mix(p, rotated, amt);
  vec3 offset = mix(vec3(0.0), center, amt) * t;
  p.xyz += offset;
  p.xyz += center;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p.xyz, 1.0);
}
`

const fragmentShader = `
uniform float u_ShatterAmount;

void main() {
  vec4 reg = vec4(1.0);
  vec4 shattered = vec4(1.0, 0.0, 0.0, 1.0);
  gl_FragColor = mix(reg, shattered, u_ShatterAmount);
}
`

class Room extends THREE.Mesh {
  constructor(size) {
    
    const geom = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4)
    geom.computeFaceNormals()
    const shatterGeom = new THREE.BufferGeometry()
    const positions = []
    const faceNums = []
    const centers = []
    let i = 0
    geom.faces.forEach(f => {

      const pa = geom.vertices[f.a]
      const pb = geom.vertices[f.b]
      const pc = geom.vertices[f.c]
      const cx = (pa.x + pb.x + pc.x) / 3
      const cy = (pa.y + pb.y + pc.y) / 3
      const cz = (pa.z + pb.z + pc.z) / 3

      positions.push(
        pa.x, pa.y, pa.z,
        pb.x, pb.y, pb.z,
        pc.x, pc.y, pc.z,
      )
      faceNums.push(i, i, i)
      i++
      centers.push(
        cx, cy, cz,
        cx, cy, cz,
        cx, cy, cz
      )

    })
    console.log(positions)
    const vtxArray = new Float32Array(positions)
    const faceArray = new Float32Array(faceNums)
    const centerArray = new Float32Array(centers)
    shatterGeom.addAttribute('position', new THREE.BufferAttribute(vtxArray, 3))
    shatterGeom.addAttribute('facenum', new THREE.BufferAttribute(faceArray, 1))
    shatterGeom.addAttribute('center', new THREE.BufferAttribute(centerArray, 3))
    super(
      shatterGeom,
      new THREE.ShaderMaterial({
        vertexShader, fragmentShader,
        wireframe: true,
        side: THREE.DoubleSide,
        uniforms: {
          u_Time: { type: 'f', value: 0 },
          u_ShatterAmount: { type: 'f', value: 0}
        }
      })
    )
    this.scale.set(size, size, size)
    this.size = size
  }

  update(t) {
    this.material.uniforms.u_Time.value = t
  }

  shatter() {
    new Howl({
      src: ['audio/shatter.ogg']
    }).play()
    this.shattered = true
    new TWEEN.Tween(this.material.uniforms.u_ShatterAmount)
      .to({value: 1}, 500)
      .easing(TWEEN.Easing.Quintic.Out)
      .start()
  }

  reset() {
    new Howl({
      src: ['audio/unshatter.ogg']
    }).play()
    this.shattered = false
    new TWEEN.Tween(this.material.uniforms.u_ShatterAmount)
      .to({value: 0}, 500)
      .easing(TWEEN.Easing.Quintic.Out)
      .start()
  }

  initPhysics(world) {
    world.add({
      size: [this.size, 10, this.size],
      pos: [0, -5, 0],
      density: 1
    })
    world.add({
      size: [this.size, 10, this.size],
      pos: [0, this.size + 5, 0],
      density: 1
    })
    world.add({
      size: [10, this.size, this.size],
      pos: [-this.size / 2 - 5, 0, 0],
      density: 1
    })
    world.add({
      size: [10, this.size, this.size],
      pos: [this.size / 2 + 5, 0, 0],
      density: 1
    })
    world.add({
      size: [this.size, this.size, 10],
      pos: [0, 0, -this.size / 2 - 5],
      density: 1
    })
    world.add({
      size: [this.size, this.size, 10],
      pos: [0, 0, this.size / 2 + 5],
      density: 1
    })
  }
}

module.exports = Room
