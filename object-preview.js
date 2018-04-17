window.THREE = require('three')
window.TWEEN = require('@tweenjs/tween.js')
const GuideLine = require('./GuideLine')
const Ball = require('./Ball')
const Controller = require('./mocks/Controller')
const Wand = require('./Wand')
const Target = require('./Target')
const ControlKit = require('controlkit')

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
scene.add(new THREE.HemisphereLight(0x606060, 0x404040))

const ball = new Ball()
ball.position.x = -1.5

const controller = new Controller()
const wand = new Wand(controller)
controller.position.x = 1.5
gameObjects.push(wand)

scene.add(ball, controller)

const guide = new GuideLine(ball, wand)
scene.add(guide)
gameObjects.push(guide)


const target = new Target()
scene.add(target)
gameObjects.push(target)
target.position.y = 0.5

function animate() {
  renderer.animate(render)
}

function render(at) {
  const t = clock.getElapsedTime()
  TWEEN.update(at)
  controller.setTriggerValue(controlValues.triggerValue)
  controller.setAxes(controlValues.axes)
  gameObjects.forEach(g => g.update(t))
  renderer.render(scene, camera)
}

window.addEventListener('keydown', _ => {
  target.trigger()
})


animate()
