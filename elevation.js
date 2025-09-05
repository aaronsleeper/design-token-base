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
