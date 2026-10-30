#include ../../../lib/shaders/hash.glsl

uniform sampler2D uTrail;
uniform sampler2D uBloom;
uniform vec3 uLow;
uniform vec3 uMid;
uniform vec3 uHigh;
uniform float uExposure;
uniform float uGlow;
uniform float uFoodGlow;
uniform float uFade;
uniform float uFrame;

varying vec2 vUv;

vec3 ramp(float x) {
  vec3 col = uLow * smoothstep(0.0, 0.25, x);
  col = mix(col, uMid, smoothstep(0.15, 0.6, x));
  return mix(col, uHigh, smoothstep(0.6, 1.0, x));
}

void main() {
  float trail = texture2D(uTrail, vUv).r;
  vec2 halo = texture2D(uBloom, vUv).rg;

  vec3 col = ramp(1.0 - exp(-trail * uExposure)) + uMid * (1.0 - exp(-halo.r * uExposure)) * uGlow;
  // Fresh food glows faintly through the blurred bloom map, a scent the colony is closing in on
  col += uMid * (1.0 - exp(-halo.g)) * uFoodGlow;

  // Soft vignette keeps the eye in the middle
  vec2 q = vUv - 0.5;
  col *= 1.0 - dot(q, q) * 0.6;

  gl_FragColor = vec4(col * uFade, 1.0);
  #include <colorspace_fragment>

  // Dither after encoding so it stays one 8-bit step, hiding banding in the dark gradients
  gl_FragColor.rgb += (hash3(gl_FragCoord.xy, uFrame).x - 0.5) / 255.0;
}
