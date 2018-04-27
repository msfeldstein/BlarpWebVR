require('./TrailRenderer')

class BallTrail extends THREE.Object3D {
  constructor() {
    super()
    var trailHeadGeometry = [];
    trailHeadGeometry.push( 
      new THREE.Vector3( -.10, 0.0, 0.0 ), 
      new THREE.Vector3( 0.0, 0.0, 0.0 ), 
      new THREE.Vector3( .10, 0.0, 0.0 ) 
    );

    var trail = new THREE.TrailRenderer( false );
    this.trail = trail
    // create material for the trail renderer
    var trailMaterial = THREE.TrailRenderer.createBaseMaterial(); 

    // specify length of trail
    var trailLength = 50;

    // initialize the trail
    trail.initialize( trailMaterial, trailLength, false, 0, trailHeadGeometry, this );

     trailMaterial.uniforms.headColor.value.set( 1, 1, 1, 1 );
     trailMaterial.uniforms.tailColor.value.set( 1, 1, 1, 1 );
     trail.activate();
     this.add(trail.mesh)
     trail.mesh.frustumCulled = false
  }

  update() {
    this.trail.advance()
  }
}

module.exports = BallTrail