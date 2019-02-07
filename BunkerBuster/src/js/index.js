/**
 * Fps management
 */
// (function(){
//   var fps=document.createElement('fps');
//   fps.onload=function (){
//     var wp = new Stats();
//     document.body.appendChild(wp.dom);
//     requestAnimationFrame(function loop() {
//       wp.update();
//       requestAnimationFrame(loop)
//     });
//   };
//   fps.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
//   document.head.appendChild(fps);
// })

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
var VIEW_ANGLE = 90, NEAR = 0.1, FAR = 1000,CAMERA_HEIGHT = 250,NUM_TURRETS = 5;

var camera;
var scene;
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

var TREES_LOADED = false;
var NUM_LOADED = 0;

// var dom;
// var mouse ={ x: 0, y: 0 };
// var clock = new THREE.Clock()
/**
 * Variables for player tank
 */
var bullets=[];
var CANNON_BULLETS=[];
var cannon_shells=[];

var tank,house;
var cannon;
var cannons = [];
var cann_positions =[];
var tank_life; //DA DECIDERE

var Body_1;
var Body_2;
var Track;
var Turret;
var Turret_2;
var destr_cann;
var rate = 60;
var p1fireRate = rate;   //FIRE RATE
var cannonsfireRate;

var cannon_rate_hard = 20;
var cannon_rate_medium = 70;
var cannon_rate_easy = 200;

var damage;
var damage_hard = 25;
var damage_medium = 15;
var damage_easy = 5;


var cannon_rate;
var viewfinder;
var soundPath = "sounds/";
var sound_tank_hit, sound_game_over,explosion,sound_war,power_up, sound_cannon,backgroundMusic,
  sound_shot_tank, sound_reload, cann_explosion,hit_on_cannnon,alarm ;


var health=0;
var health_bar;
var keyboard = new THREEx.KeyboardState();
keyboard.des
//temp
var trees_loader="models/trees/tree2.json";
var dead_tree_loader="models/trees/dead_tree.json";
//

var healthcube;
var healthcubes = [];

var speedcube;
var speedcubes = [];
var speed_bar;
var berserkcube;
var berserkcubes = [];
var berserk_bar;
var scorecube;
var scorecubes = [];

var timeleft = 0;
var delta = 0.01; // seconds.
var moveDistance = 100 * delta; //25 default
var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second

var shell;
var cannon_shell;

var nCubes;
var health_cube_texture;
var speed_cube_texture;
var berserk_cube_texture;
var score_cube_texture;

var enemy_health_bar = [];
var enemy_health_life = [];

var speed_up = false;                    //init perks values
var berserk_up = false;

var canvas;
var SCORE;
var clock,startTime, curTime;

var difficulty;
var difficulty_val;

var light_on;

var moveforward,moveleft,movedown,moveright;
/**
 * var to pause/play game
 */

var isPlay = false;
/**
 * Function to start game with the play button
 */
function start_game() {

  init();
  isPlay = true;
  animate();
}

function init_variables() {
  shell = new THREE.Mesh(new THREE.SphereGeometry(2.5, 8, 6), new THREE.MeshLambertMaterial({color: 0x0000}));
  cannon_shell = new THREE.Mesh(new THREE.SphereGeometry(4, 8, 6), new THREE.MeshLambertMaterial({color: 0xff0000}));
  health_bar = document.getElementById("health");
  speed_bar = document.getElementById("speed_pb_id");
  berserk_bar = document.getElementById("berserk_pb_id");

  canvas = document.getElementsByTagName("canvas")[0].setAttribute("id", "canvas_id");

  health_cube_texture = new THREE.TextureLoader().load('img/health.png');
  speed_cube_texture = new THREE.TextureLoader().load('img/speed.png');
  berserk_cube_texture = new THREE.TextureLoader().load('img/berserk.png');
  score_cube_texture = new THREE.TextureLoader().load('img/score.png');

  document.addEventListener("keydown", onDocumentKeyDown, false);
  document.addEventListener("keydown", move_tank, false);

  light_on= false;
}

function init() {
  destr_cann = 0;
  SCORE = 0;
  clock = new THREE.Clock();
  difficulty = document.getElementById("ddlViewBy");
  difficulty_val = difficulty.options[difficulty.selectedIndex].text;
  startTime=clock.getElapsedTime();

  if(difficulty_val === "Hard"){
    cannon_rate = cannon_rate_hard;
    damage = damage_hard;
  }
  if(difficulty_val === "Normal"){
    cannon_rate = cannon_rate_medium;
    damage = damage_medium;
  }
  if(difficulty_val === "Easy"){
    cannon_rate = cannon_rate_easy;
    damage = damage_easy;
  }

  cannonsfireRate = cannon_rate;

  document.getElementById('play_btn_div_id').style.display = 'none';
  document.getElementById('play_pause').style.display = 'inline-block';
  document.getElementById('ddlViewBy').style.display = 'none';
  document.getElementById('diff').style.display = 'none';

  document.getElementById('play_game_id').style.display = 'block';

  play_game_id = document.getElementById('play_game_id');

  sound_shot_tank = new sound(soundPath + "tank_shot.mp3");
  sound_tank_hit = new sound(soundPath + "tankhit.mp3");
//  sound_game_over = new sound(soundPath + "game_over.mp3");
  explosion = new sound(soundPath+"grenade.mp3");
  backgroundMusic = new sound(soundPath + "background.mp3");
  sound_war = new sound(soundPath + "sound_war.mp3");
  sound_cannon = new sound(soundPath + "cannon_shot.mp3");
  sound_reload = new sound(soundPath + "reload.mp3");
  power_up = new sound(soundPath + "powerup.mp3");
  cann_explosion = new sound(soundPath + "cannon_explosion.mp3");
  hit_on_cannnon = new sound(soundPath+ "hit_on_cannon.mp3");
  alarm = new sound(soundPath+ "alarm.mp3");
  sound_cannon.set_volume(0.2);
  // set up the scene
  createScene();
  // CONTROLS
  controls = new THREE.OrbitControls(camera);
  //controls.enabled = false;

  // STATS
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  // stats.domElement.style.zIndex = 100;

  play_game_id.appendChild(renderer.domElement);
  play_game_id.appendChild(stats.domElement);

  cann_positions[0] = [300, 0, 150];
  cann_positions[1] = [-300, 0, 800];
  cann_positions[2] = [1000, 0, 350];
  cann_positions[3] = [-1000, 0, -500];
  cann_positions[4] = [300, 0, 900];

  tank_life = 100;

  init_variables();
  add_cubes();

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

  const groundTexture = new THREE.ImageUtils.loadTexture( 'img/grass2.jpg' );

  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set( 10, 10 );

  const groundGeometry = new THREE.PlaneGeometry(3800 , 3800, 40, 10 );
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
  light.position.set(200,1000,200);
  light.shadowCameraVisible = true;
  light.castShadow = true;
  //light.shadowDarkness = 0.95;

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 10000 ;

  const viewfinderGeometry = new THREE.BoxBufferGeometry( 0.01, 0.01, 0.01 );
  const viewfinderMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  viewfinder = new THREE.Mesh( viewfinderGeometry, viewfinderMaterial );
  scene.add( viewfinder );

  window.addEventListener('resize', onWindowResize, false);//resize callback

  health = document.getElementById("health");

}

function addObjects(){

  addTank();
  addCannon();
  add_scenario_mesh();

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
  this.set_volume = function(vol){

    this.sound.volume=vol;
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
  scenario_mesh = [dead_tree_loader, trees_loader];
  var loader =[];
  var scenario;
  var nDeadTrees = 100;
  var nTrees2 = 100;

  for(var x = 0; x< scenario_mesh.length;x++){
    loader.push(new THREE.ObjectLoader());
  }

//DEAD TREES
  loader[0].load(scenario_mesh[0], function (obj) {
    scenario = obj;

    for(var j=0;j<nDeadTrees;j++) {
      mesh[j] = scenario.clone();
      mesh[j].position.x = (generate_random());
      mesh[j].position.y = 0 ;
      mesh[j].position.z = (generate_random());
      mesh[j].scale.set(5, 5, 5);
      scene.add(mesh[j]);
    }
  });
//TREES
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
    TREES_LOADED = true;
  });

}

function add_cubes(){
  nCubes = Math.random()*20;
  add_healthcubes(nCubes);
  add_speedcubes(nCubes);
  add_berserkcubes(nCubes);
  add_scorecubes(nCubes);
}

function add_healthcubes(nCubes){
  const Material = new THREE.MeshBasicMaterial( { map: health_cube_texture } );
  const Geometry = new THREE.CubeGeometry(30, 30, 30);
  healthcube = new THREE.Mesh(Geometry,Material);


  for(var i = 0; i<nCubes; i++){
    healthcubes[i] = healthcube.clone();
    healthcubes[i].position.set(generate_random(),8,generate_random());
    healthcubes[i].scale.set(0.4,0.4,0.4);
    healthcubes[i].visible=false;
    scene.add(healthcubes[i]);
  }

}


function add_speedcubes(nCubes){
  const Material = new THREE.MeshBasicMaterial( { map: speed_cube_texture } );
  const Geometry = new THREE.CubeGeometry(30, 30, 30);
  speedcube = new THREE.Mesh(Geometry,Material);


  for(var i = 0; i<nCubes; i++){
    speedcubes[i] = speedcube.clone();
    speedcubes[i].position.set(generate_random(),8,generate_random());
    speedcubes[i].scale.set(0.4,0.4,0.4);
    speedcubes[i].visible=false;
    scene.add(speedcubes[i]);

  }

}

function add_berserkcubes(nCubes){
  const Material = new THREE.MeshBasicMaterial( { map: berserk_cube_texture } );
  const Geometry = new THREE.CubeGeometry(30, 30, 30);
  berserkcube = new THREE.Mesh(Geometry,Material);


  for(var i = 0; i<nCubes; i++){
    berserkcubes[i] = berserkcube.clone();
    berserkcubes[i].position.set(generate_random(),8,generate_random());
    berserkcubes[i].scale.set(0.4,0.4,0.4);
    berserkcubes[i].visible=false;
    scene.add(berserkcubes[i]);
  }
}

function add_scorecubes(nCubes){
  const Material = new THREE.MeshBasicMaterial( { map: score_cube_texture } );
  const Geometry = new THREE.CubeGeometry(30, 30, 30);
  scorecube = new THREE.Mesh(Geometry,Material);


  for(var i = 0; i<nCubes; i++){
    scorecubes[i] = scorecube.clone();
    scorecubes[i].position.set(generate_random(),8,generate_random());
    scorecubes[i].scale.set(0.4,0.4,0.4);
    scorecubes[i].visible=false;
    scene.add(scorecubes[i]);
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

      enemy_health_life[i] = 2;   //FULL LIFE
      addEnemyHPBar(i);

    }
  });
}

function addEnemyHPBar(pos) {
  var geometry = new THREE.BoxBufferGeometry( 40, 2, 5 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); //GREEN
  enemy_health_bar[pos] = new THREE.Mesh( geometry, material );
  scene.add( enemy_health_bar[pos] );
  enemy_health_bar[pos].position.set(cannons[pos].position.x, 1, cannons[pos].position.z-20);
  enemy_health_bar[pos].visible= false;

}

function generate_random() {
  var randomN = (Math.random() * 3801) - 1900;   //numbers between -1900 and 1900, the coordinates of the terrain
  return randomN;
}


/**
 * KEYBOARD - MOUSE
 */
function update() {
  if(TREES_LOADED&&!light_on){
    scene.add(light);
    for(var t = 0; t< enemy_health_bar.length;t++){
      enemy_health_bar[t].visible=true;}
    for(var i = 0; i<nCubes; i++){
      speedcubes[i].visible=true;
      berserkcubes[i].visible=true;
      healthcubes[i].visible=true;
      scorecubes[i].visible=true;
      clock = new THREE.Clock();
      startTime=clock.getElapsedTime();

    }
    light_on = true;
  }

  if(tank_life<= 20){
    light.color.setHex(0xff471a);
    backgroundMusic.stop();
    alarm.play();
  }
  else{
    light.color.setHex(0xffffff);
    alarm.stop();
    if( isPlay)
    backgroundMusic.play();
  }

   var shot = false;
   curTime = clock.getElapsedTime() - startTime;

  document.getElementById('score').innerHTML = "Score: " + SCORE;
  document.getElementById('time').innerHTML = "Timer: " + curTime.toFixed(2);


   check_cubes();

  for (var index = 0; index < bullets.length; index += 1) {
    if (bullets[index] === undefined) continue;
    if (bullets[index].alive === false) {
      bullets.splice(index, 1);
      continue;
    }
    bullets[index].position.add(bullets[index].velocity);
  }

  for (var index = 0; index < CANNON_BULLETS.length; index += 1) {
    if (CANNON_BULLETS[index] === undefined) continue;
    if (CANNON_BULLETS[index].alive === false) {
      CANNON_BULLETS.splice(index, 1);
      continue;
    }
    CANNON_BULLETS[index].position.add(CANNON_BULLETS[index].velocity);
  }


  shot = false;

  /*
  if( p1fireRate === rate  && keyboard.pressed("V")){
    sound_reload.stop();
    tank_shoot();
  }
  else if (p1fireRate !== rate  && keyboard.pressed("V")) sound_reload.play();*/

  if (cannonsfireRate === cannon_rate) {
    // cannon_shoot();
  }

  shoot_controls();
  controls.dispose();
  controls.update();

  stats.update();
}

function onDocumentKeyDown(event) {
  var keyCode = event.which;
  if (keyCode === 86 && p1fireRate !== rate && shot) {
    sound_reload.play();
  }

  else if (keyCode === 86 && p1fireRate === rate && !shot) {
    //sound_reload.stop();
    sound_reload.stop();
    tank_shoot();
    shot = true;
  }
}

function move_tank(event){


  if (keyboard.pressed("W")) {
    if (check_Turret_Collision(0)) {
      tank.translateZ(moveDistance);
      update_cannons();
      update_camera();
    }
  }else{
    controls.enabled = false;
    controls.dispose();

  }

  if (keyboard.pressed("S")) {
    if (check_Turret_Collision(1)) {
      tank.translateZ(-moveDistance / 2);
      update_cannons();
      update_camera();
    }
  }else{
    controls.enabled = false;
    controls.dispose();

  }

  if (keyboard.pressed("A")) {
    tank.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
    viewfinder.rotateOnAxis(new THREE.Vector3(0, 0, 1), rotateAngle);
  } else{
    controls.enabled = false;
    controls.dispose();

  }
  if (keyboard.pressed("D")) {
    tank.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);
    viewfinder.rotateOnAxis(new THREE.Vector3(0, 0, 1), -rotateAngle);
  }else{
    controls.enabled = false;
    controls.dispose();

  }
  if (keyboard.pressed("Q")) {
    Turret_2.rotateOnAxis(new THREE.Vector3(0, 0, 1), rotateAngle);
    viewfinder.rotateOnAxis(new THREE.Vector3(0, 0, 1), rotateAngle);
  }else{
    controls.enabled = false;
    controls.dispose();

  }
  if (keyboard.pressed("E")) {
    Turret_2.rotateOnAxis(new THREE.Vector3(0, 0, 1), -rotateAngle);
    viewfinder.rotateOnAxis(new THREE.Vector3(0, 0, 1), -rotateAngle);
  }else{
    controls.enabled = false;
    controls.dispose();

  }
  // rotate left/right/up/down
  rotationMatrix = new THREE.Matrix4().identity();

}

function shoot_controls() {

  for( var i=0;i<bullets.length;i++) {
    for (var z = 0; z < cannons.length; z++) {
      if (bullets[i].visible === true &&  cannons[z].visible && bullets[i].position.x >= cannons[z].position.x - 10 && bullets[i].position.x <= cannons[z].position.x + 10 && bullets[i].position.z >= cannons[z].position.z - 10 && bullets[i].position.z <= cannons[z].position.z + 10) {
        bullets[i].visible = false;
        bullets[i].geometry.dispose();
        bullets[i].material.dispose();
        bullets[i].texture.dispose();

    /*    bullets[i].geometry.dispose();
        bullets[i].material.dispose();
        bullets[i] = undefined;*/
        if (  enemy_health_life[z] === 2) {
          enemy_health_bar[z].material.color.setHex(0xffff00);   //INSERIRE GIALLO
          hit_on_cannnon.play();
          SCORE += 10;
        }

        if (  enemy_health_life[z] === 1) {
          enemy_health_bar[z].material.color.setHex(0xff471a);   //INSERIRE ROSSO
          hit_on_cannnon.play();
          SCORE += 10;
        }
        if ( enemy_health_life[z] === 0) {
         // enemy_health_life[z].remove();
          scene.remove(enemy_health_bar[z]);
          enemy_health_bar[z].geometry.dispose();
          enemy_health_bar[z].material.dispose();
          enemy_health_bar[z].texture.dispose();
          enemy_health_bar[z] = undefined;
          cannons[z].visible = false;
          cann_explosion.play();
          destr_cann = destr_cann+1;
          SCORE += 30;
          if(destr_cann === 5){
            game_over(1);
          }


        }
        enemy_health_life[z] -= 1;
      }
    }
  }

  for(var y=0; y<CANNON_BULLETS.length;y++){     //TANK
    if (CANNON_BULLETS[y].position.x>=tank.position.x-10 && CANNON_BULLETS[y].position.x<=tank.position.x+10 && CANNON_BULLETS[y].position.z>=tank.position.z-10 && CANNON_BULLETS[y].position.z<=tank.position.z+10){
      CANNON_BULLETS[y].visible=false;
      CANNON_BULLETS.splice(y,1);
      sound_tank_hit.stop();
      sound_tank_hit.play();
      if(tank_life>0) {

        health_bar.value -= damage;
        tank_life = tank_life - damage;
        console.log('VITA:' + tank_life);
      }
      if (tank_life <= 0){
        game_over(0);

      }
    }
  }
}

function tank_shoot() {
  var temp_shell = shell.clone();
  temp_shell.visible = false;

  setTimeout(function(){
    temp_shell.visible = true ;
  }, 120);

  temp_shell.position.set(tank.position.x,tank.position.y+10, tank.position.z);

  temp_shell.velocity = new THREE.Vector3(
    4.5*Math.sin(viewfinder.rotation.z),
    0,
    4.5*Math.cos(viewfinder.rotation.z));

  temp_shell.alive = true;

  sound_shot_tank.stop();
  sound_shot_tank.play();


  bullets.push(temp_shell);
  scene.add(temp_shell);

  setTimeout(function(){
    temp_shell.alive = false;
    scene.remove(temp_shell);
  }, 5000);

  p1fireRate = 0;
}

function cannon_shoot(){

  cannon_shell.castShadow = false;
  if (tank === undefined)
    return;

  if(tank.position.x===0
      && tank.position.y===0
        && tank.position.z ===0)
    return;

  for( var i=0;i<cannons.length;i++) {
    if (cannons[i].visible === true) {
      cannon_shells[i] = cannon_shell.clone();
      cannon_shells[i].visible = true;
      cannon_shells[i].position.set(cann_positions[i][0], 5, cann_positions[i][2]);
      if (cannons[i].rotation.x !== -0) {
        cannon_shells[i].velocity = new THREE.Vector3(
          4.5 * Math.sin(cannons[i].rotation.y),
          0,
          -4.5 * Math.cos(cannons[i].rotation.y));
      }
      else {
        cannon_shells[i].velocity = new THREE.Vector3(
          4.5 * Math.sin(cannons[i].rotation.y),
          0,
          4.5 * Math.cos(cannons[i].rotation.y));
      }

      cannon_shells[i].alive = true;

      sound_cannon.stop();
      sound_cannon.play();

      CANNON_BULLETS.push(cannon_shells[i]);
      scene.add(cannon_shells[i]);
      timeout(cannon_shells[i],10);   //time to die in secs

    }
  }
  cannonsfireRate = 0;
}


function timeout(shell, time){
  time = time*1000;
  setTimeout(function () {
    shell.geometry.dispose();
    shell.material.dispose();
   // shell.texture.dispose();
    shell.alive = false;
    scene.remove(shell);
  }, time);

}

function update_camera(){
  camera.position.set(tank.position.x,CAMERA_HEIGHT,tank.position.z);
  controls.target.set(tank.position.x,0,tank.position.z);

}

function check_Turret_Collision(par) {
  //var tempX,tempZ;
  var clone = tank.clone();

  if(par === 0){
    clone.translateZ( 1 )
  }
  if (par === 1) {
    clone.translateZ( -1 )
  }

  for (var i = 0; i < cann_positions.length; i++) {

    if (cannons[i].visible === true
      && clone.position.x >= cann_positions[i][0]-5
      && clone.position.x <= cann_positions[i][0]+5
      && clone.position.z >= cann_positions[i][2]-5
      && clone.position.z <= cann_positions[i][2]+5) {
      return false;
    }
  }

  if(clone.position.x>1900
    ||clone.position.x<-1900
    ||clone.position.z>1900
    ||clone.position.z<-1900){
    return false;
  }
  return true;
}

function check_cubes() {
  var berserk_downloadTimer;
  var speed_downloadTimer;

  if(tank === undefined) return;

  for (var i = 0; i < nCubes; i++) {
    if (healthcubes[i].visible === true && tank.position.x >= healthcubes[i].position.x - 10 && tank.position.x <= healthcubes[i].position.x + 10 && tank.position.z >= healthcubes[i].position.z - 10 && tank.position.z <= healthcubes[i].position.z + 10) {
      healthcubes[i].visible = false;
      power_up.play();
      tank_life += 20;
      health_bar.value += 20;
      console.log('HEAL-> VITA: ' + tank_life);
    }

    if (speedcubes[i].visible === true && tank.position.x >= speedcubes[i].position.x - 10 && tank.position.x <= speedcubes[i].position.x + 10 && tank.position.z >= speedcubes[i].position.z - 10 && tank.position.z <= speedcubes[i].position.z + 10) {

      if (speed_up === true) {
        speed_bar.value = 100;
        speedcubes[i].visible = false;
        power_up.play();
      }

      else if (speed_up === false) {
        speed_up = true;
        speedcubes[i].visible = false;
        power_up.play();

        moveDistance = moveDistance * 2;
        console.log('SPEED UP');
        speed_bar.value = 100;

        speed_downloadTimer = setInterval(function () {
          speed_bar.value -= 10;
          if (speed_bar.value <= 0) {
            clearInterval(speed_downloadTimer);
            moveDistance = moveDistance / 2;
            console.log('SPEED UP IS OVER');
            speed_up = false;

          }
        }, 1000);
      }

    }

    if (berserkcubes[i].visible === true && tank.position.x >= berserkcubes[i].position.x - 10 && tank.position.x <= berserkcubes[i].position.x + 10 && tank.position.z >= berserkcubes[i].position.z - 10 && tank.position.z <= berserkcubes[i].position.z + 10) {
      if (berserk_up === true) {
        berserk_bar.value = 100;
        berserkcubes[i].visible = false;
        power_up.play();
      }
      else if (berserk_up === false) {
        berserk_up = true;
        berserkcubes[i].visible = false;
        power_up.play();
        rate = rate / 2;
        console.log('BERSERK UP');
        berserk_bar.value = 100;
        p1fireRate = rate;

        berserk_downloadTimer = setInterval(function () {
          berserk_bar.value -= 10;
          if (berserk_bar.value <= 0) {
            clearInterval(berserk_downloadTimer);
            rate = rate * 2;
            console.log('BERSERK UP IS OVER');
            berserk_up = false;
          }
        }, 1000);
      }
    }

    if (scorecubes[i].visible === true && tank.position.x >= scorecubes[i].position.x - 10 && tank.position.x <= scorecubes[i].position.x + 10 && tank.position.z >= scorecubes[i].position.z - 10 && tank.position.z <= scorecubes[i].position.z + 10){

      scorecubes[i].visible = false;
      power_up.play();
      console.log('Score UP');
      SCORE += 40;
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
  var rot_x = 0.018;
  var rot_y = 0.020;

  backgroundMusic.play();
  sound_war.play();
  //requestAnimationFrame(update);

  move_tank();
  for(var i = 0; i< nCubes;i++){
    healthcubes[i].rotation.x += rot_x;
    healthcubes[i].rotation.y += rot_y;
    speedcubes[i].rotation.x += rot_x;
    speedcubes[i].rotation.y += rot_y;
    berserkcubes[i].rotation.x += rot_x;
    berserkcubes[i].rotation.y += rot_y;
    scorecubes[i].rotation.x += rot_x;
    scorecubes[i].rotation.y += rot_y;
  }

  renderer.render(scene, camera);//draw

  if (p1fireRate < rate) {
    p1fireRate++;
  }
  if (cannonsfireRate < cannon_rate) {
    cannonsfireRate++;
  }
}

function animate() {
  if (!isPlay) return;

 /*   setTimeout( function() {

      requestAnimationFrame( animate );

    }, 100 / 4 );   //FPS CAPPED TO 60 */
   requestAnimationFrame( animate );
    render();
    update();

}

function play_pause_game() {
  // Start and Pause
  if (!isPlay) {
    isPlay = true;
    if(tank_life>20) backgroundMusic.play();
    else alarm.play();

    sound_war.play();
    sound_cannon.play();
    document.getElementById("pause_div_id").style.display = "none";
    animate();

  } else {
    isPlay = false;
    backgroundMusic.pause();
    alarm.pause();
    var id = requestAnimationFrame(animate);
    sound_shot_tank.pause();

    sound_war.pause();
    alarm.pause();
    sound_cannon.pause();
    cancelAnimationFrame(id);
    document.getElementById("pause_div_id").style.display = "block";
    document.getElementById("restart_game_div_id").style.display = "block";
  }
}

function changeImage(ID){
  if(ID ===1) {
    var abs_path1 = document.getElementById("play_pause").src;
    var path1 = abs_path1.substring(abs_path1.lastIndexOf("/"), abs_path1.length);

    if (path1 === '/ResumeBTN.png') {
      document.getElementById("play_pause").src = 'img/PauseBTN.png';
    }
    else {
      document.getElementById("play_pause").src = 'img/ResumeBTN.png';
    }
  }
  if (ID === 2){

    var abs_path2 = document.getElementById("mute_unmute").src;
    var path2 = abs_path2.substring(abs_path2.lastIndexOf("/"), abs_path2.length);
    if (path2 === '/UnmuteBTN.png') {
      mute_unmute_game(1);
      document.getElementById("mute_unmute").src = 'img/MuteBTN.png';
    }
    else {
      mute_unmute_game(2);
      document.getElementById("mute_unmute").src = 'img/UnmuteBTN.png';
    }
  }
}

function mute_unmute_game(val){
  if (val === 2){
    sound_shot_tank.set_volume(0);
    sound_tank_hit.set_volume(0);
    backgroundMusic.set_volume(0);
    sound_war.set_volume(0);
    sound_cannon.set_volume(0);
    sound_reload.set_volume(0);
    power_up.set_volume(0);
    cann_explosion.set_volume(0);
    hit_on_cannnon.set_volume(0);
    alarm.set_volume(0);
  }
  else{
    alarm.set_volume(1);
    sound_shot_tank.set_volume(1);
    sound_tank_hit.set_volume(1);
  //  sound_game_over.set_volume(1);
    explosion.set_volume(1);
    backgroundMusic.set_volume(1);
    sound_war.set_volume(1);
    sound_reload.set_volume(1);
    sound_cannon.set_volume(0.2);
    cann_explosion.set_volume(1);
    hit_on_cannnon.set_volume(1);
    power_up.set_volume(1);

  }
}

function restart_game() {
  var txt;
  isPlay = false;
  if (confirm("Are you sure?")) {
    //"You pressed OK!";
    // location.reload();
    document.getElementById("pause_div_id").style.display = "none";
    document.getElementById("play_pause").src = 'img/PauseBTN.png';
    var canvas_id = document.getElementById("canvas_id");
    canvas_id.remove();
    health_bar.value = 100;
    tank_life = 100;
    berserk_bar.value = 0;
    speed_bar.value=0;
    start_game();
  } else {
    //"You pressed Cancel!";
    isPlay = true;
  }
}

function game_over(par) {

  controls.enabled = false;
  controls.dispose();

  SCORE -= curTime.toFixed(2);
  if(SCORE < 0){
    SCORE = 0;
  }
  var temp_div = document.getElementById("game_over_div_id");
  var text_to_change = temp_div.childNodes[0];

  if (par === 0) {
    document.getElementById('score').innerHTML = "Score: " + Math.floor(SCORE);
    text_to_change.nodeValue = 'GAME OVER';
    document.getElementById("game_over_div_id").style.display = "block";
    explosion.play();

  }
  else if (par === 1) {
    SCORE += 100;
    document.getElementById('score').innerHTML = "Score: " + Math.floor(SCORE);
    text_to_change.nodeValue = 'VICTORY';
    document.getElementById("game_over_div_id").style.display = "block";
  }

  isPlay = false;
  health_bar.value = 100;
  berserk_bar.value = 0;
  speed_bar.value = 0;
  enemy_health_bar = [];
  enemy_health_life = [];
  cannons = [];
  bullets = [];
  CANNON_BULLETS = [];
  cann_positions = [];
  var id = requestAnimationFrame(animate);
  cancelAnimationFrame(id);
  mute_unmute_game(2);

  save_users_score();
  save_high_score(SCORE);
}

function restart_game_after_gameover() {
  document.getElementById("game_over_div_id").style.display = "none";
  var canvas_id = document.getElementById("canvas_id");
  canvas_id.remove();
  start_game();
  mute_unmute_game(1);

}

function saveusername() {
  var username = document.getElementById("username_id");
  localStorage.setItem("username_id", username.value);
}

function prevent_default(e) {
  if (e.type.indexOf("key") !== -1) {
    e.preventDefault();
    e.stopPropagation();
  }
}
