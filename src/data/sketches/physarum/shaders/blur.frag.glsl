uniform sampler2D uSource;
uniform vec2 uDirection; // one texel along the blur axis

varying vec2 vUv;

// 9-tap Gaussian folded into 5 bilinear fetches
void main() {
  vec2 o1 = uDirection * 1.3846153846;
  vec2 o2 = uDirection * 3.2307692308;
  vec4 sum = texture2D(uSource, vUv) * 0.2270270270;
  sum += (texture2D(uSource, vUv + o1) + texture2D(uSource, vUv - o1)) * 0.3162162162;
  sum += (texture2D(uSource, vUv + o2) + texture2D(uSource, vUv - o2)) * 0.0702702703;
  gl_FragColor = sum;
}
