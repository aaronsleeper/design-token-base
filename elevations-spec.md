Here’s a compact, build-ready spec you can hand to a coding agent. It uses only vanilla JS + CSS custom properties.

# Deliverables

- `elevation.css` — variables + 3-layer soft-shadow recipe.
- `elevation.js` — computes per-element geometry and writes CSS vars.
- `elevation-demo.html` — contains example elements demonstrating the functionality. as well as controls to edit the global light source values. **important note** the javascript to support the controls on this page must be separate from the javascript required to make the elevations function
- README notes (below) — how to wire it into your static site.

# HTML conventions

- Add class **`elev`** to any element that should cast a shadow.
- Per-element attributes (optional unless noted):

  - `data-elev-z` (required): object height above surface in px (number).
  - `data-albedo` (0–1, default 0.7).
  - `data-ao` (ambient occlusion 0–1, default 0).
  - `data-surface` (OKLCH color string, else inherits).

- Put a single light on `:root` via CSS vars (JS helper provided to change at runtime).

Example:

```html
<div
	class="card elev"
	data-elev-z="12"
	data-albedo="0.8"
	data-ao="0.05"
	data-surface="oklch(0.85 0.06 250)"
>
	...
</div>
```

# elevation.css

```css
/* ---------- Theme / scene defaults on :root ---------- */
:root {
	/* Light (viewport coordinate space; unitless numbers interpreted as px) */
	--light-pos-x: 50; /* px (number) */
	--light-pos-y: -200; /* px (number) */
	--light-pos-z: 600; /* px (number) height above plane */
	--light-radius: 60; /* px (number) apparent size */
	--light-intensity-lux: 2000;

	/* Ambient */
	--ambient-color: oklch(0.92 0.03 230);
	--ambient-intensity-lux: 500;

	/* Tuning constants */
	--k-sigma: 1;
	--k-alpha: 0.6;
	--c-alpha: 0.015;
	--k-ambient: 1;

	/* Layer scales (contact / mid / far) */
	--k-ofs-1: 0.3;
	--k-blur-1: 0.5;
	--k-a-1: 0.6;
	--k-ofs-2: 0.7;
	--k-blur-2: 1;
	--k-a-2: 0.35;
	--k-ofs-3: 1;
	--k-blur-3: 2;
	--k-a-3: 0.2;
}

/* ---------- Per-element defaults ---------- */
.elev {
	/* Inputs (can be overridden via data-attrs + JS) */
	--object-pos-x: 0; /* px (number) set by JS */
	--object-pos-y: 0; /* px (number) set by JS */
	--object-pos-z: 0; /* px (number) set by JS or data-elev-z */
	--object-color: oklch(0.98 0.01 250);
	--object-albedo: 0.7;
	--ambient-occlusion: 0;

	/* Intermediates (CSS calc) */
	--delta-x: calc(var(--light-pos-x) - var(--object-pos-x));
	--delta-y: calc(var(--light-pos-y) - var(--object-pos-y));
	--delta-z: calc(var(--light-pos-z) - var(--object-pos-z));
	/* --dist is provided by JS (sqrt not available in CSS) */

	/* Geometry */
	--h: var(--object-pos-z);
	--shadow-offset-x: calc(var(--h) / var(--delta-z) * var(--delta-x));
	--shadow-offset-y: calc(var(--h) / var(--delta-z) * var(--delta-y));
	--shadow-blur: calc(var(--k-sigma) * (var(--light-radius) * var(--h) / var(--delta-z)));

	/* Light/angle terms (dist, falloff provided by JS) */
	--cos-theta: max(0, calc(var(--delta-z) / var(--dist)));
	--alpha-base: calc(var(--k-alpha) * var(--falloff) * var(--cos-theta) / (1 + var(--c-alpha) * var(--shadow-blur)));

	/* Ambient */
	--ambient-norm: calc(var(--ambient-intensity-lux) / (var(--ambient-intensity-lux) + var(--light-intensity-lux)));
	--ao: var(--ambient-occlusion);
	--alpha: calc(var(--alpha-base) * (1 - var(--k-ambient) * var(--ambient-norm)) * (1 - var(--ao)));

	/* Color */
	--object-albedo-pct: calc(var(--object-albedo) * 100%);
	--shadow-base-color: color-mix(in oklch, var(--object-color) var(--object-albedo-pct), var(--ambient-color));
	--shadow-color: oklch(from var(--shadow-base-color) calc(l * 0.85) c h);

	/* Layer derivations */
	--alpha-1: calc(var(--k-a-1) * var(--alpha));
	--alpha-2: calc(var(--k-a-2) * var(--alpha));
	--alpha-3: calc(var(--k-a-3) * var(--alpha));

	--ofs-x-1: calc(var(--k-ofs-1) * var(--shadow-offset-x));
	--ofs-y-1: calc(var(--k-ofs-1) * var(--shadow-offset-y));
	--ofs-x-2: calc(var(--k-ofs-2) * var(--shadow-offset-x));
	--ofs-y-2: calc(var(--k-ofs-2) * var(--shadow-offset-y));
	--ofs-x-3: calc(var(--k-ofs-3) * var(--shadow-offset-x));
	--ofs-y-3: calc(var(--k-ofs-3) * var(--shadow-offset-y));

	--blur-1: calc(var(--k-blur-1) * var(--shadow-blur));
	--blur-2: calc(var(--k-blur-2) * var(--shadow-blur));
	--blur-3: calc(var(--k-blur-3) * var(--shadow-blur));

	/* Compose (multiply unitless by 1px on use) */
	box-shadow: calc(var(--ofs-x-1) * 1px) calc(var(--ofs-y-1) * 1px) calc(var(--blur-1) * 1px) 0 oklch(
				from var(--shadow-color) l c h / clamp(0, var(--alpha-1), 0.6)
			), calc(var(--ofs-x-2) * 1px) calc(var(--ofs-y-2) * 1px) calc(var(--blur-2) * 1px) 0 oklch(
				from var(--shadow-color) l c h / clamp(0, var(--alpha-2), 0.6)
			),
		calc(var(--ofs-x-3) * 1px) calc(var(--ofs-y-3) * 1px) calc(var(--blur-3) * 1px) 0 oklch(
				from var(--shadow-color) l c h / clamp(0, var(--alpha-3), 0.6)
			);
}

/* Fallback for browsers without OKLCH (very basic) */
@supports not (color: oklch(0.5 0 0)) {
	.elev {
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2), 0 8px 12px rgba(0, 0, 0, 0.12), 0 16px 24px rgba(0, 0, 0, 0.08);
	}
}
```

# elevation.js

```js
/* Minimal soft-shadow engine: vanilla JS, no deps */
(function () {
	const SEL = '.elev';
	const ROOT = document.documentElement;

	// Utility: read a CSS number custom property
	const cssNum = (el, name, fallback = 0) => {
		const v = getComputedStyle(el).getPropertyValue(name).trim();
		const n = parseFloat(v);
		return Number.isFinite(n) ? n : fallback;
	};

	// Write unitless CSS var
	const setVar = (el, name, value) => el.style.setProperty(name, String(value));

	// Clamp helper
	const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

	// Initialize per-element static props from data-attrs
	function primeElement(el) {
		const z = parseFloat(el.dataset.elevZ ?? '0');
		const albedo = parseFloat(el.dataset.albedo ?? '0.7');
		const ao = parseFloat(el.dataset.ao ?? '0');
		const surface = el.dataset.surface;

		if (Number.isFinite(z)) setVar(el, '--object-pos-z', z);
		if (Number.isFinite(albedo)) setVar(el, '--object-albedo', clamp(albedo, 0, 1));
		if (Number.isFinite(ao)) setVar(el, '--ambient-occlusion', clamp(ao, 0, 1));
		if (surface) el.style.setProperty('--object-color', surface);
	}

	// Compute geometric terms per element
	function updateElement(el) {
		// Center of element in viewport coords
		const r = el.getBoundingClientRect();
		const ox = r.left + r.width / 2;
		const oy = r.top + r.height / 2;

		// Object height
		const h = cssNum(el, '--object-pos-z', 0);

		// Light params from :root
		const Lx = cssNum(ROOT, '--light-pos-x', 0);
		const Ly = cssNum(ROOT, '--light-pos-y', -200);
		const Lz = cssNum(ROOT, '--light-pos-z', 600);
		const intensityLux = cssNum(ROOT, '--light-intensity-lux', 2000);

		// Deltas (same space)
		const dx = Lx - ox;
		const dy = Ly - oy;
		const dz = Lz - h; // must be > 0

		// Distance (3D)
		const dist = Math.hypot(dx, dy, dz) || 1; // avoid 0
		const dist2 = dist * dist;

		// Inverse-square falloff (scaled; keep as a small 0..~1 number)
		// Optional scaling factor to keep values in a comfortable range:
		const FALL_OFF_SCALE = 1 / 20000; // tune as needed for your scene
		const falloff = clamp((intensityLux * FALL_OFF_SCALE) / dist2, 0, 1);

		// Write variables back to element (unitless)
		setVar(el, '--object-pos-x', ox);
		setVar(el, '--object-pos-y', oy);
		setVar(el, '--dist', dist);
		setVar(el, '--falloff', falloff);
	}

	// Batch update
	function updateAll() {
		document.querySelectorAll(SEL).forEach((el) => updateElement(el));
	}

	// Initialize
	function init() {
		document.querySelectorAll(SEL).forEach(primeElement);
		updateAll();

		// Recompute on resize/scroll/mutation
		let ticking = false;
		const schedule = () => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(() => {
					updateAll();
					ticking = false;
				});
			}
		};
		window.addEventListener('resize', schedule, { passive: true });
		window.addEventListener('scroll', schedule, { passive: true });

		// Optional: observe added/removed elevated elements
		new MutationObserver((muts) => {
			let needsPrime = false,
				needsUpdate = false;
			for (const m of muts) {
				m.addedNodes?.forEach((n) => {
					if (n.nodeType === 1 && n.matches?.(SEL)) {
						primeElement(n);
						needsUpdate = true;
					}
					if (n.querySelectorAll) n.querySelectorAll(SEL).forEach(primeElement);
				});
				if (m.type === 'attributes' && m.target.matches?.(SEL)) needsUpdate = true;
			}
			if (needsPrime || needsUpdate) schedule();
		}).observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['data-elev-z', 'data-albedo', 'data-ao', 'data-surface'],
		});
	}

	// Public helper: set light at runtime
	window.ElevationLight = {
		set({ x, y, z, radius, intensityLux, ambientLux, ambientColor } = {}) {
			if (Number.isFinite(x)) setVar(ROOT, '--light-pos-x', x);
			if (Number.isFinite(y)) setVar(ROOT, '--light-pos-y', y);
			if (Number.isFinite(z)) setVar(ROOT, '--light-pos-z', z);
			if (Number.isFinite(radius)) setVar(ROOT, '--light-radius', radius);
			if (Number.isFinite(intensityLux)) setVar(ROOT, '--light-intensity-lux', intensityLux);
			if (Number.isFinite(ambientLux)) setVar(ROOT, '--ambient-intensity-lux', ambientLux);
			if (ambientColor) ROOT.style.setProperty('--ambient-color', ambientColor);
			// recompute after changes
			requestAnimationFrame(updateAll);
		},
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
```

# Integration steps

- Include files:

  ```html
  <link
  	rel="stylesheet"
  	href="/css/elevation.css"
  />
  <script
  	defer
  	src="/js/elevation.js"
  ></script>
  ```

- Add `elev` to components that should cast shadows. Provide `data-elev-z` per element; optionally set `data-albedo`, `data-ao`, `data-surface`.
- Tune scene on startup (optional):

  ```html
  <script>
  	window.ElevationLight?.set({
  		x: innerWidth * 0.6,
  		y: -200,
  		z: 700,
  		radius: 80,
  		intensityLux: 3000,
  		ambientLux: 800,
  		ambientColor: 'oklch(0.92 0.03 230)',
  	});
  </script>
  ```

# Acceptance criteria

- Shadows update correctly on **resize** and **scroll** (offset grows with `data-elev-z`; blur softens; opacity reduces).
- Changing `:root` light vars via `ElevationLight.set` reflows all shadows.
- Per-element overrides (`data-surface`, `data-albedo`, `data-ao`) affect color/strength.
- No external libraries; only one `requestAnimationFrame` pass per frame when needed.
- Reasonable performance with 200+ `.elev` elements (no layout thrash, event handlers passive).

# Notes for the agent

- Treat all CSS numeric custom properties as **unitless** and multiply by `1px` only when used in CSS properties.
- Keep `FALL_OFF_SCALE` in JS as a single tuning knob to make `--falloff` land in \~0–1 for typical indoor/outdoor scenes.
- If you need per-page defaults, prefer CSS on `:root`; do not hardcode values inside JS.
- Optionally add a feature-detect for `oklch`/`color-mix` and fall back to the rgba stack already provided.
