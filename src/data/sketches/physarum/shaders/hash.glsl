// PCG hash (Jarzynski & Olano, 2020): uncorrelated noise per texel and frame
uvec3 pcg3d(uvec3 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  return v;
}

vec3 hash3(vec2 coord, float seed) {
  return vec3(pcg3d(uvec3(uvec2(coord), uint(seed)))) / 4294967295.0;
}
