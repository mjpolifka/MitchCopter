import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// 1) Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202533);

// 2) Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.6, 5); // eye-height-ish

// 3) Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4) Something visible (cube)
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 10, 1),
  new THREE.MeshStandardMaterial({ color: 0x44aa88 })
);
scene.add(cube);

// 5) Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(3, 5, 2);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

// 6) Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x334455 })
);
floor.rotation.x = -Math.PI/2;
scene.add(floor);





// Movement

const keys = {};

window.addEventListener('keydown', (e) => { keys[e.code] = true; });
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

const SPEED = 5.0;
const TURN_SPEED = 2.0;

const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);



function moveCamera(deltaTime) {
  camera.getWorldDirection(forward); // direction we're facing
  forward.normalize(); // diagonal isn't faster
  
  right.crossVectors(forward, UP).normalize();

  if (keys['ArrowUp'])   camera.position.addScaledVector(forward,  SPEED * deltaTime);
  if (keys['ArrowDown']) camera.position.addScaledVector(forward, -SPEED * deltaTime);

  if (keys['ArrowLeft']) camera.rotation.y += TURN_SPEED * deltaTime;
  if (keys['ArrowRight']) camera.rotation.y -= TURN_SPEED * deltaTime;

  if (keys['KeyA']) camera.position.addScaledVector(right, -SPEED * deltaTime);
  if (keys['KeyS']) camera.position.addScaledVector(right,  SPEED * deltaTime);

  if (keys['KeyQ']) camera.position.addScaledVector(UP,  SPEED * deltaTime);
  if (keys['KeyW']) camera.position.addScaledVector(UP,  -SPEED * deltaTime);

  camera.position.y = Math.max(1.6, camera.position.y); // floor clamp
}





// ---- Render loop ----
function animate(timestamp) {
  requestAnimationFrame(animate); // recursively call it again to loop

  const delta = Math.min((timestamp - lastTime) / 1000, 0.1);
  lastTime = timestamp;

  moveCamera(delta);
  renderer.render(scene, camera);
}

// Initialize
let lastTime = 0;
animate(0);

