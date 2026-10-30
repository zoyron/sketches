#include ../../../lib/shaders/hash.glsl

uniform sampler2D uAgents;
uniform sampler2D uTrail;
uniform vec2 uMapSize;
uniform float uFrame;
uniform float uSensorAngle;
uniform float uSensorOffset;
uniform float uTurnAngle;
uniform float uStepSize;
uniform float uJitter;
uniform float uFoodAttraction;
uniform float uFoodSensorOffset;
uniform float uFoodSurge;
uniform float uRespawn;
uniform vec4 uRipples[4]; // xy = centre (map px), z = radius (px), w = strength
uniform float uRippleWidth;
uniform float uRippleSpeed;

varying vec2 vUv;

#define TAU 6.28318530718

// Trail map: r = trail, g = food laid by the pointer. Food is smelled from further away than
// trail is seen, so a stroke recruits agents from well beyond its own width
vec2 sense(vec2 pos, float angle) {
  vec2 dir = vec2(cos(angle), sin(angle));
  float trail = texture2D(uTrail, (pos + dir * uSensorOffset) / uMapSize).r;
  float food = texture2D(uTrail, (pos + dir * uFoodSensorOffset) / uMapSize).g;
  return vec2(trail + food * uFoodAttraction, food);
}

void main() {
  vec4 agent = texture2D(uAgents, vUv);
  vec2 pos = agent.xy * uMapSize;
  float heading = agent.z;

  vec2 senseFront = sense(pos, heading);
  vec2 senseLeft = sense(pos, heading + uSensorAngle);
  vec2 senseRight = sense(pos, heading - uSensorAngle);
  float front = senseFront.x;
  float left = senseLeft.x;
  float right = senseRight.x;

  vec3 rnd = hash3(gl_FragCoord.xy, uFrame);

  // Jones (2010): steer towards the strongest chemoattractant
  if (front > left && front > right) {
    // Keep going straight
  } else if (front < left && front < right) {
    heading += (rnd.x < 0.5 ? -1.0 : 1.0) * uTurnAngle;
  } else if (left > right) {
    heading += uTurnAngle;
  } else if (right > left) {
    heading -= uTurnAngle;
  }
  heading += (rnd.y - 0.5) * uJitter;

  // Agents that smell food hurry, so the colony visibly rushes in; they calm down as it fades
  float hunger = smoothstep(0.0, 0.6, max(senseFront.y, max(senseLeft.y, senseRight.y)));
  float speed = uStepSize * (1.0 + uFoodSurge * hunger);
  pos += vec2(cos(heading), sin(heading)) * speed;

  // Ripples sweep agents outward and carry them on the wavefront
  for (int i = 0; i < 4; i++) {
    vec4 ripple = uRipples[i];
    if (ripple.w <= 0.0) continue;
    vec2 away = pos - ripple.xy;
    float dist = length(away);
    float band = 1.0 - smoothstep(0.0, uRippleWidth, abs(dist - ripple.z));
    if (dist > 0.0 && rnd.z < band * ripple.w) {
      heading = atan(away.y, away.x);
      pos += away / dist * uRippleSpeed;
    }
  }

  // A trickle of agents respawns at random so bare ground keeps sprouting new filaments;
  // without it the labyrinth slowly coarsens into a few thick veins
  vec3 spawn = hash3(gl_FragCoord.xy + 8192.0, uFrame);
  if (spawn.x < uRespawn) {
    vec3 at = hash3(gl_FragCoord.xy + 16384.0, uFrame);
    pos = at.xy * uMapSize;
    heading = at.z * TAU;
  }

  gl_FragColor = vec4(fract(pos / uMapSize), mod(heading, TAU), hunger);
}
