window.THREE = require('three')
window.TWEEN = require('@tweenjs/tween.js')
const GuideLine = require('./GuideLine')
const Ball = require('./Ball')
const Controller = require('./mocks/Controller')
const Wand = require('./Wand')
const Target = require('./Target')
const Room = require('./Room')
const ControlKit = require('controlkit')

const zero = new THREE.Vector3

const controlValues = {
  triggerValue: 0,
  triggerRange: [0, 1],
  axes: [0, -.3]

}
const control = new ControlKit()
control.addPanel({
  fixed: false
})
.addGroup()
.addSlider(controlValues, 'triggerValue', 'triggerRange')
.addPad(controlValues, 'axes')
const gameObjects = []
const clock = new THREE.Clock()
const renderer = new THREE.WebGLRenderer({})
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)
document.body.style.margin = 0
renderer.setSize(window.innerWidth, window.innerHeight)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10)
scene.add(camera)
camera.position.z = 2
camera.position.y = 1
camera.lookAt(new THREE.Vector3)
scene.add(new THREE.HemisphereLight(0x606060, 0x404040))


const ball = new Ball(scene)
ball.position.x = -1.5

scene.add(ball)
gameObjects.push(ball)



function animate() {
  renderer.animate(render)
}

function render(at) {
  const t = clock.getElapsedTime()
  // camera.position.z = Math.sin(t / 4) * 2
  // camera.position.x = Math.cos(t / 4) * 2
  ball.position.x = Math.cos(t) * 2
  ball.position.y = Math.cos(10 + t * 1.1) *2
  ball.position.z = Math.cos(Math.PI + t * 1.2) - 2
  camera.lookAt(zero)
  TWEEN.update(at)
  gameObjects.forEach(g => g.update(t))
  renderer.render(scene, camera)
}

window.addEventListener('keydown', _ => {
})


animate()
