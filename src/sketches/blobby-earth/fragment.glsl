uniform sampler2D uPerlinTexture;

varying vec2 vUv;

void main(){
  // smoke section
  vec2 smokeUv = vUv;

  vec3 smoke = texture(uPerlinTexture, smokeUv).rgb;

  gl_FragColor = vec4(smoke, 1.0);
  
  // this will add support to the tonemapping
  #include <tonemapping_fragment>
  // and this makes that colorspace just works
  #include <colorspace_fragment>
}
