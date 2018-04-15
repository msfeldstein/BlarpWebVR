module.exports = function(scene, renderer) {
  if (!navigator.getVRDisplays || !navigator.getGamepads) {
    throw "VR Controllers not supported"
  }

  let leftController = null
  let rightController = null

  navigator.getVRDisplays().then(displays => {
    console.log(displays)
  })

  window.addEventListener('gamepadconnected', e => {
    console.log(e)
    leftController = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.1, .1, .1),
      new THREE.MeshBasicMaterial()
    )
    scene.add(leftController)
  })

  function update() {
    const gamepads = navigator.getGamepads()
    if (leftController && gamepads[0]) {
      const pose = gamepads[0].pose
      if (!pose.position || !pose.orientation) return
      leftController.quaternion.fromArray(pose.orientation)
      leftController.position.fromArray(pose.position)
      leftController.matrix.compose(leftController.position, leftController.quaternion, leftController.scale)
      leftController.matrix.premultiply(renderer.vr.getStandingMatrix())
      leftController.matrixWorldNeedsUpdate = true
    }
  }
  return {
    update
  }
}
