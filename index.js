window.THREE = require('three')
window.TWEEN = require('@tweenjs/tween.js')
window.OIMO = require('oimo')

const VRController = require('./VRController')
const WEBVR = require('./WEBVR')
const Ball = require('./Ball')
const Wand = require('./Wand')
const Target = require('./Target')
const Colliders = require('./Colliders')
const GuideLine = require('./GuideLine')
const ControllerModel = require('./models/ControllerModel')
const GameState = require('./GameState')

const state = new GameState()
const world = new OIMO.World({
  timestep: 1 / 90,
  iterations: 8,
  broadphase: 2,
  worldscale: 1,
  gravity: [0, 0, 0]
})
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
controller2.add(new ControllerModel())

gameObjects.push(controller1)
gameObjects.push(controller2)
const wand = new Wand(controller2)
colliders.addSphericalCollider(wand)
gameObjects.push(wand)

spawnNewBall(new THREE.Vector3(0, 0, 3))

state.target = new Target(room)
scene.add(state.target)
state.target.spawn(room)
gameObjects.push(state.target)
colliders.addSphericalCollider(state.target, 0.3)
state.target.addEventListener(Colliders.CollideEvent, e => {
  if (e.other instanceof Ball) {
    state.target.trigger()
  }
})

state.target.addEventListener('TriggerAnimationComplete', _ => {
  console.log("SPawn")
  state.target.spawn()
  spawnNewBall(state.target.getWorldPosition())
})

wand.addEventListener(Colliders.CollideEvent, e => {
  console.log("HIT", e.other)
  if (e.other instanceof Ball) {
    console.log("GOT THAT BALL")
    gameOver()
  }
})

document.body.appendChild(WEBVR.createButton(renderer))

function animate() {
  renderer.animate(render)
}

function render(at) {
  state.balls.forEach(b => b.attract(controller2, wand))
  const t = clock.getElapsedTime()
  TWEEN.update()
  gameObjects.forEach(g => g.update(t))
  colliders.update()
  renderer.render(scene, camera)
}

animate()

function spawnNewBall(position) {
  if (state.balls.length > 10) return
  const ball = new Ball(room, controller1)
  scene.add(ball)
  gameObjects.push(ball)
  ball.position.copy(position)
  colliders.addSphericalCollider(ball, ball.radius)
  state.balls.push(ball)

  const guide = new GuideLine(ball, wand)
  scene.add(guide)
  gameObjects.push(guide)
}

function gameOver() {

}
