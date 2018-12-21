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

var camera;
var scene;
var renderer;
var light;
var ambLight;

var obs = [];
var tank = null;
var armor = null;
var mine = null;
var fuel_tank = null;
var obstacle;
var destroied = false;
var paused = false;
var power_up = false;
var planeMesh =null;
var height, width, fov, aspect, near, far;
var animation;

var NUM_LOADED = 0;
var TANK_LOADED = false;

height = 600;
width = 900;

fov = 45;
aspect = width/height;
near = 0.1; far = 10000;

function init(){
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.y = 5;
  camera.position.z = 30;
  light = new THREE.DirectionalLight(0xFFFFFF, 0.75);
  light.position.set(0,200, 40);
  scene = new THREE.Scene();
  scene.add(camera);
  scene.add(light);
  ambLight = new THREE.AmbientLight(0x404040);
  scene.add(ambLight);
  document.querySelector('#game_ifrm').appendChild(renderer.domElement)
}

function loadScene(){
    planeMesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(400,550 ,32),
    new THREE.MeshPhongMaterial({color: 0x085A14, side: THREE.DoubleSide})
  )
  planeMesh.rotation.x = -1.58
  planeMesh.scale.set(5, 5)
  planeMesh.position.set(0,0,0)
  scene.add(planeMesh)
}

function start_game() {
  document.getElementById("playBTN").style.display='none';
  document.getElementById("start_game").style.display='block';
  document.getElementById("game_ifrm").style.display='block';

}

function addTank(){
  var loader = new THREE.ObjectLoader();
  loader.load("models/tank/tank.json",
    function (obj){
      tank = obj;
      TANK_LOADED = true;
      NUM_LOADED++;
      tank.position.z = -5.5;
      tank.position.y = 0.58;
      tank.scale.x = tank.scale.y = tank.scale.z =0.7;
      car.is_ob = true;
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
    }                );


}

init();
loadScene();

