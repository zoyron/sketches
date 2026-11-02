varying vec3 vColor;

void main() {
  float strength = distance(gl_PointCoord, vec2(0.5));

  // difused disc
  //strength *= 2.0;
  //strength = 1.0 - strength;

  // Light point using pow method
  strength = 1.0 - strength;
  strength = pow(strength, 10.0);

  // final 
  vec3 color = mix(vec3(0.0), vColor, vec3(strength));

  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
