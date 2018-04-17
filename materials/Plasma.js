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
  vec3 restColor = vec3(1.0);
  vec3 winColor = vec3(57.0 / 255.0, 255.0 / 255.0, 20.0 / 255.0);
  vec3 color = mix(restColor, winColor, u_CompletionOffset);
  float n = 1.0 - 2.0 * abs(cnoise(vec4(v_Position * 3.0, u_Time)));
  gl_FragColor = vec4(color, n * (1.0 - u_CompletionOffset));
}
`

class PlasmaMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader, fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: {
        u_Time: { type: 'f', value: 0},
        u_CompletionOffset: { type: 'f', value: 0}
      }
    })
  }
}

module.exports = PlasmaMaterial