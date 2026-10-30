uniform float uFoodDeposit;

varying float vHunger;

// Each agent adds one unit of trail, more while it is closing in on food; food is left untouched
void main() {
  gl_FragColor = vec4(1.0 + uFoodDeposit * vHunger, 0.0, 0.0, 0.0);
}
