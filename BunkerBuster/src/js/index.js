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
var mesh = [];

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
var house_loader="models/trees/tree2.json";
var cannon_loader="models/cannons/cannon.json";
var cactus_loader="models/trees/cactus.json";
var dead_tree_loader="models/trees/dead_tree.json";
//

var healthcube;
var healthcubes = [];


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

  add_healthcubes();

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
  groundTexture.repeat.set( 60, 60 );

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
  },
  this.stop = function(){
    this.sound.pause();
    this.sound.currentTime = 0;
  },
  this.speedUp = function(){
    this.sound.playbackRate= 3;
  },
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

    });
}

function add_scenario_mesh(){
  scenario_mesh = [dead_tree_loader, house_loader];
  var loader =[];
  var scenario;
  var nDeadTrees = 30;
  var nTrees2 = 30;

  for(var x = 0; x< scenario_mesh.length;x++){
    loader.push(new THREE.ObjectLoader());
  }

//CACTUS
  loader[0].load(scenario_mesh[0], function (obj) {
        scenario = obj;

        for(var j=0;j<nDeadTrees;j++) {
          mesh[j] = scenario.clone();
          mesh[j].position.x=(generate_random());
          mesh[j].position.y = 0 ;
          mesh[j].position.z = (generate_random());
          mesh[j].scale.set(5, 5, 5);
          scene.add(mesh[j]);
        }
      });
//HOUSES
  loader[1].load(scenario_mesh[1], function (obj) {
        scenario = obj;

        for(var j=nDeadTrees;j<nDeadTrees+nTrees2;j++) {
          mesh[j] = scenario.clone();
          mesh[j].position.x = (generate_random());
          mesh[j].position.y = 0 ;
          mesh[j].position.z = (generate_random());
          mesh[j].scale.set(0.8, 0.8, 0.8);
          scene.add(mesh[j]);
    }
  });

}

function add_healthcubes(){

  var random;
  random = Math.random()*35;

  var Texture = new THREE.TextureLoader().load( 'img/health.png');
  const Material = new THREE.MeshBasicMaterial( { map: Texture } );
  const Geometry = new THREE.CubeGeometry(30, 30, 30);
  healthcube = new THREE.Mesh(Geometry,Material);


  for(var i = 0; i<random; i++){
  healthcubes[i] = healthcube.clone();
  healthcubes[i].position.set(generate_random(),8,generate_random());
  healthcubes[i].scale.set(0.4,0.4,0.4);
  scene.add(healthcubes[i]);

  }

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

function generate_random(){
  var randomN = (Math.random() * 3801) - 1900;   //numbers between -1900 and 1900, the coordinates of the terrain
  return randomN;
}



/**
 * KEYBOARD - MOUSE
 */
function update(){

  check_healtcube()

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
    if(check_Turret_Collision(0)){
    tank.translateZ( moveDistance );
    update_cannons();
    update_camera();
    }
   }

  if ( keyboard.pressed("S") ){
    if(check_Turret_Collision(1)) {
      tank.translateZ(-moveDistance);
      update_cannons();
      update_camera();
    }
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

      var health = document.getElementById("health");
      health.value -= 10;

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

}

function update_camera(){
  camera.position.set(tank.position.x,CAMERA_HEIGHT,tank.position.z);
  controls.target.set(tank.position.x,0,tank.position.z);

}

function check_Turret_Collision(par) {
  //var tempX,tempZ;
  var clone = tank.clone();

  if(par ===0){
    clone.translateZ( 1 )
  }
  if (par===1) {
    clone.translateZ( -1 )
  }

  for (var i = 0; i < cann_positions.length; i++) {

    if (cannons[i].visible==true&&clone.position.x >= cann_positions[i][0]-5 && clone.position.x <= cann_positions[i][0]+5 && clone.position.z >= cann_positions[i][2]-5 && clone.position.z <= cann_positions[i][2]+5) {
      return false;
    }
  }
  return true;
}

function check_healtcube(){
  for(var i = 0; i< healthcubes.length;i++){
    if (healthcubes[i].visible==true&&tank.position.x >= healthcubes[i].position.x-8 && tank.position.x <= healthcubes[i].position.x+8 && tank.position.z >= healthcubes[i].position.z-8 && tank.position.z <= healthcubes[i].position.z+8) {
      healthcubes[i].visible = false;
      tank_life += 20;
      console.log ('HEAL-> VITA: '+ tank_life);
    }

  }


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
  for(var i = 0; i<healthcubes.length;i++){
  healthcubes[i].rotation.x += 0.008;
  healthcubes[i].rotation.y += 0.012;}

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
