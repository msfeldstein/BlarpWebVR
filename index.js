window.THREE = require('three')
const VRController = require('./VRController')
const WEBVR = require('./WEBVR')
const Ball = require('./Ball')
const Wand = require('./Wand')
const Target = require('./Target')
const Colliders = require('./Colliders')

const gameObjects = []
const colliders = new Colliders()

const renderer = new THREE.WebGLRenderer({})
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)
document.body.style.margin = 0
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.vr.enabled = true
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
gameObjects.push(new Wand(controller1))
gameObjects.push(new Wand(controller2))

const ball = new Ball(room)
scene.add(ball)
gameObjects.push(ball)
colliders.addSphericalCollider(ball, ball.radius)

const target = new Target()
scene.add(target)
target.spawn(room)
colliders.addSphericalCollider(target, 0.3)
target.addEventListener(Colliders.CollideEvent, e => {
  console.log("TARGET GOT", e.other)
})

document.body.appendChild(WEBVR.createButton(renderer))

function animate() {
  renderer.animate(render)
}

function render() {
  ball.attract(controller1)
  ball.attract(controller2)
  gameObjects.forEach(g => g.update())
  colliders.update()
  renderer.render(scene, camera)
}

animate()
