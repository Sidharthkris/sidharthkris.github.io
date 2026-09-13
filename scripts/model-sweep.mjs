import { CrowdModel, LAYOUTS, DEFAULT_PARAMS } from "../src/lib/crowdModel.ts";
function mulberry(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const med = a => { const s=[...a].sort((x,y)=>x-y); return s[Math.floor(s.length/2)]; };

function run(layout, over, seed) {
  const m = new CrowdModel(layout, { ...DEFAULT_PARAMS, ...over }, mulberry(seed));
  for (let i=0;i<40000;i++){ m.step(); if (m.telemetry.lastClearance!==null) return m.telemetry.lastClearance; }
  return NaN;
}
const REPS = 12;
const sample = (layout, over) => med(Array.from({length:REPS},(_,r)=>run(layout, over, r*131+7)));

console.log("Population vs clearance time (median of 12 runs, all layouts pooled)");
for (const pop of [50,100,200,300]) {
  const vals = LAYOUTS.map(l => sample(l, { population: pop }));
  console.log(`  n=${String(pop).padStart(3)}  median TET ${med(vals).toFixed(1)}s   per layout: ${vals.map(v=>v.toFixed(0)+"s").join(" ")}`);
}
console.log("\nExit width vs clearance time (traditional, n=200)");
for (const w of [0.9,1.2,1.8,2.4,3.0]) console.log(`  ${w.toFixed(1)} m  ${sample(LAYOUTS[0],{population:200,exitWidth:w}).toFixed(1)}s`);

console.log("\nFamiliarity vs clearance time (center-side-aisle, n=200)");
for (const f of [0.1,0.4,0.7,1.0]) console.log(`  ${(f*100).toFixed(0).padStart(3)}%  ${sample(LAYOUTS[1],{population:200,familiarity:f}).toFixed(1)}s`);

console.log("\nLayout ranking at n=200, 1.8 m doors");
LAYOUTS.map(l=>[l.id, sample(l,{population:200})]).sort((a,b)=>a[1]-b[1])
  .forEach(([id,t])=>console.log(`  ${id.padEnd(18)} ${t.toFixed(1)}s`));
