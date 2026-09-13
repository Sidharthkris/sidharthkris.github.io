import type { SimKind } from "../content/site";

type Sim = {
  init: (w: number, h: number) => unknown;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, state: never) => void;
};

const BG = "#09101d";

function rounded(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

/* ------------------------------------------------------------------ evac */

type EvacAgent = { x: number; y: number; vx: number; vy: number; s: number };
type EvacState = { seats: { x: number; y: number }[]; ag: EvacAgent[]; door: { x: number; y: number } };

const evac: Sim = {
  init: (w, h): EvacState => {
    const seats: { x: number; y: number }[] = [];
    const rows = 6;
    const cols = 9;
    for (let r = 0; r < rows; r++)
      for (let q = 0; q < cols; q++) seats.push({ x: w * 0.14 + (q * (w * 0.62)) / cols, y: h * 0.18 + (r * (h * 0.64)) / rows });
    const ag: EvacAgent[] = [];
    for (let i = 0; i < 46; i++)
      ag.push({ x: w * 0.14 + Math.random() * w * 0.6, y: h * 0.16 + Math.random() * h * 0.66, vx: 0, vy: 0, s: 0.4 + Math.random() * 0.8 });
    return { seats, ag, door: { x: w * 0.9, y: h * 0.5 } };
  },
  draw: (ctx, w, h, state) => {
    const s = state as unknown as EvacState;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(163,177,201,0.15)";
    s.seats.forEach((p) => ctx.fillRect(p.x, p.y, 10, 3));
    ctx.fillStyle = "rgba(0,229,160,0.9)";
    ctx.fillRect(s.door.x, s.door.y - 16, 2, 32);

    s.ag.forEach((a) => {
      const dx = s.door.x - a.x;
      const dy = s.door.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      a.vx += (dx / d) * 0.07 * a.s;
      a.vy += (dy / d) * 0.07 * a.s;
      s.ag.forEach((b) => {
        if (b === a) return;
        const ex = b.x - a.x;
        const ey = b.y - a.y;
        const e2 = ex * ex + ey * ey;
        if (e2 < 90 && e2 > 0.01) {
          const ed = Math.sqrt(e2);
          const f = ((9.5 - ed) / ed) * 0.06;
          a.vx -= ex * f;
          a.vy -= ey * f;
        }
      });
      a.vx *= 0.9;
      a.vy *= 0.9;
      a.x += a.vx;
      a.y += a.vy;
      if (a.x > s.door.x) {
        a.x = w * 0.14 + Math.random() * w * 0.5;
        a.y = h * 0.16 + Math.random() * h * 0.66;
        a.vx = 0;
        a.vy = 0;
      }
      ctx.fillStyle = a.x > s.door.x - 70 ? "rgba(0,229,160,.9)" : "rgba(124,147,255,.75)";
      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.9, 0, Math.PI * 2);
      ctx.fill();
    });
  },
};

/* ------------------------------------------------------------------- hex */

type Cell = { x: number; y: number; k: string | null; a: number };
type HexState = { R: number; cells: Cell[]; ag: { i: number; c: string }[]; tick: number };

const hex: Sim = {
  init: (w, h): HexState => {
    const R = Math.max(9, Math.min(15, w / 26));
    const cells: Cell[] = [];
    const dx = R * 1.732;
    const dy = R * 1.5;
    for (let r = 0; r < Math.ceil(h / dy) + 1; r++)
      for (let q = 0; q < Math.ceil(w / dx) + 2; q++) cells.push({ x: q * dx + (r % 2 ? dx / 2 : 0), y: r * dy, k: null, a: 0 });
    const cols = ["#7c93ff", "#3ed9ff", "#00e5a0"];
    const ag = cols.map((c) => ({ i: Math.floor(Math.random() * cells.length), c }));
    return { R, cells, ag, tick: 0 };
  },
  draw: (ctx, w, h, state) => {
    const s = state as unknown as HexState;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);

    s.cells.forEach((cell) => {
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const an = (Math.PI / 180) * (60 * k - 30);
        const px = cell.x + s.R * 0.88 * Math.cos(an);
        const py = cell.y + s.R * 0.88 * Math.sin(an);
        if (k) ctx.lineTo(px, py);
        else ctx.moveTo(px, py);
      }
      ctx.closePath();
      if (cell.k) {
        ctx.fillStyle = cell.k;
        ctx.globalAlpha = cell.a;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.strokeStyle = "rgba(163,177,201,0.14)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    s.tick++;
    if (s.tick % 6 === 0) {
      s.ag.forEach((a) => {
        const cur = s.cells[a.i];
        const near = s.cells
          .map((cc, ix) => ({ ix, d: Math.hypot(cc.x - cur.x, cc.y - cur.y), k: cc.k }))
          .filter((o) => o.d > 1 && o.d < s.R * 2.1);
        const fresh = near.filter((o) => !o.k);
        const pool = fresh.length ? fresh : near;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        if (pick) {
          a.i = pick.ix;
          s.cells[a.i].k = a.c;
          s.cells[a.i].a = 0.3;
        }
      });
      s.cells.forEach((cc) => {
        if (cc.a > 0.14) cc.a -= 0.006;
      });
    }

    s.ag.forEach((a) => {
      const cur = s.cells[a.i];
      ctx.fillStyle = a.c;
      ctx.beginPath();
      ctx.arc(cur.x, cur.y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    });
  },
};

/* ------------------------------------------------------------------ grid */

type Block = { col: number; row: number; span: number; clash: boolean; a: number; life: number };
type GridState = { blocks: Block[]; t: number; cols: number; pad: number };

const grid: Sim = {
  init: (w): GridState => ({ blocks: [], t: 0, cols: 5, pad: Math.max(14, w * 0.06) }),
  draw: (ctx, w, h, state) => {
    const s = state as unknown as GridState;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);

    const pad = s.pad;
    const cw = (w - pad * 2) / s.cols;
    const top = pad + 8;
    const gh = h - pad * 2 - 8;

    ctx.strokeStyle = "rgba(163,177,201,0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= s.cols; i++) {
      ctx.beginPath();
      ctx.moveTo(pad + i * cw, top);
      ctx.lineTo(pad + i * cw, top + gh);
      ctx.stroke();
    }
    for (let r = 0; r <= 6; r++) {
      ctx.beginPath();
      ctx.moveTo(pad, top + (r * gh) / 6);
      ctx.lineTo(w - pad, top + (r * gh) / 6);
      ctx.stroke();
    }

    s.t++;
    if (s.t % 46 === 0 && s.blocks.length < 11) {
      const col = Math.floor(Math.random() * s.cols);
      const row = Math.floor(Math.random() * 5);
      const span = 1 + Math.floor(Math.random() * 2);
      const clash = s.blocks.some((b) => b.col === col && !(row + span <= b.row || b.row + b.span <= row));
      s.blocks.push({ col, row, span, clash, a: 0, life: 0 });
    }

    s.blocks.forEach((b) => {
      b.a = Math.min(1, b.a + 0.05);
      b.life++;
      const x = pad + b.col * cw + 3;
      const y = top + (b.row * gh) / 6 + 3;
      const bw = cw - 6;
      const bh = (b.span * gh) / 6 - 6;
      const yy = y + (1 - b.a) * 10;
      if (b.clash) {
        const f = 0.5 + 0.5 * Math.sin(b.life * 0.14);
        ctx.fillStyle = `rgba(0,229,160,${0.16 * b.a * f + 0.08})`;
        ctx.strokeStyle = `rgba(0,229,160,${0.85 * b.a})`;
      } else {
        ctx.fillStyle = `rgba(124,147,255,${0.16 * b.a})`;
        ctx.strokeStyle = `rgba(124,147,255,${0.55 * b.a})`;
      }
      ctx.beginPath();
      rounded(ctx, x, yy, bw, bh, 3);
      ctx.fill();
      ctx.stroke();
    });

    if (s.blocks.length >= 11 && s.t % 46 === 0) s.blocks.shift();
  },
};

/* ------------------------------------------------------------------ quiz */

type QuizState = { t: number; p: number; items: { on: boolean; a: number }[]; idx: number };

const quiz: Sim = {
  init: (): QuizState => ({
    t: 0,
    p: 1,
    items: Array.from({ length: 7 }, () => ({ on: Math.random() < 0.4, a: 0 })),
    idx: 0,
  }),
  draw: (ctx, w, h, state) => {
    const s = state as unknown as QuizState;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.28;
    const cy = h * 0.5;
    const R = Math.min(w * 0.15, h * 0.28);

    s.t++;
    s.p -= 0.0022;
    if (s.p <= 0) {
      s.p = 1;
      s.idx = (s.idx + 1) % s.items.length;
      s.items.forEach((it) => (it.on = Math.random() < 0.4));
    }

    ctx.strokeStyle = "rgba(163,177,201,0.20)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = s.p < 0.25 ? "rgba(0,229,160,.95)" : "rgba(124,147,255,.9)";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * s.p);
    ctx.stroke();

    ctx.fillStyle = s.p < 0.25 ? "rgba(0,229,160,.95)" : "rgba(239,236,250,.9)";
    ctx.font = `500 ${Math.round(R * 0.5)}px 'JetBrains Mono Variable', ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(Math.ceil(s.p * 30)), cx, cy + 1);

    const lx = w * 0.5;
    const lw = w * 0.36;
    const lh = Math.min(13, h * 0.06);
    const gap = Math.min(9, h * 0.035);
    const total = s.items.length * (lh + gap) - gap;
    const ly = cy - total / 2;

    s.items.forEach((it, i) => {
      const sel = i === s.idx;
      it.a += ((sel ? 1 : 0) - it.a) * 0.12;
      ctx.fillStyle = `rgba(124,147,255,${0.1 + it.a * 0.22})`;
      ctx.beginPath();
      rounded(ctx, lx, ly + i * (lh + gap), lw * (0.6 + (0.4 * ((i * 37) % 10)) / 10), lh, 2);
      ctx.fill();
      if (sel) {
        ctx.fillStyle = "rgba(0,229,160,.95)";
        ctx.beginPath();
        ctx.arc(lx - 9, ly + i * (lh + gap) + lh / 2, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  },
};


/* ------------------------------------------------------------------ path */

type PathCell = { wall: boolean; seen: number; onPath: boolean };
type PathState = { w: number; h: number; cols: number; rows: number; cells: PathCell[]; frontier: number[]; came: number[]; goal: number; done: number; t: number };

function buildPath(w: number, h: number): PathState {
  const cell = Math.max(12, Math.min(20, w / 26));
  const cols = Math.max(8, Math.floor(w / cell));
  const rows = Math.max(6, Math.floor(h / cell));
  const cells: PathCell[] = Array.from({ length: cols * rows }, () => ({
    wall: Math.random() < 0.22,
    seen: 0,
    onPath: false,
  }));
  const start = rows * cols - Math.floor(cols / 2) - 1;
  const goal = Math.floor(cols / 2);
  cells[start].wall = false;
  cells[goal].wall = false;
  const came = new Array(cols * rows).fill(-1);
  cells[start].seen = 1;
  return { w, h, cols, rows, cells, frontier: [start], came, goal, done: 0, t: 0 };
}

const path: Sim = {
  init: (w, h): PathState => buildPath(w, h),
  draw: (ctx, w, h, state) => {
    const s = state as unknown as PathState;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);

    const cw = w / s.cols;
    const ch = h / s.rows;
    s.t++;

    // Breadth-first wavefront, a few cells per frame so it reads as search.
    if (!s.done && s.t % 2 === 0) {
      for (let n = 0; n < 3 && s.frontier.length; n++) {
        const cur = s.frontier.shift()!;
        if (cur === s.goal) {
          s.done = 1;
          let node = cur;
          while (node !== -1) {
            s.cells[node].onPath = true;
            node = s.came[node];
          }
          break;
        }
        const cx = cur % s.cols;
        const cy = Math.floor(cur / s.cols);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= s.cols || ny >= s.rows) continue;
          const ni = ny * s.cols + nx;
          if (s.cells[ni].wall || s.cells[ni].seen) continue;
          s.cells[ni].seen = s.cells[cur].seen + 1;
          s.came[ni] = cur;
          s.frontier.push(ni);
        }
      }
      if (!s.frontier.length && !s.done) s.done = 1;
    }
    if (s.done) {
      s.done++;
      if (s.done > 150) Object.assign(s, buildPath(w, h));
    }

    for (let i = 0; i < s.cells.length; i++) {
      const c = s.cells[i];
      const x = (i % s.cols) * cw;
      const y = Math.floor(i / s.cols) * ch;
      if (c.wall) ctx.fillStyle = "rgba(163,177,201,0.10)";
      else if (c.onPath) ctx.fillStyle = "rgba(0,229,160,0.85)";
      else if (c.seen) ctx.fillStyle = `rgba(124,147,255,${Math.max(0.08, 0.5 - c.seen * 0.004)})`;
      else continue;
      ctx.fillRect(x + 1, y + 1, cw - 2, ch - 2);
    }

    const gx = (s.goal % s.cols) * cw;
    const gy = Math.floor(s.goal / s.cols) * ch;
    ctx.strokeStyle = "rgba(0,229,160,0.95)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(gx + 1, gy + 1, cw - 2, ch - 2);
  },
};

/* ----------------------------------------------------------------- stats */

type StatsState = { bars: number[]; target: number[]; t: number; cut: number };

function bell(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const x = (i - (n - 1) / 2) / (n / 5);
    return Math.exp(-0.5 * x * x) * (0.65 + Math.random() * 0.5);
  });
}

const stats: Sim = {
  init: (): StatsState => {
    const target = bell(16);
    return { bars: target.map(() => 0), target, t: 0, cut: 0.45 };
  },
  draw: (ctx, w, h, state) => {
    const s = state as unknown as StatsState;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);

    s.t++;
    if (s.t % 260 === 0) s.target = bell(16);

    const pad = Math.max(16, w * 0.07);
    const base = h - pad;
    const bw = (w - pad * 2) / s.bars.length;
    const maxH = h - pad * 2;

    // Grade boundary: everything under it reads as the failing band.
    const cutY = base - maxH * s.cut;
    ctx.strokeStyle = "rgba(255,94,91,0.55)";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, cutY);
    ctx.lineTo(w - pad, cutY);
    ctx.stroke();
    ctx.setLineDash([]);

    for (let i = 0; i < s.bars.length; i++) {
      s.bars[i] += (s.target[i] - s.bars[i]) * 0.05;
      const bh = Math.max(1, s.bars[i] * maxH);
      const x = pad + i * bw;
      const y = base - bh;
      ctx.fillStyle = bh > maxH * s.cut ? "rgba(0,229,160,0.75)" : "rgba(124,147,255,0.55)";
      ctx.beginPath();
      rounded(ctx, x + 1.5, y, bw - 3, bh, 2);
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(163,177,201,0.25)";
    ctx.beginPath();
    ctx.moveTo(pad, base);
    ctx.lineTo(w - pad, base);
    ctx.stroke();
  },
};

export const sims: Record<SimKind, Sim> = { evac, hex, grid, quiz, path, stats };
