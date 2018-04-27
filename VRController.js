const EE = require('eventemitter3')
const extend = require('./util/extend')

class VRController extends THREE.Object3D {
	// id should become: hand is string left, right, or undefined to just grab the next controller
	constructor(standingMatrix, id) {
		super()
		extend(this, new EE)
		this.standingMatrix = standingMatrix
		this.controllerId = id
		this.connected = false
	}

	update() {
		const gamepads = navigator.getGamepads()
		if (this.controllerId === 'left' || this.controllerId === 'right') {
			const found = gamepads.find(gp => gp.hand === this.controllerId || gp.id.toLowerCase().indexOf(this.controllerId) != -1)
			if (found) {
				this.controllerId = gamepads.indexOf(found)
			}
		}
		const gp = gamepads[this.controllerId]
		if (gp && gp.pose) {
			this.visible = true
			if (!this.connected) {
				this.emit(VRController.Connected)
			}

			const pose = gp.pose
			this.updatePose(gp.pose)
			this.updateButtons(gp.buttons)
			this.padX = gp.axes[0]
			this.padY = gp.axes[1]
		} else {
			this.visible = false
			if (this.connected) {
				this.emit(VRController.Disconnected)
			}
		}
		this.connected = !!gp
	}

	updatePose(pose) {
		if (pose.position && pose.orientation) {
			this.tracked = true
			this.position.fromArray( pose.position );
			this.quaternion.fromArray( pose.orientation );
			this.matrix.compose( this.position, this.quaternion, this.scale );
			this.matrix.premultiply( this.standingMatrix);
			this.matrixWorldNeedsUpdate = true;
		}
	}

	updateButtons(buttons) {
		const joypadButton = buttons[0]
		const trigger = buttons[1]
		const grip = buttons[2]
		const aButton = buttons[3]
		const bButton = buttons[4]

		this.setButtonValue(VRController.TriggerLevel, trigger.value)
		this.setButtonValue(VRController.GripLevel, grip.value)
		this.setButtonValue(VRController.ButtonAPressed, aButton.pressed)
		this.setButtonValue(VRController.ButtonBPressed, bButton.pressed)
	}

	setButtonValue(name, value) {
		if (this[name] != value) {
			this.emit(name, value)
		}
		this[name] = value
	}

	bindButton (eventOnKey, eventOffKey, button, type) {
    var propertyName = eventOnKey[0].toLowerCase() + eventOnKey.substring(1)
    var wasActive = this[propertyName]
    this[propertyName] = button[type]
    if (!wasActive && button[type]) {
      this.emit(eventOnKey)
    } else if (wasActive && !button[type]) {
      this.emit(eventOffKey)
    }
	}
}

VRController.TriggerClicked = "TriggerClicked"
VRController.TriggerUnclicked = "TriggerUnclicked"
VRController.TriggerLevel = "TriggerLevel"
VRController.Gripped = "Gripped"
VRController.Ungripped = "Ungripped"
VRController.GripLevel = "GripLevel"
VRController.Connected = "Connected"
VRController.Disconnected = "Disconnected"
VRController.ThumbstickMove = "ThumbstickMove"
VRController.ButtonAPressed = "ButtonAPressed"
VRController.ButtonBPressed = "ButtonBPressed"

module.exports = VRController
