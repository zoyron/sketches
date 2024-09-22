uniform float uTime;
uniform float uSize;
attribute float aScale;
attribute vec3 aRandom;
varying vec3 vColor;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // spin
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  float offSetAngle = (1.0 / distanceToCenter) * uTime * 0.25;
  angle += offSetAngle;
  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  // adding randomness to the galaxy
  modelPosition.xyz += aRandom;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // size of the particles
  gl_PointSize = uSize * aScale;
  
  // applying the particle attenuation formula
  gl_PointSize *= (1.0 / - viewPosition.z);

  // varying color
  vColor = color;
}
