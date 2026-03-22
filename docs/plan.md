Cool, now that that's working, what else do I need to learn to build this game?

Great question — let me give you a map of the terrain ahead. What you need depends on what kind of game you're building, but there's a core set of concepts that almost every first-person game needs.

## Things You'll Almost Certainly Need

**Collision Detection** Right now you walk through everything. You need to detect when the player (or a projectile, etc.) intersects with geometry and stop or react. Three.js has a built-in tool for this called a **Raycaster** — it shoots an invisible ray from a point in a direction and tells you what it hits. It's the backbone of both collision and shooting mechanics.

**A Real World** Right now you have one cube and a flat floor. You'll need to learn how to build or import actual level geometry. This breaks into two paths:

- **Procedural** — building rooms, walls, and objects in code with Three.js geometry
- **Imported models** — loading files made in tools like Blender using Three.js loaders (GLTF format is the standard)

**Textures** Flat colors get old fast. Textures are images wrapped around geometry. Three.js's `TextureLoader` handles this, and it opens up a huge amount of visual richness without much complexity.

**A Game Loop with Delta Time** Right now your movement speed is tied to framerate — on a 144hz monitor you move faster than on 60hz. The fix is **delta time**: measuring how long each frame took and scaling movement by that, so speed is consistent regardless of framerate.

---

## Things You'll Need Depending on Your Game

**Enemies / NPCs** Anything that moves on its own needs some form of AI — even if it's just "walk toward the player." This involves pathfinding, state machines (idle/chase/attack), and animating 3D models.

**Shooting / Projectiles** Hitscan weapons (instant raycast from camera to first hit) are simpler than projectiles (objects that travel through space). Both use the Raycaster in different ways.

**A HUD / UI** Health bars, ammo counts, crosshairs, menus. Three.js is pure 3D, so UI is usually done in plain HTML/CSS layered on top of the canvas, or with a library like three-mesh-ui for in-world UI.

**Lighting and Shadows** Right now lights illuminate everything flatly. Real shadows require enabling the shadow map system in Three.js, which has meaningful performance implications worth understanding before you turn it on.

**Sound** The Web Audio API handles spatial audio (sounds that get quieter with distance, pan left/right based on position). Three.js has a `THREE.Audio` and `THREE.PositionalAudio` system that wraps this.

---

One More Thing: Helicopter Feel
Since you're building a heli sim, delta time also opens the door to acceleration and momentum — which is what makes helicopters feel different from walking. Instead of moving at a fixed speed when a key is held, you'd maintain a velocity vector that keys push against, and apply drag each frame to bleed it off. That's a natural next step after collision if you want it. The structure would look like:

```
const velocity = new THREE.Vector3();
const DRAG = 0.9; // multiplied each frame — bleeds velocity off over time

// in moveCamera:
if (keys['ArrowUp']) velocity.addScaledVector(forward, ACCEL * delta);
velocity.multiplyScalar(Math.pow(DRAG, delta * 60)); // framerate-independent drag
yawObject.position.add(velocity);
```

---

**Technical foundations you'll hit soon**
- **Asset loading screen / loading manager** — right now models and textures load asynchronously and the game just starts whenever. Three.js has a `LoadingManager` that tracks all pending loads and fires a callback when everything is ready. You'll want this before the world gets much bigger.
- **Scene graph organization** — as you add more objects, dumping everything into `scene` gets unwieldy. You'll want to group things logically (all buildings in a `buildingsGroup`, all NPCs in an `npcsGroup`, etc.) for both organization and performance.
- **Performance / culling** — a full city will have hundreds of objects. You'll need to only render what's near the helicopter. Three.js has frustum culling built in but you may also want distance-based culling or level-of-detail (LOD).

**Gameplay systems you're missing**
- **Save/load** — even just writing city state to `localStorage` so you don't lose progress
- **Time of day** — SimCopter had this and it changes the feel dramatically. Rotating directional light + skybox color shift
- **Win/fail conditions** — what ends a mission? Timer? Score threshold?
- **Pedestrian/traffic simulation** — citizens need simple pathfinding along roads, cars need to follow routes

**Game feel**
- **Screen shake** — for crashes, explosions, near misses. Huge impact on arcade feel for minimal effort
- **Minimap** — almost essential for a city navigation game
- **Visual feedback** — numbers floating up, flashes, particles when you complete a mission action

---

## Questions Worth Answering Early

**"Multiple squares equal one building"** — this is the hardest design problem on your list and worth thinking through now before you build the city loader. SimCopter solved it by having a separate building footprint layer. One approach: store large buildings as occupying multiple cells but anchored to one "origin" cell, with the others marked as "occupied by [origin coords]".

**The `.sc2` file idea** — SimCity 2000 files are a real, documented format. People have reverse engineered them. That's an ambitious but very cool goal.

**"Exiting the helicopter"** — this means building a full on-foot movement and collision system essentially separate from the helicopter system. Worth scoping carefully — it's a significant chunk of work.

---

## One Design Observation

Your mission list (megaphone traffic jam, fire bucket) are both _reactive_ missions — something goes wrong and you fix it. SimCopter also had _proactive_ tasks like taxi/transport missions which give the player something to do between emergencies. Worth considering as a third mission type for pacing variety.

Overall though this is a well-thought-out plan for a solo project. The city-from-file system is the right next big technical challenge after textures — everything else depends on having a real world to play in.

---

## The Suggested Learning Order

If I were building this from where you are now, I'd tackle things in roughly this sequence:

1. **Delta time** — fix this now before bad habits set in, it's a small change
2. **Textures** — big visual payoff for low complexity, keeps motivation up
3. **Raycaster + basic collision** — suddenly the world feels solid
4. **Imported geometry** — load a real room instead of a cube
5. **Shadows** — makes everything look dramatically more real
6. **Shooting** — the fun begins
7. **Enemies** — the game begins
