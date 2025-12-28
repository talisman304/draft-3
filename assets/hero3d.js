(() => {
  const canvas = document.getElementById("hero3d");
  if (!canvas) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d", { alpha: true });

  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const rand = (a,b) => a + Math.random() * (b-a);

  // Particles for subtle depth
  let pts = Array.from({ length: 70 }, () => ({
    x: Math.random(),
    y: Math.random(),
    z: rand(0.2, 1.0),
    r: rand(0.6, 2.2),
    vx: rand(-0.10, 0.10),
    vy: rand(-0.08, 0.08),
  }));

  const draw = (t) => {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);

    // Background glow
    const g1 = ctx.createRadialGradient(w*0.25, h*0.20, 10, w*0.25, h*0.20, Math.max(w,h)*0.9);
    g1.addColorStop(0, "rgba(125,211,252,0.18)");
    g1.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g1; ctx.fillRect(0,0,w,h);

    const g2 = ctx.createRadialGradient(w*0.78, h*0.30, 10, w*0.78, h*0.30, Math.max(w,h)*0.9);
    g2.addColorStop(0, "rgba(167,139,250,0.14)");
    g2.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g2; ctx.fillRect(0,0,w,h);

    // “3D orb” via layered gradients + specular highlight
    const cx = w*0.60, cy = h*0.52;
    const baseR = Math.min(w,h) * 0.26;

    // Outer soft
    const outer = ctx.createRadialGradient(cx, cy, baseR*0.1, cx, cy, baseR*1.25);
    outer.addColorStop(0, "rgba(255,255,255,0.08)");
    outer.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = outer;
    ctx.beginPath(); ctx.arc(cx, cy, baseR*1.25, 0, Math.PI*2); ctx.fill();

    // Main body
    const body = ctx.createRadialGradient(cx-baseR*0.28, cy-baseR*0.32, baseR*0.1, cx, cy, baseR*1.05);
    body.addColorStop(0, "rgba(255,255,255,0.18)");
    body.addColorStop(0.35, "rgba(125,211,252,0.18)");
    body.addColorStop(0.7, "rgba(167,139,250,0.14)");
    body.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(cx, cy, baseR*1.05, 0, Math.PI*2); ctx.fill();

    // Specular highlight
    const spec = ctx.createRadialGradient(cx-baseR*0.35, cy-baseR*0.40, 2, cx-baseR*0.35, cy-baseR*0.40, baseR*0.55);
    spec.addColorStop(0, "rgba(255,255,255,0.55)");
    spec.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = spec;
    ctx.beginPath(); ctx.arc(cx-baseR*0.20, cy-baseR*0.25, baseR*0.55, 0, Math.PI*2); ctx.fill();

    // Particle field (depth)
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const p of pts) {
      const px = p.x * w;
      const py = p.y * h;

      const alpha = 0.07 + 0.10 * p.z;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, p.r * dpr * (0.6 + p.z), 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();

    // Update
    if (!reduce) {
      for (const p of pts) {
        p.x += p.vx * (0.002 + 0.004 * p.z);
        p.y += p.vy * (0.002 + 0.004 * p.z);
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05) p.y = -0.05;
      }
    }

    requestAnimationFrame(draw);
  };

  requestAnimationFrame(draw);
})();
// canvas placeholder
