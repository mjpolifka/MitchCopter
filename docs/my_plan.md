# The Plan

## Original Learning Order

7. **Shadows** — makes everything look dramatically more real
8. **Shooting** — the fun begins - maybe more like "water bucket"
9. **Enemies** — the game begins - maybe more like "citizens"

### Other Things We'll Need

- Load city from .sc2 file
  - 2x2 array for coords
  - data includes: altitude, slope, asset id, rotation, is_water, is_saltwater, corner data, underground
    - have to figure out slope
    - have to figure out corners
      - topRight = DP121
      - bottomLeft = DR119
      - topLeft = DP119
      - bottomRight = DR121
  - using this, build prototypes on each other:
    - altitude squares
    - slope them
    - add water w/ color
    - add building ids w/ color
    - model aggregate buildings
    - add kenney assets
  - then create my own assets
- Controls toggle (classic <-> modern)
- Helicopter visual model
- Physics model (speed, acceleration, inertia)
- Multiple cameras (down view, 3rd-person view)
- HUD/UI
- Mission loops
  - Traffic Jam (use megaphone)
  - Fire (use bucket)
- Exiting the helicopter, walking on foot
- Store/Upgrades
- Sounds and music
  - Funny commercials are required
- Skybox
- Edge of the world: loop? collide? oblivion?
- Fuel

### Things That Came Up That We Might Not Need

- Swept collision (clipping an edge b/c you're going too fast)
- Collision performance, use simplified "collision mesh" instead of actual geometry

### Things We've Done

1. **Basic Boilerplate** - Scene, Camera, Renderer, cube for visuals, Lights, render loop
2. **Keyboard movement** - moveCamera function that detects if a key is held down each frame
3. **Delta time** — fix this now before bad habits set in, it's a small change
4. **Basic collision** — Suddenly the world feels solid
5. **Imported geometry** — load a real city to fly through (models from kenney.nl)
6. **Textures** — big visual payoff for low complexity

### Altitude Squares

- ✔include sc2kparser
  - ✔figure out ISC attribution requirements
- ✔parse city into tiles
  - ✔create "loading screen"
  - ✔parse a file to console
  - ✔switch screens
- >create altitude vertex map from tiles
- iterate through map creating "floors" at the right altitude
  - divide the altitude data by 50 to get "1's"
  - use BufferGeometry and don't make 16k objects