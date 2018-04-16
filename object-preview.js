window.THREE = require('three')
window.TWEEN = require('@tweenjs/tween.js')
const GuideLine = require('./GuideLine')

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
scene.add(new THREE.HemisphereLight(0x606060, 0x404040))

const ball = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.2)
)
ball.position.x = -1.5

const controller = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.2)
)
controller.position.x = 1.5

scene.add(ball, controller)

const guide = new GuideLine(ball, controller)
scene.add(guide)
gameObjects.push(guide)
function animate() {
  renderer.animate(render)
}

function render(at) {
  const t = clock.getElapsedTime()
  TWEEN.update(at)
  gameObjects.forEach(g => g.update(t))
  renderer.render(scene, camera)
}

window.addEventListener('keydown', _ => {
  target.trigger()
})


animate()
