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

var VIEW_ANGLE = 90, NEAR = 0.1, FAR = 1000,CAMERA_HEIGHT = 400;

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

var controls;
var stats;

var clock = new THREE.Clock()
var TANK_LOADED = false;
var NUM_LOADED = 0;
var mouse ={ x: 0, y: 0 };

/**
 * Variables for player tank
 */
var bullets=[];
var cann_bullets=[];


var tank,tree,tree2,house,cannon;

var Body_1;
var Body_2;
var Track;
var Turret;
var Turret_2;
var p1fireRate = 60;   //FIRE RATE
var cannonfireRate = 80;
var viewfinder;

var soundPath = "sounds/";
var sound_shot;

var cube;
var keyboard = new THREEx.KeyboardState();

/**
 * Function to start game with the play button
 */
function start_game() {
  document.getElementById("playBTN").style.display='none';
  document.getElementById("start_game").style.display='block';
  document.getElementById("game_ifrm").style.display='block';

  init();
  animate();


}

function init() {

  sound_shot = new sound(soundPath + "cannon_shot.mp3");


  // set up the scene
  createScene();
  // CONTROLS
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  // controls.enabled = false;
  // STATS
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 100;
  dom.appendChild(stats.domElement);
  dom.addEventListener( 'mousemove', onDocumentMouseMove, false );

  var cubegeometry = new THREE.BoxGeometry( 10, 10, 10 );
  var cubematerial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  cube = new THREE.Mesh(cubegeometry, cubematerial );

  //cube.scale.set(5,7,9);
  cube.position.set(50,5,90);
  scene.add(cube);

}

/**
 * This function is to generate the scene light, shadow, ground
 */
function createScene(){
  addTank();
  addTree();
  addTree2();
  addHouse();
  addCannon();
  scene = new THREE.Scene();//the 3d scene

  sceneWidth=window.innerWidth;
  sceneHeight=window.innerHeight;
  //scene.fog = new THREE.Fog(0x00ff00, 50, 800);//enable fog
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE , sceneWidth / sceneHeight, NEAR, FAR );//perspective camera
  scene.add(camera);
  camera.lookAt(new THREE.Vector3(0,0,0));
  camera.position.set(0,CAMERA_HEIGHT,0);
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



  light = new THREE.PointLight( 0xffffff, 1.5,0 ,2 );
  light.position.set(200,400,200);
  light.shadowCameraVisible=true;
  light.castShadow = true;
  //light.shadowDarkness = 0.95;
  scene.add(light);
  //Set up shadow properties for the light
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 10000 ;

  orbitControl = new THREE.OrbitControls( camera, renderer.domElement );//helper to rotate around in scene
  //orbitControl.addEventListener( 'change', render );
  orbitControl.enableDamping = true;
  orbitControl.dampingFactor = 0.8;
  orbitControl.enableZoom = false;


  const viewfinderGeometry = new THREE.BoxBufferGeometry( 0.01, 0.01, 0.01 );
  const viewfinderMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  viewfinder = new THREE.Mesh( viewfinderGeometry, viewfinderMaterial );
  scene.add( viewfinder );
  viewfinder2 = new THREE.Mesh( viewfinderGeometry, viewfinderMaterial );
  scene.add( viewfinder2 );
  window.addEventListener('resize', onWindowResize, false);//resize callback
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
    this.sound.currentTime = 0;
  }
  this.speedUp = function(){
    this.sound.playbackRate= 3;
  }
  this.pause = function () {
    this.sound.pause();
  }
}

/**
 * Tank Mesh added to the scene
 */
function addTank(){
  var loader = new THREE.ObjectLoader();
  loader.load("models/tank/tank.json",
    function (obj){
      tank = obj;
      TANK_LOADED = true;
      NUM_LOADED++;

      tank.scale.set(4.5, 4.5, 4.5);
     // camera.add(tank);
     // tank.castShadow = true;
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

function addTree(){
  var loader = new THREE.ObjectLoader();
  loader.load("models/trees/tree.json",
    function (obj){
      tree = obj;
      // TANK_LOADED = true;
      //NUM_LOADED++;

      tree.scale.set(30, 30, 30);

     // tree.castShadow = true;
      scene.add(tree);
      tree.position.set(20,5,40);
     // camera.add(tree);
    },
    // onProgress callback
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% caricato');
    },

    // onError callback
    function (err) {
      console.error('An error happened');
      TANK_LOADED = false;
    });


}

function addTree2(){
  var loader = new THREE.ObjectLoader();
  loader.load("models/trees/tree2.json",
    function (obj){
      tree2 = obj;
      tree2.scale.set(0.5, 0.5, 0.5);

     // tree2.castShadow = true;
      scene.add(tree2);
      tree2.position.set(60,0,40);
      // camera.add(tree);
    },

    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% caricato');
    },


    function (err) {
      console.error('An error happened');
      TANK_LOADED = false;
    });


}
function addHouse(){
  var loader = new THREE.ObjectLoader();
  loader.load("models/house/old-house.json",
    function (obj){
      house = obj;
      house.scale.set(10, 10, 10);

      // tree2.castShadow = true;
      scene.add(house);
      house.position.set(200,0,350);
      // camera.add(tree);
    },

    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% house_loaded');
    },


    function (err) {
      console.error('An error happened with house');
      TANK_LOADED = false;
    });

}

function addCannon() {
  var loader = new THREE.ObjectLoader();
  loader.load("models/cannons/cannon.json",
    function (obj) {
      cannon = obj;
      cannon.scale.set(10, 10, 10);

      // tree2.castShadow = true;
      scene.add(cannon);
      cannon.position.set(-150,0,300);

   //   cannon.lookAt(0,0,0);
      // camera.add(tree);
    },

    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% cannon_loaded');
    },


    function (err) {
      console.error('An error happened with house');
      TANK_LOADED = false;
    });
}
/**
 * KEYBOARD - MOUSE
 */
function update(){

  var delta = 0.01; // seconds.
  var moveDistance = 100 * delta; //25 default
  var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second

  for(var index=0; index<bullets.length; index+=1){
    if( bullets[index] === undefined ) continue;
    if( bullets[index].alive === false ){
      bullets.splice(index,1);
      continue;
    }
    bullets[index].position.add(bullets[index].velocity);
  }

  for(var index=0; index<cann_bullets.length; index+=1){
    if( cann_bullets[index] === undefined ) continue;
    if( cann_bullets[index].alive === false ){
      cann_bullets.splice(index,1);
      continue;
    }
    cann_bullets[index].position.add(cann_bullets[index].velocity);
  }

  if ( keyboard.pressed("W") ){
    tank.translateZ( moveDistance );cannon_bullet;
    cannon.lookAt(tank.position.x,0,tank.position.z);
    update_camera();
      }

  if ( keyboard.pressed("S") ){
    tank.translateZ( -moveDistance );
    cannon.lookAt(tank.position.x,0,tank.position.z);
    update_camera();
  }
  if ( keyboard.pressed("A") ){
    tank.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
    viewfinder.rotateOnAxis( new THREE.Vector3(0,0,1), rotateAngle);
    }
  if ( keyboard.pressed("D") ){
    tank.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
    viewfinder.rotateOnAxis( new THREE.Vector3(0,0,1), -rotateAngle);
     }
  if ( keyboard.pressed("Q") ){
    Turret_2.rotateOnAxis( new THREE.Vector3(0,0,1), rotateAngle);
    viewfinder.rotateOnAxis( new THREE.Vector3(0,0,1), rotateAngle);
    }
  if ( keyboard.pressed("E") ){
    Turret_2.rotateOnAxis( new THREE.Vector3(0,0,1), -rotateAngle);
    viewfinder.rotateOnAxis( new THREE.Vector3(0,0,1), -rotateAngle);}
  // rotate left/right/up/down
  rotationMatrix = new THREE.Matrix4().identity();
  update_cannon();

 /* if(keyboard.pressed("Z")){

    camera.position.x = tank.position.x;
    camera.position.z = tank.position.z ;
    controls.target.set(tank.position.x,0,tank.position.z)
  }*/

  if( p1fireRate == 60 && keyboard.pressed("V")){

    var bullet = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.MeshLambertMaterial({color: 0x0000}));

    //bullet.visible = false ;
    bullet.visible = false;
    sound_shot.stop();
    sound_shot.play();

     setTimeout(function(){
      bullet.visible = true ;
    }, 120);

    bullet.position.set(tank.position.x,tank.position.y+10, tank.position.z);
    bullet.velocity = new THREE.Vector3(
      4.5*Math.sin(viewfinder.rotation.z),
      0,
      4.5*Math.cos(viewfinder.rotation.z));

    bullet.alive = true;
    setTimeout(function(){
      bullet.alive = false;
      scene.remove(bullet);
    }, 4000);

    bullets.push(bullet);
    scene.add(bullet);


    p1fireRate = 0;
  }

  if(cannonfireRate == 80 && keyboard.pressed("C")){

    var cannon_bullet = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.MeshLambertMaterial({color: 0x0000}));
    cannon_bullet.position.set(-150,10,300);
    cannon_bullet.velocity = new THREE.Vector3(
      4.5*Math.sin(cannon.rotation.y),
      0,
      4.5*Math.cos(cannon.rotation.y));

    cannon_bullet.visible = true ;
    cannon_bullet.alive = true;



    sound_shot.stop();
    sound_shot.play();


    setTimeout(function(){
      cannon_bullet.alive = false;
      scene.remove(cannon_bullet);
    }, 4000);
    cann_bullets.push(cannon_bullet);
    scene.add(cannon_bullet);

    cannonfireRate = 0;
  }


  for( var i=0;i<bullets.length;i++){
  if (bullets[i].position.x>=cube.position.x-10 && bullets[i].position.x<=cube.position.x+10 && bullets[i].position.z>=cube.position.z-10 && bullets[i].position.z<=cube.position.z+10){
    cube.visible=false;
    bullets[i].visible=false;
  }
   }

  controls.update();
  stats.update();

};

function update_camera(){
  camera.position.set(tank.position.x,CAMERA_HEIGHT,tank.position.z);
  controls.target.set(tank.position.x,0,tank.position.z)
}

function update_cannon(){

  //
  //cannon.rotate(180,0,0);

}

function cannon_shot(){

  var cann_bullet = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.MeshLambertMaterial({color: 0x0000}));

  cann_bullet.visible = true ;
  cann_bullet.position.set(-150,10,300);
  cann_bullet.velocity = new THREE.Vector3(
    4.5*Math.sin(cannon.rotation.x),
    0,
    4.5*Math.cos(cannon.rotation.x));
  sound_shot.stop();
  sound_shot.play();

  cann_bullet.alive = true;
  setTimeout(function(){
    cann_bullet.alive = false;
    scene.remove(cann_bullet);
  }, 4000);
  cann_bullets.push(cann_bullet);
  scene.add(cann_bullet);

  cannonfireRate = 0;
}

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
  if (p1fireRate < 60) {
    p1fireRate++;
  }
  if (cannonfireRate < 80) {
    cannonfireRate++;
  }





}

function animate()
{
  requestAnimationFrame( animate );
  render();
  update();
}
