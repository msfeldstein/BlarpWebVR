const PlasmaMaterial = require('../materials/Plasma')
const ControllerModel = require('../models/ControllerModel')
class MockController extends THREE.Object3D {
  constructor() {
    super()
    this.triggerValue = 0
    this.add(new ControllerModel())
    this.axes = [0, 0]
    this.rotation.x = Math.PI / 2
    this.padX = 0
    this.padY = 0
  }
  getAxes() {
    return this.axes
  }

  setTriggerValue(v) {
    this.triggerValue = v
  }

  setAxes(axes) {
    this.axes = axes
  }

  getButtonValue() {
    return this.triggerValue
  }
}

module.exports = MockController
