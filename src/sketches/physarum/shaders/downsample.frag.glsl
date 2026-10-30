uniform sampler2D uSource;
uniform vec2 uSourceTexel;

varying vec2 vUv;

// Four bilinear taps average the 4x4 block of source texels under this pixel
void main() {
  vec2 o = uSourceTexel;
  gl_FragColor = 0.25 * (
    texture2D(uSource, vUv + vec2(-o.x, -o.y)) +
    texture2D(uSource, vUv + vec2(o.x, -o.y)) +
    texture2D(uSource, vUv + vec2(-o.x, o.y)) +
    texture2D(uSource, vUv + vec2(o.x, o.y))
  );
}
