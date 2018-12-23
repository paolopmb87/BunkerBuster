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
var hero;
var sun;
var ground;
var orbitControl;
var tank;
var delta = 1;  //movement
var TANK_LOADED = false;
var NUM_LOADED = 0;

function init() {
  // set up the scene
  createScene();
  //call game loop
  update();
}

function createScene(){
  scene = new THREE.Scene();//the 3d scene

  sceneWidth=window.innerWidth;
  console.log(sceneWidth)
  sceneHeight=window.innerHeight;
  //scene.fog = new THREE.Fog(0x00ff00, 50, 800);//enable fog
  camera = new THREE.PerspectiveCamera( 45, sceneWidth / sceneHeight, 1, 1000 );//perspective camera
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
  var planeGeometry = new THREE.PlaneGeometry( 700, 700, 7, 7 );
  var planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
  ground = new THREE.Mesh( planeGeometry, planeMaterial );
  ground.receiveShadow = true;
  ground.castShadow=false;
  // ground.rotation.x=-Math.PI/2;
  scene.add( ground );

 // camera.position.z = 60;
  camera.position.y = 45;

  sun = new THREE.DirectionalLight( 0xffffff, 0.8);
  sun.position.set( 0,4,1 );
  sun.castShadow = true;
  scene.add(sun);
  //Set up shadow properties for the sun light
  sun.shadow.mapSize.width = 256;
  sun.shadow.mapSize.height = 256;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 50 ;

  orbitControl = new THREE.OrbitControls( camera, renderer.domElement );//helper to rotate around in scene
  orbitControl.addEventListener( 'change', render );
  orbitControl.enableDamping = true;
  orbitControl.dampingFactor = 0.8;
  orbitControl.enableZoom = false;

  var helper = new THREE.CameraHelper( sun.shadow.camera );
  scene.add( helper );// enable to see the light cone

  window.addEventListener('resize', onWindowResize, false);//resize callback
}

function update(){
  //animate
  // hero.rotation.x += 0.01;
  // hero.rotation.y += 0.01;
  render();
  requestAnimationFrame(update);//request next update
}
function render(){
  //requestAnimationFrame(update);
  renderer.render(scene, camera);//draw
//  move();
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
  addTank();
}


// movement
document.addEventListener("keydown", move, false);
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

function addTank(){
  var loader = new THREE.ObjectLoader();
  loader.load("models/tank/tank.json",
    function (obj){
      tank = obj;
      TANK_LOADED = true;
      NUM_LOADED++;
      // tank.position.x = 0;
      // tank.position.z = 0;
      // tank.position.y = 0;
      tank.scale.set(0.5, 0.5, 0.5);
      tank.scale.x = tank.scale.y = tank.scale.z =0.5;

      // camera.position = tank.position;
      // camera.position.z = 20;
      // camera.position.y = 1;
      // capera.position.x = -20;
      camera.add(tank);
      //tank.rotation.x = 20;

      // tank.rotate.x = 10;
      // tank.position.set(0,0,-5);
      scene.add(obj);

      // scene.add(obj);

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

