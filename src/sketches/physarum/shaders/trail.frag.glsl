uniform sampler2D uTrail;
uniform vec2 uMapSize;
uniform float uDiffuse;
uniform float uRetain;
uniform float uFoodRetain;
uniform vec2 uBrush[5]; // brush path over this step (map px)
uniform float uFeed;
uniform float uFeedDwell;
uniform float uFeedRadius;
uniform float uFoodMax;
uniform vec4 uRipples[4];
uniform float uRippleWidth;

varying vec2 vUv;

// Winitzki's approximation, ample for a soft brush
float erfApprox(float x) {
  float x2 = x * x;
  return sign(x) * sqrt(1.0 - exp(-x2 * (1.2732395 + 0.147 * x2) / (1.0 + 0.147 * x2)));
}

// A Gaussian brush swept along a segment, normalised so a long stroke lays the same food per unit
// length at any speed: fast strokes don't bead and slow ones don't blob
float sweptBrush(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float len = length(ab);
  if (len < 1e-3) return 0.0;
  vec2 dir = ab / len;
  vec2 pa = p - a;
  float along = dot(pa, dir) / uFeedRadius;
  float across = (pa.x * dir.y - pa.y * dir.x) / uFeedRadius;
  if (abs(across) > 3.0 || along < -3.0 || along > len / uFeedRadius + 3.0) return 0.0;
  return exp(-across * across) * 0.5 * (erfApprox(along) - erfApprox(along - len / uFeedRadius));
}

// Channels: r = trail, g = food laid by the pointer
void main() {
  vec2 texel = 1.0 / uMapSize;
  vec4 centre = texture2D(uTrail, vUv);
  vec4 sum = vec4(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      sum += texture2D(uTrail, vUv + vec2(x, y) * texel);
    }
  }
  vec4 trail = mix(centre, sum / 9.0, uDiffuse) * vec4(uRetain, uFoodRetain, 0.0, 0.0);

  vec2 p = vUv * uMapSize;
  if (uFeed > 0.0) {
    float food = 0.0;
    for (int i = 0; i < 4; i++) food += sweptBrush(p, uBrush[i], uBrush[i + 1]);
    vec2 rest = (p - uBrush[4]) / uFeedRadius;
    food = uFeed * food + uFeedDwell * exp(-dot(rest, rest));
    trail.g += food * max(0.0, 1.0 - trail.g / uFoodMax);
  }

  // Ripples leave a dark wake behind their front
  for (int i = 0; i < 4; i++) {
    vec4 ripple = uRipples[i];
    if (ripple.w <= 0.0) continue;
    float behind = ripple.z - distance(p, ripple.xy);
    float wake = smoothstep(0.0, uRippleWidth, behind) * (1.0 - smoothstep(uRippleWidth, uRippleWidth * 4.0, behind));
    trail.r *= 1.0 - wake * ripple.w * 0.6;
  }

  gl_FragColor = trail;
}
