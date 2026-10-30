uniform float uSize;
uniform float uTime;
uniform vec2 uMouseUV;
uniform sampler2D uElevationMap;

varying float vVisible;
varying vec2 vUv;
varying float vDist;
varying float vThreshold;

void main(){
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  // took this from github.
  // I dont understand how it works, but it hides the continents once they are at the backside
  vec3 vNormal = normalMatrix * normal;
  vVisible = step(0.0, dot( -normalize(mvPosition.xyz), normalize(vNormal)));
  // the part I took from github ends here

  float elevation = texture2D(uElevationMap, uv).r;
  mvPosition.z += 0.5 * elevation;

  float dist = distance(uMouseUV, vUv);
  vDist = dist;
  float zDisp = 0.0;
  vThreshold = 0.07;
  if(dist < vThreshold){
    zDisp = (vThreshold - dist) * 10.0;
  }
  mvPosition.z += zDisp;
  gl_PointSize = uSize;
  gl_Position = projectionMatrix * mvPosition;
}