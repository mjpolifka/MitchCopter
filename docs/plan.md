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

## The Suggested Learning Order

If I were building this from where you are now, I'd tackle things in roughly this sequence:

1. **Delta time** — fix this now before bad habits set in, it's a small change
2. **Textures** — big visual payoff for low complexity, keeps motivation up
3. **Raycaster + basic collision** — suddenly the world feels solid
4. **Imported geometry** — load a real room instead of a cube
5. **Shadows** — makes everything look dramatically more real
6. **Shooting** — the fun begins
7. **Enemies** — the game begins

## My Learning Order

5. **Imported geometry** — load a real city to fly through (models from kenney.nl)
6. **Textures** — big visual payoff for low complexity
7. **Shadows** — makes everything look dramatically more real
8. **Shooting** — the fun begins - maybe more like "water bucket"
9. **Enemies** — the game begins - maybe more like "citizens"

### Other Things We'll Need

- Helicopter visual model
- Physics model (speed, acceleration, inertia)
- Multiple cameras (down view, 3rd-person view)
- HUD/UI
- Mission loops
- Store/Upgrades

### Things That Came Up That We Might Not Need

- Swept collision (clipping an edge b/c you're going too fast)
- Collision performance, use simplified "collision mesh" instead of actual geometry

### Things We've Done

1. **Basic Boilerplate** - Scene, Camera, Renderer, cube for visuals, Lights, render loop
2. **Keyboard movement** - moveCamera function that detects if a key is held down each frame
3. **Delta time** — fix this now before bad habits set in, it's a small change
4. **Basic collision** — Suddenly the world feels solid