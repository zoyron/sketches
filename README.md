# Threejs Sketches

I like making threejs sketches and showing them to people on the internet, but there was no one place where I can collect them all.

So, here I present to you all my dumping ground for threejs sketches.

Visit the site [here](https://sketches-sarlloc.vercel.app).

This project is made using typescript. But the sketches use a lot of glsl as well. 

### The current few sketches are:

> Will keep adding more and more with time.

|   |   |   |
|---|---|---|
| [![Physarum](./src/sketches/physarum/thumbnail.png)](https://sketches-sarlloc.vercel.app/sketch/physarum)<br>[Physarum](https://sketches-sarlloc.vercel.app/sketch/physarum) | [![Fluid](./src/sketches/fluid-simulation/thumbnail.png)](https://sketches-sarlloc.vercel.app/sketch/fluid-simulation)<br>[Fluid](https://sketches-sarlloc.vercel.app/sketch/fluid-simulation) | [![Black hole](./src/sketches/blackhole/thumbnail.png)](https://sketches-sarlloc.vercel.app/sketch/blackhole)<br>[Black hole](https://sketches-sarlloc.vercel.app/sketch/blackhole) |
| [![Dandelions](./src/sketches/dandelions/thumbnail.png)](https://sketches-sarlloc.vercel.app/sketch/dandelions)<br>[Dandelions](https://sketches-sarlloc.vercel.app/sketch/dandelions) | [![Blobby Earth](./src/sketches/blobby-earth/thumbnail.png)](https://sketches-sarlloc.vercel.app/sketch/blobby-earth)<br>[Blobby Earth](https://sketches-sarlloc.vercel.app/sketch/blobby-earth) | [![Neurons](./src/sketches/neurons/thumbnail.png)](https://sketches-sarlloc.vercel.app/sketch/neurons)<br>[Neurons](https://sketches-sarlloc.vercel.app/sketch/neurons) |
| [![Sparkling Sphere](./src/sketches/sparkling-sphere/thumbnail.png)](https://sketches-sarlloc.vercel.app/sketch/sparkling-sphere)<br>[Sparkling Sphere](https://sketches-sarlloc.vercel.app/sketch/sparkling-sphere) | [![Particle Sphere](./src/sketches/particle-sphere/thumbnail.png)](https://sketches-sarlloc.vercel.app/sketch/particle-sphere)<br>[Particle Sphere](https://sketches-sarlloc.vercel.app/sketch/particle-sphere) | [![Interactive Cubes](./src/sketches/cubes/thumbnail.png)](https://sketches-sarlloc.vercel.app/sketch/cubes)<br>[Interactive Cubes](https://sketches-sarlloc.vercel.app/sketch/cubes) |
| [![Interactive Earth](./src/sketches/interactive-earth/thumbnail.png)](https://sketches-sarlloc.vercel.app/sketch/interactive-earth)<br>[Interactive Earth](https://sketches-sarlloc.vercel.app/sketch/interactive-earth) | [![Galaxy](./src/sketches/galaxy/thumbnail.png)](https://sketches-sarlloc.vercel.app/sketch/galaxy)<br>[Galaxy](https://sketches-sarlloc.vercel.app/sketch/galaxy) | [![Sparkling Particles](./src/sketches/sparkling-particles/thumbnail.png)](https://sketches-sarlloc.vercel.app/sketch/sparkling-particles)<br>[Sparkling Particles](https://sketches-sarlloc.vercel.app/sketch/sparkling-particles) |

### Adding a sketch

Copy `src/sketches/_template` to `src/sketches/<name>`. The folder name becomes the URL, and the sketch shows up in the gallery on its own.

Then in the new folder:

- `meta.ts` has the title, description and so on. Give it the next `order` number above the current highest, which lists it first.
- Replace `thumbnail.png` with a screenshot of the sketch.
- Build the sketch in the `useThreeCanvas` callback. The hook looks after the renderer, the animation loop, resizing and cleaning up, so the sketch only describes its scene and what changes every frame.
