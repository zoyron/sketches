import { Sketch } from "../types/Sketch";
import Galaxy from "./sketches/galaxy/Galaxy";
import SparklingParticles from "./sketches/SparklingParticles";
import HomePage from "./sketches/HomePage";
import InteractiveCubes from "./sketches/InteractiveCubes";
import EarthSphere from "./sketches/blobbyEarth/Earth";
import InteractiveEarth from "./sketches/particlesEarth/InteractiveEarth";
import ParticleSphere from "./sketches/ParticleSphere";
import Neurons from "./sketches/Neurons";
import SparklingSphere from "./sketches/SparklingSphere";
import DandelionScene from "./sketches/Dandelions";
import BlackHole from "./sketches/BlackHole";
import FluidSimulation from "./sketches/FluidSimulation";

// Homepage is separate - not part of the sketches collection
export const homepage: Sketch = {
  id: "homepage",
  title: "Welcome",
  author: "Sagar",
  thumbnailURL: "/sidebar/welcome.png",
  component: HomePage,
  description: "A welcoming gateway to the Digital Atelier, showcasing the collection of WebGL experiments.",
  technologies: ["React", "Three.js", "React Three Fiber"],
};

const sketches: Sketch[] = [
  {
    id: "fluid-simulation",
    title: "Fluid",
    author: "Sagar",
    thumbnailURL: "/sidebar/fluid.png",
    component: FluidSimulation,
    description: "An interactive fluid dynamics simulation with realistic physics and customizable color trails.",
    technologies: ["Three.js", "GLSL", "React Three Fiber", "FBO"],
    sourceCodeUrl: "https://github.com/zoyron/sketches/blob/main/src/data/sketches/FluidSimulation.tsx",
  },
  {
    id: "blackhole",
    title: "Black hole",
    author: "Sagar",
    thumbnailURL: "/sidebar/blackhole.png",
    component: BlackHole,
    description: "A mesmerizing simulation of gravitational forces and light bending around a black hole's event horizon.",
    technologies: ["Three.js", "GLSL", "React Three Fiber"],
    sourceCodeUrl: "https://github.com/zoyron/sketches/blob/main/src/data/sketches/BlackHole.tsx",
  },
  {
    id: "dandelions",
    title: "Dandelions",
    author: "Sagar",
    thumbnailURL: "/sidebar/dandelions.png",
    component: DandelionScene,
    description: "An ethereal field of dandelions with interactive wind physics and particle systems.",
    technologies: ["Three.js", "React Three Fiber", "GLSL"],
    sourceCodeUrl: "https://github.com/zoyron/sketches/blob/main/src/data/sketches/Dandelions.tsx",
  },
  {
    id: "blobby-earth",
    title: "Blobby Earth",
    author: "Sagar",
    thumbnailURL: "/sidebar/blobbyEarth.png",
    component: EarthSphere,
    description: "A fluid, organic representation of Earth with morphing surface topology and atmospheric effects.",
    technologies: ["Three.js", "GLSL", "Simplex Noise"],
    sourceCodeUrl: "https://github.com/zoyron/sketches/blob/main/src/data/sketches/blobbyEarth/Earth.tsx",
  },
  {
    id: "neurons",
    title: "Neurons",
    author: "Sagar",
    thumbnailURL: "/sidebar/neurons.png",
    component: Neurons,
    description: "A neural network visualization with pulsing nodes and electric connections simulating brain activity.",
    technologies: ["Three.js", "React Three Fiber", "GLSL"],
    sourceCodeUrl: "https://github.com/zoyron/sketches/blob/main/src/data/sketches/Neurons.tsx",
  },
  {
    id: "sparkling-sphere",
    title: "Sparkling Sphere",
    author: "Sagar",
    thumbnailURL: "/sidebar/sparklingSphere.png",
    component: SparklingSphere,
    description: "A luminous sphere composed of thousands of sparkling particles with dynamic lighting effects.",
    technologies: ["Three.js", "GLSL", "Particle Systems"],
    sourceCodeUrl: "https://github.com/zoyron/sketches/blob/main/src/data/sketches/SparklingSphere.tsx",
  },
  {
    id: "particle-sphere",
    title: "Particle Sphere",
    author: "Sagar",
    thumbnailURL: "/sidebar/particleSphere.png",
    component: ParticleSphere,
    description: "An interactive particle system forming a sphere with fluid motion and gravitational attraction.",
    technologies: ["Three.js", "React Three Fiber", "GLSL"],
    sourceCodeUrl: "https://github.com/zoyron/sketches/blob/main/src/data/sketches/ParticleSphere.tsx",
  },
  {
    id: "cubes",
    title: "Interactive Cubes",
    author: "Sagar",
    thumbnailURL: "/sidebar/interactiveCubes.png",
    component: InteractiveCubes,
    description: "A responsive 3D cube field that reacts to mouse movements with smooth transformations.",
    technologies: ["Three.js", "React Three Fiber", "lil-gui"],
    sourceCodeUrl: "https://github.com/zoyron/sketches/blob/main/src/data/sketches/InteractiveCubes.tsx",
  },
  {
    id: "interactive-earth",
    title: "Interactive Earth",
    author: "Sagar",
    thumbnailURL: "/sidebar/interactiveEarth.png",
    component: InteractiveEarth,
    description: "A detailed Earth visualization with particle clouds, atmospheric glow, and interactive rotation.",
    technologies: ["Three.js", "GLSL", "Particle Systems"],
    sourceCodeUrl: "https://github.com/zoyron/sketches/blob/main/src/data/sketches/particlesEarth/InteractiveEarth.tsx",
  },
  {
    id: "galaxy",
    title: "Galaxy",
    author: "Sagar",
    thumbnailURL: "/sidebar/galaxy.png",
    component: Galaxy,
    description: "A procedurally generated spiral galaxy with millions of stars and cosmic dust effects.",
    technologies: ["Three.js", "GLSL", "Procedural Generation"],
    sourceCodeUrl: "https://github.com/zoyron/sketches/blob/main/src/data/sketches/galaxy/Galaxy.tsx",
  },
  {
    id: "sparkling-particles",
    title: "Sparkling Particles",
    author: "Sagar",
    thumbnailURL: "/sidebar/particles.png",
    component: SparklingParticles,
    description: "An ambient particle cloud with shimmering effects and smooth orbital motion patterns.",
    technologies: ["Three.js", "GLSL", "Particle Systems"],
    sourceCodeUrl: "https://github.com/zoyron/sketches/blob/main/src/data/sketches/SparklingParticles.tsx",
  },
];

export default sketches;
