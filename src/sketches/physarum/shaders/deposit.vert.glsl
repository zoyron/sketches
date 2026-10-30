uniform sampler2D uAgents;

varying float vHunger;

// One vertex per agent; position.xy addresses the agent's texel
void main() {
  vec4 agent = texture2D(uAgents, position.xy);
  vHunger = agent.w;
  gl_PointSize = 1.0;
  gl_Position = vec4(agent.xy * 2.0 - 1.0, 0.0, 1.0);
}
