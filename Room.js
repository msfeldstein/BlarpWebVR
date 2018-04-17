class Room extends THREE.Mesh {
  constructor(size) {
    super(
      new THREE.BoxBufferGeometry(size, size, size, 8, 8, 8),
      new THREE.MeshBasicMaterial({
        color: 0x404040,
        wireframe: true
      })
    )
    this.size = size
  }

  initPhysics(world) {
    world.add({
      size: [this.size, 10, this.size],
      pos: [0, -5, 0],
      density: 1
    })
    world.add({
      size: [this.size, 10, this.size],
      pos: [0, this.size + 5, 0],
      density: 1
    })
    world.add({
      size: [10, this.size, this.size],
      pos: [-this.size / 2 - 5, 0, 0],
      density: 1
    })
    world.add({
      size: [10, this.size, this.size],
      pos: [this.size / 2 + 5, 0, 0],
      density: 1
    })
    world.add({
      size: [this.size, this.size, 10],
      pos: [0, 0, -this.size / 2 - 5],
      density: 1
    })
    world.add({
      size: [this.size, this.size, 10],
      pos: [0, 0, this.size / 2 + 5],
      density: 1
    })
  }
}

module.exports = Room
