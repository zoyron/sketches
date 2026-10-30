uniform sampler2D uColorMap;
uniform sampler2D uLightMap;
uniform sampler2D uAlphaMap;

varying  vec2 vUv;
varying float vVisible;
varying float vDist;
varying float vThreshold;


void main(){
  // took from github
  if (floor(vVisible + 0.1) == 0.0) discard;
  // took from github ends here

  float alpha = texture2D(uAlphaMap, vUv).r;

  vec3 color = texture2D(uColorMap, vUv).rgb;
  vec3 otherColor = texture2D(uLightMap, vUv).rgb;
  if(vDist < vThreshold){
    color = mix(color, otherColor, (vThreshold - vDist) * 50.0);
  }
  gl_FragColor = vec4(color, 1.0 - alpha);
}