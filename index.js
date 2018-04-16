window.THREE = require('three')
window.TWEEN = require('@tweenjs/tween.js')

const VRController = require('./VRController')
const WEBVR = require('./WEBVR')
const Ball = require('./Ball')
const Wand = require('./Wand')
const Target = require('./Target')
const Colliders = require('./Colliders')
const GuideLine = require('./GuideLine')

const gameObjects = []
const colliders = new Colliders()

const renderer = new THREE.WebGLRenderer({})
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)
document.body.style.margin = 0
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.vr.enabled = true
const clock = new THREE.Clock()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10)
scene.add(camera)
const room = new THREE.Mesh(
  new THREE.BoxBufferGeometry(6, 6, 6, 8, 8, 8),
  new THREE.MeshBasicMaterial({
    color: 0x404040,
    wireframe: true
  })
)
room.geometry.computeBoundingBox()
room.position.y = 3
scene.add(room)
scene.add(new THREE.HemisphereLight(0x606060, 0x404040))

const controller1 = new THREE.VRController(0)
controller1.standingMatrix = renderer.vr.getStandingMatrix()
scene.add(controller1)

const controller2 = new THREE.VRController(1)
controller2.standingMatrix = renderer.vr.getStandingMatrix()
scene.add(controller2)

gameObjects.push(controller1)
gameObjects.push(controller2)
const wand = new Wand(controller2)
gameObjects.push(wand)

const ball = new Ball(room, controller1)
scene.add(ball)
gameObjects.push(ball)
colliders.addSphericalCollider(ball, ball.radius)

const guide = new GuideLine(ball, wand)
scene.add(guide)
gameObjects.push(guide)


const target = new Target(room)
scene.add(target)
target.spawn(room)
gameObjects.push(target)
colliders.addSphericalCollider(target, 0.3)
target.addEventListener(Colliders.CollideEvent, e => {
  console.log("TARGET GOT", e.other)
  target.trigger()
})

target.addEventListener('TriggerAnimationComplete', _ => {
  console.log("SPawn")
  target.spawn()
})

document.body.appendChild(WEBVR.createButton(renderer))

function animate() {
  renderer.animate(render)
}

function render(at) {
  ball.attract(controller2, wand)
  const t = clock.getElapsedTime()
  TWEEN.update()
  gameObjects.forEach(g => g.update(t))
  colliders.update()
  renderer.render(scene, camera)
}

animate()
