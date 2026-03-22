import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import sc2kparser from './src/sc2kparser.js'

const collidables = []
const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();


// Prime loading text
document.getElementById('status').textContent = 'Waiting for city file...';

// Enable loading-screen
const demoButton = document.getElementById("demo-button");
demoButton.addEventListener('click', function(e) {
  e.preventDefault();
  console.log("Clicked demo button");
  buildDemo(startGame);
});

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
      loadCityFromTiles(struct.tiles);
    };
    fileReader.readAsArrayBuffer(file);
  }, 1500);
  
}, false);

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));


function loadCityFromTiles(tiles) {
  document.getElementById('status').textContent = 'Reticulating splines...';
  console.log(tiles);

  // iterate through tiles and fire off whatever needs to happen
  const TILE_SIZE = 1;
  const HEIGHT_SCALE = 1;
  const GRID = 128; // Math.Sqrt(tiles.length)?  Then I can make bigger cities later

  const positions = [];

  // ---------- TILE ITERATOR ----------
  for (let row = 0; row < GRID; row++) {
    for (let col = GRID - 1; col >= 0; col--) {
      const tile = tiles[row * GRID + col];
      const x = col * TILE_SIZE;
      const z = row * TILE_SIZE;

      // Generate Terrain
      const alt = (tile.alt ?? 0) / 50;  // alt comes in multiples of 50
      const slope = tile.terrain?.slope ?? [0, 0, 0, 0];

      // 4 corner heights  [topLeft, topRight, bottomLeft, bottomRight]
      const yA = (alt + slope[1]) * HEIGHT_SCALE;  // top-left
      const yB = (alt + slope[0]) * HEIGHT_SCALE;  // top-right
      const yC = (alt + slope[3]) * HEIGHT_SCALE;  // bottom-left
      const yD = (alt + slope[2]) * HEIGHT_SCALE;  // bottom-right

      const terrainX = x - (TILE_SIZE / 2); // move tile corner so x is the center
      const terrainZ = z - (TILE_SIZE / 2); // move tile corner so z is the center

      // Generate top surfaces
      // Triangle 1: A, C, D
      positions.push(terrainX,        yA, terrainZ);
      positions.push(terrainX,        yC, terrainZ + TILE_SIZE);
      positions.push(terrainX + TILE_SIZE, yD, terrainZ + TILE_SIZE);

      // Triangle 2: A, D, B
      positions.push(terrainX,        yA, terrainZ);
      positions.push(terrainX + TILE_SIZE, yD, terrainZ + TILE_SIZE);
      positions.push(terrainX + TILE_SIZE, yB, terrainZ);

      // After building the top surface of each tile, check right neighbor and generate skirt
      if (col < GRID - 1) {
        const rightTile = tiles[row * GRID + (col + 1)];
        const rightAlt = (rightTile.alt ?? 0) / 50;
        const rightSlope = rightTile.terrain?.slope ?? [0,0,0,0];

        // right edge of current tile
        const topY    = yB;  // current tile top-right
        const bottomY = yD;  // current tile bottom-right

        // left edge of right neighbor
        const rightTopY    = (rightAlt + rightSlope[1]) * HEIGHT_SCALE;
        const rightBottomY = (rightAlt + rightSlope[3]) * HEIGHT_SCALE;

        // fill the wall if there's a gap
        const wallTopY    = Math.min(topY, rightTopY);
        const wallBottomY = Math.min(bottomY, rightBottomY);

        if (topY !== rightTopY || bottomY !== rightBottomY) {
          // quad between the two edges
          positions.push(terrainX + TILE_SIZE, topY,       terrainZ);
          positions.push(terrainX + TILE_SIZE, wallTopY,   terrainZ);
          positions.push(terrainX + TILE_SIZE, wallBottomY, terrainZ + TILE_SIZE);

          positions.push(terrainX + TILE_SIZE, topY,        terrainZ);
          positions.push(terrainX + TILE_SIZE, wallBottomY, terrainZ + TILE_SIZE);
          positions.push(terrainX + TILE_SIZE, bottomY,     terrainZ + TILE_SIZE);
        }
      }

      // Check bottom neighbor
      if (row < GRID - 1) {
        const bottomTile = tiles[(row + 1) * GRID + col];
        const bottomAlt = (bottomTile.alt ?? 0) / 50;
        const bottomSlope = bottomTile.terrain?.slope ?? [0,0,0,0];

        // bottom edge of current tile
        const leftY  = yC;  // current tile bottom-left
        const rightY = yD;  // current tile bottom-right

        // top edge of bottom neighbor
        const neighborLeftY  = (bottomAlt + bottomSlope[1]) * HEIGHT_SCALE;
        const neighborRightY = (bottomAlt + bottomSlope[0]) * HEIGHT_SCALE;

        if (leftY !== neighborLeftY || rightY !== neighborRightY) {
          // Triangle 1
          positions.push(terrainX,             leftY,      terrainZ + TILE_SIZE);
          positions.push(terrainX,             neighborLeftY, terrainZ + TILE_SIZE);
          positions.push(terrainX + TILE_SIZE, neighborRightY, terrainZ + TILE_SIZE);

          // Triangle 2
          positions.push(terrainX,             leftY,       terrainZ + TILE_SIZE);
          positions.push(terrainX + TILE_SIZE, neighborRightY, terrainZ + TILE_SIZE);
          positions.push(terrainX + TILE_SIZE, rightY,      terrainZ + TILE_SIZE);
        }
      }

      // Check left neighbor
      if (col > 0) {
        const leftTile = tiles[row * GRID + (col - 1)];
        const leftAlt = (leftTile.alt ?? 0) / 50;
        const leftSlope = leftTile.terrain?.slope ?? [0,0,0,0];

        const curTopY    = yA;  // current tile top-left
        const curBottomY = yC;  // current tile bottom-left

        const neighborTopY    = (leftAlt + leftSlope[0]) * HEIGHT_SCALE;  // right edge of left neighbor
        const neighborBottomY = (leftAlt + leftSlope[2]) * HEIGHT_SCALE;

        if (curTopY !== neighborTopY || curBottomY !== neighborBottomY) {
          positions.push(terrainX, curTopY,      terrainZ);
          positions.push(terrainX, neighborTopY, terrainZ);
          positions.push(terrainX, neighborBottomY, terrainZ + TILE_SIZE);

          positions.push(terrainX, curTopY,         terrainZ);
          positions.push(terrainX, neighborBottomY, terrainZ + TILE_SIZE);
          positions.push(terrainX, curBottomY,      terrainZ + TILE_SIZE);
        }
      }

      // Check top neighbor
      if (row > 0) {
        const topTile = tiles[(row - 1) * GRID + col];
        const topAlt = (topTile.alt ?? 0) / 50;
        const topSlope = topTile.terrain?.slope ?? [0,0,0,0];

        const curLeftY  = yA;  // current tile top-left
        const curRightY = yB;  // current tile top-right

        const neighborLeftY  = (topAlt + topSlope[3]) * HEIGHT_SCALE;  // bottom edge of top neighbor
        const neighborRightY = (topAlt + topSlope[2]) * HEIGHT_SCALE;

        if (curLeftY !== neighborLeftY || curRightY !== neighborRightY) {
          positions.push(terrainX,             curLeftY,      terrainZ);
          positions.push(terrainX,             neighborLeftY, terrainZ);
          positions.push(terrainX + TILE_SIZE, neighborRightY, terrainZ);

          positions.push(terrainX,             curLeftY,       terrainZ);
          positions.push(terrainX + TILE_SIZE, neighborRightY, terrainZ);
          positions.push(terrainX + TILE_SIZE, curRightY,      terrainZ);
        }
      }




      // Create building
      const buildingId = tile.building ?? 0;

      if (buildingId === 0) { // Nothing
        // don't display anything
      }
      else if (buildingId >= 0x01 && buildingId <= 0x05) { // Rubble
        // don't display anything
      }
      else if (buildingId >= 0x06 && buildingId <= 0x0D) { // Parks
        const buildingHeight = TILE_SIZE * 0.5;
        const building = new THREE.Mesh(
          new THREE.BoxGeometry(TILE_SIZE, buildingHeight, TILE_SIZE),
          new THREE.MeshStandardMaterial({ color: 0x00FF00 })
        );
        const slopedAlt = Math.max(yA, yB, yC, yD);
        building.position.set(x, (buildingHeight / 2) + slopedAlt, z);
        scene.add(building);
        collidables.push(building);
      }
      else if (buildingId >= 0x0E && buildingId <= 0x6F) { // Road-likes
        const buildingHeight = TILE_SIZE * 0.05;
        const building = new THREE.Mesh(
          new THREE.BoxGeometry(TILE_SIZE, buildingHeight, TILE_SIZE),
          new THREE.MeshStandardMaterial({ color: 0x000000 })
        );
        const slopedAlt = Math.max(yA, yB, yC, yD);
        building.position.set(x, (buildingHeight / 2) + slopedAlt, z);
        scene.add(building);
        collidables.push(building);
      }
      else { // Regular Buildings
        const buildingHeight = TILE_SIZE * 3;
        const building = new THREE.Mesh(
          new THREE.BoxGeometry(TILE_SIZE, buildingHeight, TILE_SIZE),
          new THREE.MeshStandardMaterial({ color: 0xBBBBBB })
        );
        const slopedAlt = Math.max(yA, yB, yC, yD);
        building.position.set(x, (buildingHeight / 2) + slopedAlt, z);
        scene.add(building);
        collidables.push(building);
      }


    } // end for(col)
  } // end for(row)

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(positions), 3)
  );
  geometry.computeVertexNormals(); // needed for lighting to work

  const material = new THREE.MeshStandardMaterial({ 
    color: 0x4a7c4e,
    flatShading: true,
    wireframe: false
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  collidables.push(mesh);

  setTimeout(() => {
    startGame();
  }, 1);
}





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

// const textureLoader = new THREE.TextureLoader(); // added to top

function buildDemo(onComplete) {
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
  
  
  // Models

  const modelPaths = [
    { path: 'assets/buildings/building-skyscraper-a.glb', position: [-2.5, 0, 0], scale: [2,2,2], rotation: [0,0,0] },
    { path: 'assets/buildings/building-skyscraper-b.glb', position: [2.5, 0, 0],  scale: [2,2,2], rotation: [0,0,0] },
    { path: 'assets/roads/road-straight.glb',             position: [-2, 0, 2.5], scale: [2,2,2], rotation: [0,0,0] },
    { path: 'assets/roads/road-straight.glb',             position: [0, 0, 2.5],  scale: [2,2,2], rotation: [0,0,0] },
    { path: 'assets/roads/road-straight.glb',             position: [2, 0, 2.5],  scale: [2,2,2], rotation: [0,0,0] }
  ];
  
  let remainingModels = modelPaths.length;

  modelPaths.forEach(m => {
    loadModel(m.path, m.position, m.scale, m.rotation, () => {
      remainingModels--;
      if (remainingModels === 0) onComplete();
    });
  });
}

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

function getTerrainHeight(x, z){
  const raycaster = new THREE.Raycaster();
  raycaster.set(
    new THREE.Vector3(x, 1000, z), // position: high above the helicopter
    new THREE.Vector3(0, -1, 0) // direction: facing downwards
  );
  const hits = raycaster.intersectObjects(collidables);
  return hits.length > 0 ? hits[0].point.y : 0;
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

  if (keys['KeyI']) helicopterObject.position.addScaledVector(forward, SPEED * deltaTime * 10);
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

  helicopterObject.position.y = getTerrainHeight(helicopterObject.position.x, helicopterObject.position.z) + 1.6;

  animate(0);
}
