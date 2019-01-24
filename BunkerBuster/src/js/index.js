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
  sceneWidth = $(play_game_id).width();
  sceneHeight = $(play_game_id).height();
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth/sceneHeight;
  camera.updateProjectionMatrix();
}

/**
 * Variables declaration
 */
var VIEW_ANGLE = 90, NEAR = 0.1, FAR = 1000,CAMERA_HEIGHT = 300,NUM_TURRETS = 5;

var camera;
var scene;
var orbitControl;
var sceneWidth;
var sceneHeight;
var renderer;
var play_game_id;
var light;
var ground;
var rotationMatrix;

var controls;
var stats;

var scenario_mesh = [];
var multiple_scenario_mesh = [];
var enemy_mesh = [];

var TANK_LOADED = false;
var MESH_LOADED = false;
var NUM_LOADED = 0;

// var dom;
// var mouse ={ x: 0, y: 0 };
// var clock = new THREE.Clock()
/**
 * Variables for player tank
 */
var bullets=[];
var CANNON_BULLETS=[];
var cannon_bullets=[];

var tank,tree,tree2,house;
var scenario;
var cannon;
var cannons=[];
var cann_positions =[];
var tank_life; //DA DECIDERE

var Body_1;
var Body_2;
var Track;
var Turret;
var Turret_2;
var p1fireRate = 60;   //FIRE RATE
var cannonfireRate = 80;
var viewfinder;
var soundPath = "sounds/";
var sound_shot, sound_tank_hit, sound_game_over;

var cube;
var keyboard = new THREEx.KeyboardState();

//temp
var tree_loader="models/trees/tree.json";
var house_loader="models/house/old-house.json";
var cannon_loader="models/cannons/cannon.json";
//


/**
 * Function to start game with the play button
 */
function start_game() {

  init();
  animate();
}

function init() {
  document.getElementById('play_btn_div_id').style.display='none';
  document.getElementById('play_game_id').style.display='block';

  play_game_id = document.getElementById('play_game_id');

  sound_shot = new sound(soundPath + "cannon_shot.mp3");
  sound_tank_hit = new sound(soundPath + "tankhit.mp3");
  sound_game_over = new sound(soundPath + "game_over.mp3")
  // set up the scene
  createScene();
  // CONTROLS
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  //controls.enabled = false;
  // STATS
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  // stats.domElement.style.zIndex = 100;

  play_game_id.appendChild(renderer.domElement);
  play_game_id.appendChild(stats.domElement);

  var cubegeometry = new THREE.BoxGeometry( 10, 10, 10 );
  var cubematerial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  cube = new THREE.Mesh(cubegeometry, cubematerial );

  //cube.scale.set(5,7,9);
  cube.position.set(50,5,90);
  scene.add(cube);
  cann_positions[0] =  [300,0,150];
  cann_positions[1] =  [-300,0,800];
  cann_positions[2] =  [1000,0,350];
  cann_positions[3] =  [-1000,0,-500];
  cann_positions[4] =  [300,0,900];

  tank_life = 100;

}

/**
 * This function is to generate the scene light, shadow, ground
 */
function createScene(){

  addObjects();

  scene = new THREE.Scene();//the 3d scene

  sceneWidth = $(play_game_id).width();
  sceneHeight = $(play_game_id).height();

  //scene.fog = new THREE.Fog(0x00ff00, 50, 800);//enable fog
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE , sceneWidth / sceneHeight, NEAR, FAR );//perspective camera
  scene.add(camera);
  camera.lookAt(new THREE.Vector3(0,0,0));
  camera.position.set(0,CAMERA_HEIGHT,0);
  renderer = new THREE.WebGLRenderer({alpha:true});//renderer with transparent backdrop
  renderer.shadowMap.enabled = true;//enable shadow
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.setSize( sceneWidth, sceneHeight );

  const groundTexture = new THREE.ImageUtils.loadTexture( 'img/rocky-ground.jpg' );
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set( 30, 30 );

  const groundGeometry = new THREE.PlaneGeometry(sceneWidth*2 , sceneWidth*2, 40, 10 );
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
  window.addEventListener('resize', onWindowResize, false);//resize callback
}

function addObjects(){

  addTank();
  addCannon();
  add_scenario_mesh();
  // addTree();
 // addTree2();
 // addHouse();
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

function add_scenario_mesh(){
  var loader = new THREE.ObjectLoader();
  scenario_mesh = [tree_loader, house_loader];

  // for(var i=0;i<scenario_mesh.length;i++) {
  //   console.log("length", scenario_mesh.length);
  //loader.load(scenario_mesh,
    loader.load("models/trees/tree.json",
      function (obj) {
        scenario = obj;
        console.log("scenario", scenario);
        MESH_LOADED = true;
        NUM_LOADED++;

        for(var j=0;j<4;j++) {
          var tempNew = scenario.clone();
          tempNew.position.x = Math.random() * 2 - 1;
          tempNew.position.y = 0 ;
          tempNew.position.z = Math.random() * 2 - 1;
          tempNew.position.normalize();
          tempNew.position.multiplyScalar( 200 );
          tempNew.scale.set(20, 20, 20);
          multiple_scenario_mesh.push(tempNew);
          scene.add(multiple_scenario_mesh[j]);
          console.log(multiple_scenario_mesh)
        }
      },

      // onProgress callback
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% caricato');
      },

      // onError callback
      function (err) {
        console.error('An error happened');
        MESH_LOADED = false;
      });
  //}
}


function addCannon() {
  var loader = new THREE.ObjectLoader();
  loader.load("models/cannons/cannon.json", function (obj) {
    cannon= obj;
    for(var i=0;i<NUM_TURRETS;i++){
      cannons[i] = cannon.clone();
      cannons[i].scale.set(10, 10, 10);
      scene.add(cannons[i]);
      cannons[i].position.set(cann_positions[i][0],cann_positions[i][1],cann_positions[i][2]);

    }
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

  for(var index=0; index<CANNON_BULLETS.length; index+=1){
    if( CANNON_BULLETS[index] === undefined ) continue;
    if( CANNON_BULLETS[index].alive === false ){
      CANNON_BULLETS.splice(index,1);
      continue;
    }
    CANNON_BULLETS[index].position.add(CANNON_BULLETS[index].velocity);
  }

  if ( keyboard.pressed("W") ){
    tank.translateZ( moveDistance );
    update_cannons();
    update_camera();
      }

  if ( keyboard.pressed("S") ){
    tank.translateZ( -moveDistance );
    update_cannons();
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


 /* if(keyboard.pressed("Z")){

    camera.position.x = tank.position.x;
    camera.position.z = tank.position.z ;
    controls.target.set(tank.position.x,0,tank.position.z)
  }*/

  if( p1fireRate === 60 && keyboard.pressed("V")){

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

  if(cannonfireRate === 80){
    var cannon_bullet = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.MeshLambertMaterial({color: 0x0000}));
    for( var i=0;i<cannons.length;i++) {
      if (cannons[i].visible == true) {
        cannon_bullets[i] = cannon_bullet.clone();
        cannon_bullets[i].position.set(cann_positions[i][0], cann_positions[i][1], cann_positions[i][2]);
        if (cannons[i].rotation.x != -0) {
          cannon_bullets[i].velocity = new THREE.Vector3(
            4.5 * Math.sin(cannons[i].rotation.y),
            0,
            -4.5 * Math.cos(cannons[i].rotation.y));
        }
        else {
          cannon_bullets[i].velocity = new THREE.Vector3(
            4.5 * Math.sin(cannons[i].rotation.y),
            0,
            4.5 * Math.cos(cannons[i].rotation.y));
        }
        cannon_bullets[i].visible = true;
        cannon_bullets[i].alive = true;


        sound_shot.stop();
        sound_shot.play();


        setTimeout(function () {
          cannon_bullets[i].alive = false;
          scene.remove(cannon_bullets[i]);
        }, 4000);
        CANNON_BULLETS.push(cannon_bullets[i]);
        scene.add(cannon_bullets[i]);
      }

      cannonfireRate = 0;
    }
  }


  for( var i=0;i<bullets.length;i++){
    for(var z =0;z<cannons.length;z++) {
      if ( cannons[z].visible===true && bullets[i].position.x >= cannons[z].position.x - 10 && bullets[i].position.x <= cannons[z].position.x + 10 && bullets[i].position.z >= cannons[z].position.z - 10 && bullets[i].position.z <= cannons[z].position.z + 10) {
        cannons[z].visible = false;
        console.log( 'CANNONE ' + (z+1) + ' INVISIBILE');
        bullets[i].visible = false;
      }
    }
   }

  for(var y=0; y<CANNON_BULLETS.length;y++){
    if (CANNON_BULLETS[y].position.x>=tank.position.x-10 && CANNON_BULLETS[y].position.x<=tank.position.x+10 && CANNON_BULLETS[y].position.z>=tank.position.z-10 && CANNON_BULLETS[y].position.z<=tank.position.z+10){
      CANNON_BULLETS[y].visible=false;
      CANNON_BULLETS.splice(y,1);
      sound_tank_hit.stop();
      sound_tank_hit.play();
    if(tank_life>0) {

      tank_life = tank_life - 10;
      console.log('VITA:' + tank_life);
    }
   if (tank_life == 0){

     sound_game_over.stop();
     sound_game_over.play();
     }
    }
  }

  controls.update();
  stats.update();

};

function update_camera(){
  camera.position.set(tank.position.x,CAMERA_HEIGHT,tank.position.z);
  controls.target.set(tank.position.x,0,tank.position.z)
  // console.log(tank.position.x);
  // console.log(viewfinder.rotation);
  console.log("rotation", viewfinder.rotation);

}

function update_cannons(){

  for(var i =0;i<cannons.length;i++)
  cannons[i].lookAt(tank.position.x,0,tank.position.z);
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
