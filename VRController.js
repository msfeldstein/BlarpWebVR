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
			const found = gamepads.find(gp => gp.id.toLowerCase().indexOf(this.controllerId) != -1)
			if (found) {
				console.log("Found gamepad", found)
				this.controllerId = gamepads.indexOf(found)
			}
		}
		const gp = gamepads[this.controllerId]
		if (gp && gp.pose) {
			this.visible = true
			if (!this.connected) {
				console.log(gp.id, "Connected")
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
			this.matrix.premultiply( this.standingMatrix );
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

// /**
//  * @author mrdoob / http://mrdoob.com
//  * @author stewdio / http://stewd.io
//  */
//
// THREE.VRController = function ( id ) {
//
// 	THREE.Object3D.call( this );
//
// 	var scope = this;
// 	var gamepad;
//
// 	var axes = [ 0, 0 ];
// 	var thumbpadIsPressed = false;
// 	var triggerIsPressed = false;
// 	var gripsArePressed = false;
// 	var menuIsPressed = false;
//   var triggerValue = 0.0
//
// 	function findGamepad( id ) {
//
// 		// Iterate across gamepads as Vive Controllers may not be
// 		// in position 0 and 1.
//
// 		var gamepads = navigator.getGamepads && navigator.getGamepads();
//
// 		for ( var i = 0, j = 0; i < gamepads.length; i ++ ) {
//
// 			var gamepad = gamepads[ i ];
//
// 			if ( gamepad && ( gamepad.id === 'OpenVR Gamepad' || gamepad.id.startsWith( 'Oculus Touch' ) || gamepad.id.startsWith( 'Spatial Controller' ) ) ) {
//
// 				if ( j === id ) return gamepad;
//
// 				j ++;
//
// 			}
//
// 		}
//
// 	}
//
// 	this.matrixAutoUpdate = false;
// 	this.standingMatrix = new THREE.Matrix4();
//
// 	this.getGamepad = function () {
//
// 		return gamepad;
//
// 	};
//
// 	this.getButtonState = function ( button ) {
//
// 		if ( button === 'thumbpad' ) return thumbpadIsPressed;
// 		if ( button === 'trigger' ) return triggerIsPressed;
// 		if ( button === 'grips' ) return gripsArePressed;
// 		if ( button === 'menu' ) return menuIsPressed;
//
// 	};
//
//   this.getButtonValue = function( buttonName ) {
//     if (buttonName === 'trigger') return triggerValue
//   }
//
// 	this.getAxes = function() {
// 		return axes
// 	}
//
// 	this.update = function () {
//
// 		gamepad = findGamepad( id );
//
// 		if ( gamepad !== undefined && gamepad.pose !== undefined ) {
//
// 			if ( gamepad.pose === null ) return; // No user action yet
//
// 			//  Position and orientation.
//
// 			var pose = gamepad.pose;
//
// 			if ( pose.position !== null ) scope.position.fromArray( pose.position );
// 			if ( pose.orientation !== null ) scope.quaternion.fromArray( pose.orientation );
// 			scope.matrix.compose( scope.position, scope.quaternion, scope.scale );
// 			scope.matrix.premultiply( scope.standingMatrix );
// 			scope.matrixWorldNeedsUpdate = true;
// 			scope.visible = true;
//
// 			//  Thumbpad and Buttons.
//
// 			if ( axes[ 0 ] !== gamepad.axes[ 0 ] || axes[ 1 ] !== gamepad.axes[ 1 ] ) {
//
// 				axes[ 0 ] = gamepad.axes[ 0 ]; //  X axis: -1 = Left, +1 = Right.
// 				axes[ 1 ] = gamepad.axes[ 1 ]; //  Y axis: -1 = Bottom, +1 = Top.
// 				scope.dispatchEvent( { type: 'axischanged', axes: axes } );
//
// 			}
//
// 			if ( thumbpadIsPressed !== gamepad.buttons[ 0 ].pressed ) {
//
// 				thumbpadIsPressed = gamepad.buttons[ 0 ].pressed;
// 				scope.dispatchEvent( { type: thumbpadIsPressed ? 'thumbpaddown' : 'thumbpadup', axes: axes } );
//
// 			}
//
// 			if ( triggerIsPressed !== gamepad.buttons[ 1 ].pressed ) {
// 				triggerIsPressed = gamepad.buttons[ 1 ].pressed;
// 				scope.dispatchEvent( { type: triggerIsPressed ? 'triggerdown' : 'triggerup' } );
// 			}
//       triggerValue = gamepad.buttons[1].value
//
// 			if ( gripsArePressed !== gamepad.buttons[ 2 ].pressed ) {
//
// 				gripsArePressed = gamepad.buttons[ 2 ].pressed;
// 				scope.dispatchEvent( { type: gripsArePressed ? 'gripsdown' : 'gripsup' } );
//
// 			}
//
// 			if ( menuIsPressed !== gamepad.buttons[ 3 ].pressed ) {
//
// 				menuIsPressed = gamepad.buttons[ 3 ].pressed;
// 				scope.dispatchEvent( { type: menuIsPressed ? 'menudown' : 'menuup' } );
//
// 			}
//
// 		} else {
//
// 			scope.visible = false;
//
// 		}
//
// 	};
//
// };
//
// THREE.VRController.prototype = Object.create( THREE.Object3D.prototype );
// THREE.VRController.prototype.constructor = THREE.VRController;
