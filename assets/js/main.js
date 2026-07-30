  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [];
  let comets = [];
  let galaxies = [];
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function initStars() {
    stars = Array.from({length:200}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + .2,
      o: Math.random() * .6 + .1,
      speed: Math.random() * .3 + .05
    }));
  }
  function initGalaxies() {
    const palette = ['74,158,255', '61,217,192', '232,184,109'];
    galaxies = Array.from({length:3}, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 200 + Math.random() * 180,
      color: palette[i % palette.length],
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() > .5 ? 1 : -1) * (.0002 + Math.random() * .0003),
      vx: (Math.random() - .5) * .05,
      vy: (Math.random() - .5) * .04
    }));
  }
  function drawGalaxy(g) {
    ctx.save();
    ctx.translate(g.x, g.y);
    ctx.rotate(g.angle);
    const grad = ctx.createRadialGradient(0,0,0, 0,0,g.r);
    grad.addColorStop(0, `rgba(${g.color},.14)`);
    grad.addColorStop(.4, `rgba(${g.color},.06)`);
    grad.addColorStop(1, `rgba(${g.color},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, g.r, g.r * .55, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.strokeStyle = `rgba(${g.color},.09)`;
    ctx.lineWidth = g.r * .04;
    for (let arm = 0; arm < 2; arm++) {
      ctx.beginPath();
      const armOffset = arm * Math.PI;
      for (let t = 0; t <= 1; t += .04) {
        const rad = t * g.r * .85;
        const th = t * Math.PI * 2.2 + armOffset;
        const px = Math.cos(th) * rad, py = Math.sin(th) * rad * .55;
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  function spawnComet() {
    const fromLeft = Math.random() > .5;
    comets.push({
      x: fromLeft ? -60 : canvas.width + 60,
      y: Math.random() * canvas.height * .65,
      vx: (fromLeft ? 1 : -1) * (7 + Math.random() * 6),
      vy: 2.5 + Math.random() * 2.5,
      len: 90 + Math.random() * 70,
      life: 1
    });
  }
  function scheduleComet() {
    setTimeout(() => { spawnComet(); scheduleComet(); }, 2000 + Math.random() * 3000);
  }
  function drawStars() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if (!reduceMotion) {
      galaxies.forEach(g => {
        g.angle += g.spin;
        g.x += g.vx; g.y += g.vy;
        if (g.x < -g.r) g.x = canvas.width + g.r;
        if (g.x > canvas.width + g.r) g.x = -g.r;
        if (g.y < -g.r) g.y = canvas.height + g.r;
        if (g.y > canvas.height + g.r) g.y = -g.r;
      });
    }
    galaxies.forEach(drawGalaxy);

    if (!reduceMotion) {
      // slow celestial rotation around the viewport center
      const angle = 0.00007;
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const cos = Math.cos(angle), sin = Math.sin(angle);
      stars.forEach(s => {
        const dx = s.x - cx, dy = s.y - cy;
        s.x = cx + dx * cos - dy * sin;
        s.y = cy + dx * sin + dy * cos;
      });
    }

    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(200,220,255,${s.o})`;
      ctx.fill();
      s.o += s.speed * .01 * (Math.random()>.5?1:-1);
      s.o = Math.max(.05, Math.min(.8, s.o));
    });

    if (!reduceMotion) {
      comets.forEach(c => {
        const angle = Math.atan2(c.vy, c.vx);
        const tailX = c.x - Math.cos(angle) * c.len;
        const tailY = c.y - Math.sin(angle) * c.len;
        const grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${c.life})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(c.x, c.y, 1.6, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${c.life})`;
        ctx.fill();

        c.x += c.vx; c.y += c.vy; c.life -= .006;
      });
      comets = comets.filter(c => c.life > 0 && c.x > -120 && c.x < canvas.width + 120 && c.y < canvas.height + 120);
    }

    requestAnimationFrame(drawStars);
  }
  resize(); initStars(); initGalaxies(); drawStars();
  window.addEventListener('resize', () => { resize(); initStars(); initGalaxies(); });
  if (!reduceMotion) scheduleComet();

  // ── Cursor ───────────────────────────────────────────
  const cur = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');
  let tx=0,ty=0;
  document.addEventListener('mousemove', e => {
    cur.style.left = e.clientX+'px'; cur.style.top = e.clientY+'px';
    tx = e.clientX; ty = e.clientY;
  });
  (function moveTrail(){
    trail.style.left = tx+'px'; trail.style.top = ty+'px';
    requestAnimationFrame(moveTrail);
  })();
  document.querySelectorAll('a,button,.skill-tag,.research-card,.blog-card,.about-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>cur.classList.add('big'));
    el.addEventListener('mouseleave',()=>cur.classList.remove('big'));
  });

  // ── Pub tabs ─────────────────────────────────────────
  function showTab(id, btn) {
    document.querySelectorAll('.pub-section').forEach(s=>s.classList.remove('active'));
    document.querySelectorAll('.pub-tab').forEach(t=>t.classList.remove('active'));
    document.getElementById('tab-'+id).classList.add('active');
    btn.classList.add('active');
  }

  // ── Obfuscated emails ──────────────────────────────────
  document.querySelectorAll('.contact-email-row').forEach(row => {
    const email = row.dataset.user + '@' + row.dataset.domain;
    const btn = row.querySelector('.copy-btn');
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(email).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = original; btn.classList.remove('copied'); }, 1500);
      });
    });
  });

  // ── Scroll reveal ─────────────────────────────────────
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  },{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
  document.querySelectorAll('#hero .reveal').forEach(el=>el.classList.add('in'));
