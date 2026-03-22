import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import sc2kparser from './src/sc2kparser.js'

const collidables = []
const loader = new GLTFLoader();





// Enable loading-screen
const dropZone = document.getElementById("drop-zone");

dropZone.addEventListener('dragover', function(event) {
  event.preventDefault();
  event.stopPropagation();
  dropZone.classList.add('drag-over')
}, false);

dropZone.addEventListener('drop', function(event) {
  event.preventDefault();
  event.stopPropagation();
  dropZone.classList.remove('drag-over')
  document.getElementById('status').textContent = 'Parsing city file...';
  const file = event.dataTransfer.files[0];

  setTimeout(() => {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      const bytes = new Uint8Array(e.target.result);
      const struct = sc2kparser.parse(bytes);
      loadCity(struct.tiles);
    };
    fileReader.readAsArrayBuffer(file);
  }, 1500);
  
}, false);

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));


function loadCity(tiles) {
  document.getElementById('status').textContent = 'Reticulating splines...';
  console.log(tiles);

  setTimeout(() => {
    startGame();
  }, 1000);
}


// Use the status div for feedback
document.getElementById('status').textContent = 'Waiting for city file...';













// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202533);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
document.getElementById("game-screen").appendChild(renderer.domElement);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(3, 5, 2);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

// Helicopter
const helicopterObject = new THREE.Object3D();
helicopterObject.position.set(0, 1.6, 5);
scene.add(helicopterObject);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
helicopterObject.add(camera);
camera.rotation.y = Math.PI; // rotate camera to match the object's front
helicopterObject.rotation.y = Math.PI; // rotate the helicopter to face the building




// ----------- Add Objects To Scene -----------

const textureLoader = new THREE.TextureLoader();

// Floor
const floorTexture = textureLoader.load('assets/textures/grass.webp');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(20, 20);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ map: floorTexture })
);
floor.rotation.x = -Math.PI/2;
scene.add(floor);
collidables.push(floor);

// Ceiling
const ceilingTexture = textureLoader.load('assets/textures/concrete.webp');
ceilingTexture.wrapS = THREE.RepeatWrapping;
ceilingTexture.wrapT = THREE.RepeatWrapping;
ceilingTexture.repeat.set(20, 20);

const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ map: ceilingTexture })
);
ceiling.rotation.x = Math.PI/2;
scene.add(ceiling);
collidables.push(ceiling);

// Building - comment out below Models
// const wallTex = textureLoader.load('assets/textures/concrete.webp');
// wallTex.wrapS = THREE.RepeatWrapping;
// wallTex.wrapT = THREE.RepeatWrapping;
// wallTex.repeat.set(2, 3); // 2 tiles wide, 3 tiles tall

// const building = new THREE.Mesh(
//   new THREE.BoxGeometry(4, 8, 4),
//   new THREE.MeshStandardMaterial({ map: wallTex })
// );
// building.position.y = 4;
// scene.add(building);
// collidables.push(building);

// Models

loadModel(
  'assets/buildings/building-skyscraper-a.glb',
  [-2.5, 0, 0], //position
  [2, 2, 2], //scale
  [0, 0, 0], //rotation
  (modelScene) => {
    // Moved into loadModel, though might want its own function
    // modelScene.position.set(5, 0, -10);
    // modelScene.rotation.set(0, Math.PI/4, 0);
    // modelScene.scale.set(2, 2, 2);
  }
)

loadModel(
  'assets/buildings/building-skyscraper-b.glb',
  [2.5, 0, 0], //position
  [2, 2, 2], //scale
  [0, 0, 0], //rotation
  (modelScene) => {}
)

loadModel(
  'assets/roads/road-straight.glb',
  [-2, 0, 2.5], //position
  [2, 2, 2], //scale
  [0, 0, 0], //rotation
  (modelScene) => {}
)

loadModel(
  'assets/roads/road-straight.glb',
  [0, 0, 2.5], //position
  [2, 2, 2], //scale
  [0, 0, 0], //rotation
  (modelScene) => {}
)

loadModel(
  'assets/roads/road-straight.glb',
  [2, 0, 2.5], //position
  [2, 2, 2], //scale
  [0, 0, 0], //rotation
  (modelScene) => {}
)

// const loader = new GLTFLoader(); // moved to top

function loadModel(
                    path, 
                    position,
                    scale,
                    rotation,
                    onLoaded
                  ) {
  loader.load(
    //path
    path,
    //success
    (gltf) => {
      const modelScene = gltf.scene;
      scene.add(modelScene);

      modelScene.position.set(...position);
      modelScene.rotation.set(...rotation);
      modelScene.scale.set(...scale);

      modelScene.traverse((child) => {
        if (child.isMesh) {
          collidables.push(child);
        }
      });

      onLoaded(modelScene);
    },
    //progress
    null,
    //error
    (error) => console.error('Failed to load', path, error)
  );
}



// ----------- Collision -----------

// const collidables = [] // moved to top

const HELICOPTER_RADIUS = 1.6;
const raycaster = new THREE.Raycaster();

const downCollider = new THREE.Vector3(0, -1, 0);
const forwardCollider = new THREE.Vector3();
const rightCollider = new THREE.Vector3();


function checkCollisions() {
  const position = helicopterObject.position;

  // Ground/overhead check
  raycaster.set(position, downCollider);
  const downHits = raycaster.intersectObjects(collidables);
  resolveCollision(downHits, downCollider);

  const upCollider = downCollider.clone().negate();
  raycaster.set(position, upCollider);
  const upHits = raycaster.intersectObjects(collidables);
  resolveCollision(upHits, upCollider);


  // Forward/back check
  helicopterObject.getWorldDirection(forwardCollider);
  forwardCollider.normalize();

  raycaster.set(position, forwardCollider);
  const forwardHits = raycaster.intersectObjects(collidables);
  resolveCollision(forwardHits, forwardCollider);

  const backCollider = forwardCollider.clone().negate();
  raycaster.set(position, backCollider);
  const backHits = raycaster.intersectObjects(collidables);
  resolveCollision(backHits, backCollider);


  // Left/right check
  rightCollider.crossVectors(forwardCollider, upCollider).normalize();

  raycaster.set(position, rightCollider);
  const rightHits = raycaster.intersectObjects(collidables);
  resolveCollision(rightHits, rightCollider);

  const leftCollider = rightCollider.clone().negate();
  raycaster.set(position, leftCollider);
  const leftHits = raycaster.intersectObjects(collidables);
  resolveCollision(leftHits, leftCollider);
}


function resolveCollision(hits, directionVector) {
  if (hits.length > 0 && hits[0].distance < HELICOPTER_RADIUS) {
    helicopterObject.position.addScaledVector(directionVector, -(HELICOPTER_RADIUS - hits[0].distance));
  }
}






// ----------- Movement -----------

const keys = {};

window.addEventListener('keydown', (e) => { keys[e.code] = true; });
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

const SPEED = 5.0;
const TURN_SPEED = 2.0;

const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);


function moveHelicopter(deltaTime) {
  helicopterObject.getWorldDirection(forward); // direction we're facing
  forward.normalize(); // diagonal isn't faster // I could understand this more deeply for sure
  
  right.crossVectors(forward, UP).normalize();

  if (keys['ArrowUp'])   helicopterObject.position.addScaledVector(forward,  SPEED * deltaTime);
  if (keys['ArrowDown']) helicopterObject.position.addScaledVector(forward, -SPEED * deltaTime);

  if (keys['ArrowLeft']) helicopterObject.rotation.y += TURN_SPEED * deltaTime;
  if (keys['ArrowRight']) helicopterObject.rotation.y -= TURN_SPEED * deltaTime;

  if (keys['KeyA']) helicopterObject.position.addScaledVector(right, -SPEED * deltaTime);
  if (keys['KeyS']) helicopterObject.position.addScaledVector(right,  SPEED * deltaTime);

  if (keys['KeyQ']) helicopterObject.position.addScaledVector(UP,  SPEED * deltaTime);
  if (keys['KeyW']) helicopterObject.position.addScaledVector(UP,  -SPEED * deltaTime);
}






// ----------- Render Loop and Game Start -----------
let lastTime = 0;

function animate(timestamp) {
  requestAnimationFrame(animate); // recursively call it again to loop

  const delta = Math.min((timestamp - lastTime) / 1000, 0.1);
  lastTime = timestamp;

  moveHelicopter(delta);
  checkCollisions();

  renderer.render(scene, camera);
}

function startGame() {
  document.getElementById("loading-screen").style.display = 'none';
  document.getElementById("controls-panel").style.display = 'block';
  document.getElementById("game-screen").style.display = 'block';
  animate(0);
}
