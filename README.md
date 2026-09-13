# Portfolio — Sidharth Vijayan Krishnan

An interactive portfolio built around the thing that makes the work distinctive: a live
agent-based crowd model. The hero is a real WebGL simulation of a lecture hall being
evacuated, with the same three parameters swept in the master's thesis exposed as sliders.

## Stack

| Layer | Choice |
| --- | --- |
| Build | Vite 7 |
| UI | React 19 + TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme` tokens, no config file) |
| Type | Space Grotesk (display) · Inter (body) · JetBrains Mono (data) |
| Animation | Motion (`motion/react`) |
| Scroll | Lenis |
| Routing | React Router 7 (`HashRouter`, so GitHub Pages needs no rewrite rules) |
| 3D | Three.js — hand-written scene, no wrapper library |

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
npm run typecheck    # tsc --noEmit
npm run build        # → dist/           (code-split, deployable)
npm run build:single # → dist-single/    (one self-contained .html, CV inlined)
npm run fonts        # re-copy the latin font subsets out of node_modules
npm run og           # regenerate public/og.png from a live frame of the model
npm run model:check  # every layout × 50/100/200 agents must fully clear
npm run model:sweep  # parameter sweep: occupancy, door width, familiarity, layout
```

### Verifying the crowd model

`model:check` runs every hall layout at three occupancies and fails if any agent is
still inside after 3,000 simulated seconds — it catches routing bugs that are invisible
in a screenshot but obvious as a permanently jammed corner.

`model:sweep` is the small-scale equivalent of the thesis BehaviorSpace campaign: twelve
replications per cell, reporting median clearance time. It reproduces three of the
thesis findings — clearance time growing faster than occupancy, the strong negative
relationship with door width, and the layout ranking (wide auditorium fastest,
traditional slowest). It does **not** reproduce the familiarity effect; the reduced
exit-choice model isn't rich enough, and the site says so rather than pretending
otherwise.

## What's in here

- **`src/lib/crowdModel.ts`** — a reduced browser reimplementation of the NetLogo model
  from the master's thesis, with no rendering dependency so it can be run headlessly.
  Constants come from the thesis parameter table: 0.5 m cells, 0.1 s ticks, 1.2 m/s
  unimpeded and 0.42 m/s impaired walking, 0.65 stair modifier, 1.6 persons/s/m door
  capacity, jamming density 5.4 persons/m², log-normal pre-movement delay. Four
  behavioural strategies mixed 50/25/15/10, exit choice weighted by visibility and
  familiarity, and doorways gated by a throughput budget.
- **`src/lib/evacuationScene.ts`** — the renderer over that model. One `InstancedMesh` for
  up to 320 agents coloured by strategy, hall geometry rebuilt per layout, pointer
  repulsion raycast onto the floor plane. Pauses when scrolled out of view; renders a
  single settled frame for visitors who ask for reduced motion.
- **`src/lib/projectSims.ts`** — the four small 2D canvas models used as project previews.
- **`src/content/site.ts`** — every string on the site, in English and German. Nothing is
  hard-coded in a component.
- **`src/components/CommandPalette.tsx`** — ⌘K / Ctrl-K palette: jump to a section, open a
  project, copy the email address, download the CV, switch language.
- **`src/components/ContactForm.tsx`** — composes the email in the browser and hands it to
  the visitor's mail app, so the site needs no backend and no form processor. To collect
  submissions server-side instead, set `FORM_ENDPOINT` at the top of the file to a
  Formspree or Web3Forms URL; the same form will POST JSON to it and show a sent state.
- **`src/lib/loading.ts` + `Preloader.tsx`** — the loading screen. Progress tracks real
  milestones (app mounted, webfonts resolved, WebGL scene reporting ready) rather than a
  fixed timer, with a 6-second backstop so a failed WebGL context can never trap a visitor
  on the loading screen. Scrolling and Lenis stay disabled until the curtain lifts.
- **`src/lib/useVisitorCount.ts`** — the footer counter. `ENDPOINT` is deliberately easy to
  swap for GoatCounter, a Cloudflare Worker, or anything else that returns a total. If the
  request fails or the service disappears, the hook returns `null` and the footer omits the
  counter rather than displaying an invented number.

## Degrading gracefully

`webglAvailable()` probes for a context before the scene is built, and construction is
wrapped in a `try`/`catch` besides — driver blocklists and exhausted contexts can fail
after a successful probe. If either check fails the hero falls back to the flat 2D
evacuation canvas, hides the parameter panel (there is no model behind it to drive) and
explains itself in one line. The loading screen is told the scene step is finished either
way, so a failure can never strand a visitor on the preloader.

The crowd starts at a size the device can carry — 90 agents under 640px, 140 under
1024px, 200 above — and the renderer watches its own frame times, stepping the pixel
ratio down through 1.75 → 1.35 → 1.0 if the median frame is slower than 24ms. The
measurement is a rolling window, so one slow frame during a layout rebuild doesn't
trigger it.

## The social card

`public/og.png` is not a mock-up: `npm run og` runs the real `CrowdModel` for 78 ticks,
dumps the agent positions, and draws that frame isometrically with the site's own
typefaces. Needs `pip install fonttools brotli` to unpack the woff2 files. Re-run it if
the palette changes.

## Deploying

Push to `main`. The included workflow builds and publishes `dist/` to GitHub Pages.
For a user site (`sidharthkris.github.io`) that is all that's needed — `base` is `./`
and routing is hash-based, so nothing else has to be configured.

## Editing content

Change the copy in `src/content/site.ts`. Add a project by appending to the `projects`
array and picking one of the four `sim` kinds; the card, the route at `/#/project/<slug>`,
the prev/next links and the command palette entry all follow from that one object.

Each project also takes optional `repo` and `demo` URLs. Add either and the matching
button appears on the project page; leave them out and nothing renders, so the page never
shows a dead link.

Replace `src/assets/Sidharth-Vijayan-Krishnan-CV.pdf` when the CV changes.

## Fonts and third-party requests

The three typefaces are self-hosted from `src/assets/fonts`, not loaded from a font CDN,
so no visitor request reaches Google. Only the latin subsets are copied in; the latin-ext
files carry a `unicode-range` so they are fetched only if a glyph actually needs them.
`npm run fonts` re-copies them from the `@fontsource-variable` packages after an update.

The only third-party request the site makes at runtime is the footer visitor counter. If
you would rather the site call nothing at all, delete the `useVisitorCount()` call in
`Sections.tsx` — the footer already handles a `null` count by omitting the number.

## Accessibility

Text colours are checked against the palette rather than eyeballed: both muted tiers clear
the WCAG AA 4.5:1 ratio on every background used, the lighter one at 7.2:1 and the small
10px mono labels at 5.0:1. Keyboard focus is visible throughout, the palette is fully keyboard-driven, the skip link
is the first tab stop, `prefers-reduced-motion` disables Lenis, the marquee, the reveals
and both simulation loops, and the custom cursor is only mounted for fine pointers.
