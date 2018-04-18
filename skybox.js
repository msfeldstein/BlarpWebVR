module.exports = function() {
  return new THREE.CubeTextureLoader()
  .setPath('/assets/skybox/')
  .load([
     'leftImage.png',
     'rightImage.png',
     'upImage.png',
     'downImage.png',
     'frontImage.png',
     'backImage.png'
  ])
}
