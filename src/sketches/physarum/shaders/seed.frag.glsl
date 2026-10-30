#include ../../../lib/shaders/hash.glsl

uniform float uSeed;

#define TAU 6.28318530718

// Agent state: xy = position (0-1), z = heading (radians), w = hunger (0-1, how strongly it smells
// food); scattered across the whole map
void main() {
  vec3 h = hash3(gl_FragCoord.xy, uSeed);
  gl_FragColor = vec4(h.xy, h.z * TAU, 0.0);
}
