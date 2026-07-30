  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];
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
  function drawStars() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(200,220,255,${s.o})`;
      ctx.fill();
      s.o += s.speed * .01 * (Math.random()>.5?1:-1);
      s.o = Math.max(.05, Math.min(.8, s.o));
    });
    requestAnimationFrame(drawStars);
  }
  resize(); initStars(); drawStars();
  window.addEventListener('resize', () => { resize(); initStars(); });

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
