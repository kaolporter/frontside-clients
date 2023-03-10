import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { TransformControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/TransformControls.js'
import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(1000, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 10;




const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio)

document.body.appendChild(renderer.domElement);

new TransformControls(camera, renderer.domElement);

let model;
//load prefabbed dodeca
function loadGLTB(){

const gltLoader = new GLTFLoader();
gltLoader.load('clients2.gltf', function (gltf) {

  scene.add(gltf.scene);
  model = gltf.scene;


},
  function (xhr) {

    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

  },
  // called when loading has errors
  function (error) {

    console.log('An error happened');

  });
}
loadGLTB();


var greyMat = new THREE.MeshPhongMaterial({
  color: new THREE.Color("rgb(125,127,129)"),
  emissive: new THREE.Color("rgb(125,127,129)"),
  specular: new THREE.Color("rgb(125,127,129)"),
  shininess: "100000000",
  flatShading: true,
  transparent: 1,
  opacity: 1
});


const light = new THREE.DirectionalLight(0xffffff, 1)

light.position.set(5, 1, 50)

scene.add(light)



renderer.render(scene, camera)

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  try {
    model.rotation.x += .001
    model.rotation.y += .002
    model.scale.set(1,1,1);
  } catch (error) { console.log(error) }
}

animate();

/* */
var isDragging = false;
var previousMousePosition = {
  x: 0,
  y: 0
};
renderer.domElement.onmousedown = function (e) {
  isDragging = true;
  console.log(isDragging);

}

renderer.domElement.onmousemove = function (e) {
  console.log(e);
  var deltaMove = {
    x: e.offsetX - previousMousePosition.x,
    y: e.offsetY - previousMousePosition.y
  };

  if (isDragging) {

    var deltaRotationQuaternion = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(
        toRadians(deltaMove.y * .09),
        toRadians(deltaMove.x * .09),
        0,
        'XYZ'
      ));

    model.quaternion.multiplyQuaternions(deltaRotationQuaternion, model.quaternion);
  }

  previousMousePosition = {
    x: e.offsetX,
    y: e.offsetY
  };
}

/* */

renderer.domElement.onmouseup = function (e) {
  isDragging = false;
}



// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();


function toRadians(degrees) {
  return degrees * (Math.PI / 180) * -1;
}


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}