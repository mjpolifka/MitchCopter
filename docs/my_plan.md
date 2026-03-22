# The Plan

## Original Learning Order

7. **Shadows** — makes everything look dramatically more real
8. **Shooting** — the fun begins - maybe more like "water bucket"
9. **Enemies** — the game begins - maybe more like "citizens"

### Other Things We'll Need

- Load city from .sc2 file
  - ~~2x2 array for coords~~
  - ✔iterate through tiles returned from sc2kparser and build the world
  - data includes: altitude, slope, building id, rotation, is_water, is_saltwater, corner data, underground
    - ✔have to figure out slope
    - ✔have to figure out corners
      - ✔corners seem to match iteration style, but map is 90deg off and flipped
        - ✔file iterates right-to-left for w/e reason
  - using this, build prototypes on each other:
    - ✔altitude squares
    - ✔slope them
    - ✔add buildings as colored boxes to verify map is correct
      - ✔refactor loadCityFromTiles for readability
      - ✔buildingIds
        - ✔00 is nothing
          - ✔don't render anything
        - ✔01-05 are destroyed
          - ✔don't render anything (for now)
        - ✔06-0D are parks
          - ✔short green block
        - ✔0E-6F are infrastructure
          - ✔very short black block
        - ✔the rest are basically buildings
          - ✔standard grey block
    - ✔fix terrain issues
    - >how do we do the water?
    - compare with original and fix scaling, check terrain
    - model aggregate buildings as single object
      - the iterator is going to have to remember stuff
      - can place the model using the first corner we come across
      - but need to know what to not place later
    - add tunnels and subways
    - fix bridges
- Controls toggle (classic <-> modern)
- Helicopter visual model (simple)
- Physics model (speed, acceleration, inertia)
- Multiple cameras (down view, 3rd-person view)
- HUD/UI
- Car traffic -> Traffic Jam mission
- Citizens -> Transport mission
- Exiting the helicopter, walking on foot -> Medevac mission
- Fire bucket -> Fire mission
- Custom assets
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

### Altitude Squares (+Slope)

- ✔include sc2kparser
  - ✔figure out ISC attribution requirements
- ✔parse city into tiles
  - ✔create "loading screen"
  - ✔parse a file to console
  - ✔switch screens
- ~~create altitude vertex map from tiles~~
- ~~iterate through map creating "floors" at the right altitude~~
- ✔iterate through the tiles and create terrain at the right altitude and slope
  - ✔divide the altitude data by 50 to get "1's"
  - ✔use BufferGeometry and don't make 16k objects
- ✔before merging back to "mitch" for deployment, make a button to use the old demo instead of an .sc2 file