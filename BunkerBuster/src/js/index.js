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

init();
loadScene();

