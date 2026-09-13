import { CrowdModel, LAYOUTS, DEFAULT_PARAMS } from "../src/lib/crowdModel.ts";

function mulberry(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

const MAXTICKS = 30000; // 3000 simulated seconds
let fail = 0;

for (const layout of LAYOUTS) {
  for (const pop of [50, 100, 200]) {
    const m = new CrowdModel(layout, { ...DEFAULT_PARAMS, population: pop }, mulberry(pop * 7 + layout.id.length));
    let ticks = 0, cleared = null, stuckAt = null;
    while (ticks < MAXTICKS) {
      m.step(); ticks++;
      if (m.telemetry.lastClearance !== null) { cleared = m.telemetry.lastClearance; break; }
      if (!Number.isFinite(m.agents[0]?.x)) { stuckAt = "NaN"; break; }
    }
    const remaining = m.agents.filter(a => a.active).length;
    const ok = cleared !== null && !stuckAt;
    if (!ok) fail++;
    console.log(
      `${ok ? "PASS" : "FAIL"}  ${layout.id.padEnd(18)} n=${String(pop).padStart(3)}  ` +
      `TET=${cleared ? cleared.toFixed(1) + "s" : "—"}`.padEnd(14) +
      `stranded=${remaining}  peakρ=${m.telemetry.peakDensity.toFixed(2)}/m²  ${stuckAt ?? ""}`
    );
  }
}
console.log(fail ? `\n${fail} FAILING CONFIGURATIONS` : "\nAll layouts clear.");
