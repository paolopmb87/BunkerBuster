(function(){
  var fps=document.createElement('fps');
  fps.onload=function (){
    var wp = new Stats();
    document.body.appendChild(wp.dom);
    requestAnimationFrame(function loop() {
      wp.update();
      requestAnimationFrame(loop)
    });
  };
  fps.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
  document.head.appendChild(fps);
})()

//THREEJS VAR

var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var keyboard = new THREEx.KeyboardState();
var controls;
var sun;
var stats;
var ground;
var orbitControl;
var tank;
var clock = new THREE.Clock()
var delta = 1;  //movement
var TANK_LOADED = false;
var NUM_LOADED = 0;
var VIEW_ANGLE = 90, NEAR = 0.1, FAR = 1000;
var mouse ={ x: 0, y: 0 };


function init() {
  // set up the scene
  createScene();
  // CONTROLS
  controls = new THREE.OrbitControls( camera, renderer.domElement );

  // STATS
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 100;
  dom.appendChild(stats.domElement);
  dom.addEventListener( 'mousemove', onDocumentMouseMove, false );


}

function createScene(){
  scene = new THREE.Scene();//the 3d scene

  sceneWidth=window.innerWidth;
  console.log(sceneWidth)
  sceneHeight=window.innerHeight;
  //scene.fog = new THREE.Fog(0x00ff00, 50, 800);//enable fog
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE , sceneWidth / sceneHeight, NEAR, FAR );//perspective camera
  scene.add(camera);
  camera.lookAt(scene.position);
  renderer = new THREE.WebGLRenderer({alpha:true});//renderer with transparent backdrop
  renderer.shadowMap.enabled = true;//enable shadow
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize( sceneWidth, sceneHeight );
  // dom = document.getElementById('start_game');
  dom = document.getElementById('game_ifrm')
    .contentWindow
    .document
    .getElementById('cicciopiccio');
  dom.appendChild(renderer.domElement);
  //width, height, widthSegments, heightSegments

  var floorTexture = new THREE.ImageUtils.loadTexture( 'img/rocky-ground.jpg' );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set( 15, 15 );

  var planeGeometry = new THREE.PlaneGeometry( 1000, 1000, 10, 10 );
  var planeMaterial = new THREE.MeshLambertMaterial( {
    map: floorTexture,
    side: THREE.DoubleSide
  } );
  ground = new THREE.Mesh( planeGeometry, planeMaterial );
  ground.receiveShadow = true;
  ground.position.y = -0.5;
  ground.rotation.x=Math.PI/2;
  scene.add( ground );

  camera.position.set(0,250,0);

  var sun = new THREE.PointLight( 0xffffff, 1,1000 ,2 );
  sun.position.set(200,200,200);
  sun.shadowCameraVisible=true;
  sun.castShadow = true;
  //sun.shadowDarkness = 0.95;
  scene.add(sun);
  //Set up shadow properties for the sun light
  sun.shadow.mapSize.width = 1024;
  sun.shadow.mapSize.height = 1024;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 4000 ;

  orbitControl = new THREE.OrbitControls( camera, renderer.domElement );//helper to rotate around in scene
  orbitControl.addEventListener( 'change', render );
  orbitControl.enableDamping = true;
  orbitControl.dampingFactor = 0.8;
  orbitControl.enableZoom = false;




/*  var helper = new THREE.CameraHelper( sun.shadow.camera );
  scene.add( helper );// enable to see the light cone*/

  window.addEventListener('resize', onWindowResize, false);//resize callback
}

function animate()
{
  requestAnimationFrame( animate );
  render();
  update();
}

function update(){
  var delta = clock.getDelta(); // seconds.
  var moveDistance = 25 * delta; // 200 pixels per second
  var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second


  if ( keyboard.pressed("W") )
    tank.translateZ( moveDistance );
  if ( keyboard.pressed("S") )
    tank.translateZ(  -moveDistance );
  if ( keyboard.pressed("A") )
    tank.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
  if ( keyboard.pressed("D") )
    tank.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
  if ( keyboard.pressed("Q") )
    Turret_2.rotateOnAxis( new THREE.Vector3(0,0,1), rotateAngle);
  if ( keyboard.pressed("E") )
    Turret_2.rotateOnAxis( new THREE.Vector3(0,0,1), -rotateAngle);
  // rotate left/right/up/down
  var rotation_matrix = new THREE.Matrix4().identity();

 /* if ( keyboard.pressed("R") )
    MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
  if ( keyboard.pressed("F") )
    MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);

  if ( keyboard.pressed("Z") )
  {
    MovingCube.position.set(0,25.1,0);
    MovingCube.rotation.set(0,0,0);
  }

  // global coordinates
  if ( keyboard.pressed("left") )
    MovingCube.position.x -= moveDistance;
  if ( keyboard.pressed("right") )
    MovingCube.position.x += moveDistance;
  if ( keyboard.pressed("up") )
    MovingCube.position.z -= moveDistance;
  if ( keyboard.pressed("down") )
    MovingCube.position.z += moveDistance;*/

   controls.update();
   stats.update();
};

function render(){
  //requestAnimationFrame(update);
  renderer.render(scene, camera);//draw

}
function onWindowResize() {
  //resize & align
  sceneHeight = window.innerHeight;
  sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth/sceneHeight;
  camera.updateProjectionMatrix();
}

function start_game() {
  document.getElementById("playBTN").style.display='none';
  document.getElementById("start_game").style.display='block';
  document.getElementById("game_ifrm").style.display='block';
  init();
  animate();
  addTank();
}

function onDocumentMouseMove(e) {
  e.preventDefault();
  mouse.x = (e.clientX / sceneWidth) * 2 - 1;
  mouse.y = - (e.clientY / sceneHeight) * 2 + 1;
}

/*
// movement
document.addEventListener("keydown", move, false);
document.addEventListener("keydown", rotturret, false);
function move(event){
  var keyCode = event.which;
  if (keyCode == 87) {    //W
    tank.translateZ( 0.1 );
  } else if (keyCode == 83) {  //S
    tank.translateZ( -0.1 );
  } else if (keyCode == 65) {  //A
    tank.rotation.y += 0.1;
  } else if (keyCode == 68) {   //D
    tank.rotation.y -= 0.1;
  } else if (keyCode == 32) {
    tank.position.set(0, 0, 0);
  }

};


function rotturret(event){
  var keyCode= event.which;
  if(keyCode == 81){   //Q
    Turret_2.rotation.z +=0.1;
  } else if (keyCode == 69){  //E
    Turret_2.rotation.z -= 0.1;
  }
}
*/
function addTank(){
  var loader = new THREE.ObjectLoader();
  loader.load("models/tank/tank.json",
    function (obj){
      tank = obj;
      TANK_LOADED = true;
      NUM_LOADED++;

      tank.scale.set(4.5, 4.5, 4.5);
      camera.add(tank);
      tank.castShadow = true;
      scene.add(tank);


      Body_1 = scene.getObjectByName('Body_1');
      Body_2 = scene.getObjectByName('Body_2');
      Track = scene.getObjectByName('Track');
      Turret = scene.getObjectByName('Turret');
      Turret_2 = scene.getObjectByName('Turret_2');




    },
    // onProgress callback
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    // onError callback
    function (err) {
      console.error('An error happened');
      TANK_LOADED = false;
    });
}



