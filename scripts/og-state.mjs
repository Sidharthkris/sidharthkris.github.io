/** Dumps one mid-evacuation frame of the real model for the social card. */
import { CrowdModel, LAYOUTS, DEFAULT_PARAMS } from "../src/lib/crowdModel.ts";

function mulberry(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const layout = LAYOUTS[1];
const model = new CrowdModel(layout, { ...DEFAULT_PARAMS, population: 220, panic: 0.45 }, mulberry(42));
for (let i = 0; i < 78; i++) model.step(); // queues forming, hall still full

console.log(
  JSON.stringify({
    layout: {
      width: layout.width,
      depth: layout.depth,
      blocks: layout.blocks,
      rowZ: layout.rowZ,
      rowThickness: layout.rowThickness,
      exits: layout.exits,
    },
    agents: model.agents.filter((a) => a.active).map((a) => ({ x: a.x, z: a.z, strategy: a.strategy })),
  }),
);
