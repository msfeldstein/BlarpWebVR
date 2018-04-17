const context = new AudioContext();

const osc = context.createOscillator()
osc.type = 'sin'
osc.frequency.setValueAtTime(120, context.currentTime)

osc.connect(context.destination)
osc.start()