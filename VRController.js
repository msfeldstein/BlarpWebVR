const EE = require('eventemitter3')
const extend = require('./util/extend')

/*
Instantiation:

const controller = new VRController(renderer.vr.getStandingMatrix(), 'left')
const controller2 = new VRController(renderer.vr.getStandingMatrix(), 'right')

or

const controller = new VRController(renderer.vr.getStandingMatrix(), 0)
const controller = new VRController(renderer.vr.getStandingMatrix(), 1)

Event callbacks:

controller.on(VRController.TriggerClicked, _ => {
  console.log("Triggered")
})

controller.on(VRController.TriggerUnclicked, _ => {
  console.log("Untriggered")
})

Connected
Disconnected
Gripped
Ungripped
PadTouched
PadUntouched

Check values

const triggerLevel = controller.triggerLevel // float 0.0-1.0
controller.stickX // float -1.0 left to +1.0 right
controller.stickY // float -1.0 Down to +1.0 up
controller.padX // float -1.0 left to +1.0 right
controller.padY // float -1.0 down to +1.0 up

*/
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
				this.type = VRController.TypeMappings[found.id]
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
			this.stickX = gp.axes[0]
			this.stickY = -1.0 * gp.axes[1] // Invert for y Up
			this.padX = gp.axes[2]
			this.padY = -1.0 * gp.axes[3]
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
		const bButtonOrPad = buttons[4]
		this.setButtonValue(VRController.TriggerLevel, trigger.value)
		this.setButtonValue(VRController.GripLevel, grip.value)
		this.setButtonValue(VRController.ButtonAPressed, aButton.pressed)
		this.setButtonValue(VRController.ButtonBPressed, bButtonOrPad.pressed)
		this.bindButton(VRController.TriggerClicked, VRController.TriggerUnclicked, trigger, 'pressed')
		this.bindButton(VRController.Gripped, VRController.Ungripped, grip, 'pressed')
		this.bindButton(VRController.PadTouched, VRController.PadUntouched, bButtonOrPad, 'touched')
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

VRController.WindowsMRType = "WindowsMRType"
VRController.OculusRiftTouchType = "OculusRiftTouchType"
VRController.HTCViveType = "HTCViveType"

VRController.TypeMappings = {
	"Spatial Controller (Spatial Interaction Source)": VRController.WindowsMRType
}

VRController.TriggerClicked = "triggerClicked"
VRController.TriggerUnclicked = "triggerUnclicked"
VRController.TriggerLevel = "triggerLevel"
VRController.Gripped = "gripped"
VRController.Ungripped = "ungripped"
VRController.GripLevel = "gripLevel"
VRController.Connected = "connected"
VRController.Disconnected = "disconnected"
VRController.ButtonAPressed = "buttonAPressed"
VRController.ButtonAReleased = "buttonAReleased"
VRController.ButtonBPressed = "buttonBPressed"
VRController.ButtonBReleased = "buttonBReleased"
VRController.PadTouched = "padTouched"
VRController.PadUntouched = "padUntouched"

module.exports = VRController
