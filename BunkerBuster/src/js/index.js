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
  camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000 );//perspective camera
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

  var planeGeometry = new THREE.PlaneGeometry( 5, 5, 4, 4 );
  var planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
  ground = new THREE.Mesh( planeGeometry, planeMaterial );
  ground.receiveShadow = true;
  ground.castShadow=false;
  ground.rotation.x=-Math.PI/2;
  scene.add( ground );

  camera.position.z = 5;
  camera.position.y = 1;

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
  //orbitControl.enableDamping = true;
  //orbitControl.dampingFactor = 0.8;
  orbitControl.enableZoom = false;

  //var helper = new THREE.CameraHelper( sun.shadow.camera );
  //scene.add( helper );// enable to see the light cone

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
  addTank();

}

function addTank(){
  var loader = new THREE.ObjectLoader();
  loader.load("models/tank/tank.json",
    function (obj){
      tank = obj;
      TANK_LOADED = true;
      NUM_LOADED++;
      tank.position.x = 0;
      tank.position.z = 0;
      tank.position.y = 0;
      tank.scale.x = tank.scale.y = tank.scale.z =0.7;
      scene.add(obj);

      Box = scene.getObjectByName('Box');
      Box1 = scene.getObjectByName('Box1');
      Box2 = scene.getObjectByName('Box2');
      Box5 = scene.getObjectByName('Box5');
      Box6 = scene.getObjectByName('Box6');
      Box7 = scene.getObjectByName('Box7');
      Cylinder = scene.getObjectByName('Cylinder');
      Cylinder1 = scene.getObjectByName('Cylinder1');
      Cylinder2 = scene.getObjectByName('Cylinder2');
      Cylinder3 = scene.getObjectByName('Cylinder3');
      Cylinder4 = scene.getObjectByName('Cylinder4');
      Cylinder5 = scene.getObjectByName('Cylinder5');
      Cylinder6 = scene.getObjectByName('Cylinder6');
      Cylinder7 = scene.getObjectByName('Cylinder7');
      Cylinder8 = scene.getObjectByName('Cylinder8');
      Cylinder9 = scene.getObjectByName('Cylinder9');
      Cylinder10 = scene.getObjectByName('Cylinder10');
      Cylinder11 = scene.getObjectByName('Cylinder11');
      Cylinder12 = scene.getObjectByName('Cylinder12');
      Cylinder13 = scene.getObjectByName('Cylinder13');
      Cylinder14 = scene.getObjectByName('Cylinder14');
      Cylinder15 = scene.getObjectByName('Cylinder15');
      Cylinder16 = scene.getObjectByName('Cylinder16');
      wheel = scene.getObjectByName('wheel');
      wheel1 = scene.getObjectByName('wheel1');
      wheel2 = scene.getObjectByName('wheel2');
      wheel3 = scene.getObjectByName('wheel3');
      wheel4 = scene.getObjectByName('wheel4');
      wheel5 = scene.getObjectByName('wheel5');
      wheel6 = scene.getObjectByName('wheel6');
      wheel7 = scene.getObjectByName('wheel7');


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

