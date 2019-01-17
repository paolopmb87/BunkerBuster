/**
 * Fps management
 */
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

/**
 * Management of window size
 */
function onWindowResize() {
  //resize & align
  sceneHeight = window.innerHeight;
  sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth/sceneHeight;
  camera.updateProjectionMatrix();
}

/**
 * Variables declaration
 */

var VIEW_ANGLE = 90, NEAR = 0.1, FAR = 1000;

var camera;
var scene;
var orbitControl;
var sceneWidth;
var sceneHeight;
var renderer;
var light;
var ground;
var rotationMatrix;
var dom;
var keyboard;
var controls;
var stats;

var clock = new THREE.Clock()
var TANK_LOADED = false;
var NUM_LOADED = 0;
var mouse ={ x: 0, y: 0 };
var delta;

/**
 * Variables for player tank
 */
var bullets=[];

var mesh;
var tank;
var Body_1;
var Body_2;
var Track;
var Turret;
var Turret_2;

/**
 * Function to start game with the play button
 */
function start_game() {
  document.getElementById("playBTN").style.display='none';
  document.getElementById("start_game").style.display='block';
  document.getElementById("game_ifrm").style.display='block';
  init();
  animate();
  addTank();
}

function init() {
  // set up the scene
  createScene();
  // CONTROLS
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enabled = false;
  // STATS
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 100;
  dom.appendChild(stats.domElement);
  dom.addEventListener( 'mousemove', onDocumentMouseMove, false );
}

/**
 * This function is to generate the scene light, shadow, ground
 */
function createScene(){
  scene = new THREE.Scene();//the 3d scene

  sceneWidth=window.innerWidth;
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
    .getElementById('gameFrame');
  dom.appendChild(renderer.domElement);

  const groundTexture = new THREE.ImageUtils.loadTexture( 'img/rocky-ground.jpg' );
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set( 15, 15 );

  const groundGeometry = new THREE.PlaneGeometry( 1000, 1000, 10, 10 );
  const groundMaterial = new THREE.MeshLambertMaterial( {
    map: groundTexture,
    side: THREE.DoubleSide
  } );
  ground = new THREE.Mesh( groundGeometry, groundMaterial );
  ground.receiveShadow = true;
  ground.position.y = -0.5;
  ground.rotation.x = Math.PI/2;
  scene.add( ground );

  camera.position.set(0,250,0);

  light = new THREE.PointLight( 0xffffff, 1,1000 ,2 );
  light.position.set(200,200,200);
  light.shadowCameraVisible=true;
  light.castShadow = true;
  //light.shadowDarkness = 0.95;
  scene.add(light);
  //Set up shadow properties for the light light
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 4000 ;

  orbitControl = new THREE.OrbitControls( camera, renderer.domElement );//helper to rotate around in scene
  //orbitControl.addEventListener( 'change', render );
  orbitControl.enableDamping = true;
  orbitControl.dampingFactor = 0.8;
  orbitControl.enableZoom = false;

  const meshGeometry = new THREE.BoxBufferGeometry( 0.1, 0.1, 0.1 );
  const meshMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  mesh = new THREE.Mesh( meshGeometry, meshMaterial );
  scene.add( mesh );

  window.addEventListener('resize', onWindowResize, false);//resize callback
}

/**
 * Tank Mesh added to the scene
 */
function addTank(){
  const loader = new THREE.ObjectLoader();
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

/**
 * KEYBOARD - MOUSE
 */
function update(){
  delta = clock.getDelta(); // seconds.
  keyboard = new THREEx.KeyboardState();

  var moveDistance = 25 * delta; // 200 pixels per second
  var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second

  for(var index=0; index<bullets.length; index+=1){
    if( bullets[index] === undefined ) continue;
    if( bullets[index].alive === false ){
      bullets.splice(index,1);
      continue;
    }
    bullets[index].position.add(bullets[index].velocity);
  }

  if ( keyboard.pressed("W") )
    tank.translateZ( moveDistance );
  if ( keyboard.pressed("S") )
    tank.translateZ(  -moveDistance );
  if ( keyboard.pressed("A") ){
    tank.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
    mesh.rotateOnAxis( new THREE.Vector3(0,0,1), rotateAngle);}
  if ( keyboard.pressed("D") ){
    tank.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
    mesh.rotateOnAxis( new THREE.Vector3(0,0,1), -rotateAngle);}
  if ( keyboard.pressed("Q") ){
    Turret_2.rotateOnAxis( new THREE.Vector3(0,0,1), rotateAngle);
    mesh.rotateOnAxis( new THREE.Vector3(0,0,1), rotateAngle);}
  if ( keyboard.pressed("E") ){
    Turret_2.rotateOnAxis( new THREE.Vector3(0,0,1), -rotateAngle);
    mesh.rotateOnAxis( new THREE.Vector3(0,0,1), -rotateAngle);}
  // rotate left/right/up/down
  rotationMatrix = new THREE.Matrix4().identity();

  if( keyboard.pressed("V")){

    var bullet = new THREE.Mesh(
      new THREE.SphereGeometry(4,8,8),
      new THREE.MeshBasicMaterial({color:0xffffff})
    );

    bullet.position.set(tank.position.x,tank.position.y, tank.position.z);

    bullet.velocity = new THREE.Vector3(
      3*Math.sin(mesh.rotation.z),
      0,
      3*Math.cos(mesh.rotation.z));

    bullet.alive = true;
    setTimeout(function(){
      bullet.alive = false;
      scene.remove(bullet);
    }, 4000);

    bullets.push(bullet);
    scene.add(bullet);

  }
  controls.update();
  stats.update();
};

/**
 * Prevent mouse default movement
 * @param e = event
 */
function onDocumentMouseMove(e) {
  
}

/**
 * RENDER AND ANIMATE Functions - Starts the animation on the frame and the render
 */

function render(){
  //requestAnimationFrame(update);
  renderer.render(scene, camera);//draw
}

function animate()
{
  requestAnimationFrame( animate );
  render();
  update();
}
