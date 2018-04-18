window.THREE = require('three')
window.TWEEN = require('@tweenjs/tween.js')
window.OIMO = require('oimo')

const VRController = require('./VRController')
const WEBVR = require('./WEBVR')
const Ball = require('./Ball')
const Wand = require('./Wand')
const Room = require('./Room')
const Target = require('./Target')
const Colliders = require('./Colliders')
const GuideLine = require('./GuideLine')
const ControllerModel = require('./models/ControllerModel')
const GameState = require('./GameState')
const SkyboxTexture = require('./skybox')
const RestartButton = require('./RestartButton')

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
renderer.setClearColor(0xffca3a)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)
document.body.style.margin = 0
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.vr.enabled = true
const clock = new THREE.Clock()
const scene = new THREE.Scene()
scene.background = new SkyboxTexture()
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 20)
scene.add(camera)
const room = new Room(6)
room.initPhysics(world)
room.geometry.computeBoundingBox()
room.position.y = 3
scene.add(room)
scene.add(new THREE.HemisphereLight(0x606060, 0x404040))

const controller1 = new VRController(renderer.vr.getStandingMatrix(), 'left')
scene.add(controller1)
const controller2 = new VRController(renderer.vr.getStandingMatrix(), 'right')
scene.add(controller2)
controller2.add(new ControllerModel())
state.primaryController = controller2

gameObjects.push(controller1)
gameObjects.push(controller2)
const wand = new Wand(controller2)
colliders.addSphericalCollider(wand)
gameObjects.push(wand)
wand.initPhysics(world)

spawnNewBall(new THREE.Vector3(0, 1, -2))

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
  spawnNewBall(state.target.getWorldPosition())
  state.target.spawn()

})

wand.addEventListener(Colliders.CollideEvent, e => {
  if (e.other instanceof Ball) {
    gameOver(e.other)
  }
})

document.body.appendChild(WEBVR.createButton(renderer))

function animate() {
  renderer.animate(render)
}

function render(at) {
  state.balls.forEach(b => b.attract(controller2, wand))
  world.step()
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
  ball.initPhysics(world, position)
  scene.add(ball)
  gameObjects.push(ball)
  ball.position.copy(position)
  colliders.addSphericalCollider(ball, ball.radius)
  state.balls.push(ball)

  const guide = new GuideLine(ball, wand)
  scene.add(guide)
  gameObjects.push(guide)
}

function gameOver(deadball) {
  room.shatter()
  state.balls.forEach(b => {
    if (b == deadball) {
      b.die()
    } else {
      b.disappear()
    }
  })
}
