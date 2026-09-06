/* ============ TYPED HERO NAME ============ */
(function(){
  const el = document.getElementById('typedName');
  const text = "Haider Ali";
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){
    el.textContent = text;
    return;
  }
  let i = 0;
  el.innerHTML = '<span class="cursor">&nbsp;</span>';
  function type(){
    if(i <= text.length){
      el.innerHTML = text.slice(0, i) + '<span class="cursor">&nbsp;</span>';
      i++;
      setTimeout(type, 70);
    }
  }
  type();
})();

/* ============ NAV TOGGLE ============ */
(function(){
  const btn = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  btn.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
})();

/* ============ SCROLL REVEAL ============ */
(function(){
  const items = document.querySelectorAll('.reveal');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){
    items.forEach(i => i.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if(entry.isIntersecting){
        setTimeout(() => entry.target.classList.add('in-view'), idx * 40);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(i => io.observe(i));
})();

/* ============ PARTICLE NETWORK BACKGROUND ============ */
(function(){
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, particles = [];
  const mouse = { x: null, y: null, radius: 140 };

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY + window.scrollY;
  });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 18000));

  function makeParticles(){
    particles = [];
    for(let i = 0; i < count; i++){
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6
      });
    }
  }
  makeParticles();
  window.addEventListener('resize', makeParticles);

  const accent = '255, 180, 84';
  const dim = '139, 144, 156';

  function step(){
    ctx.clearRect(0, 0, w, h);

    for(const p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < 0 || p.x > w) p.vx *= -1;
      if(p.y < 0 || p.y > h) p.vy *= -1;

      if(mouse.x != null){
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < mouse.radius){
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 1.2;
          p.y += (dy / dist) * force * 1.2;
        }
      }
    }

    for(let i = 0; i < particles.length; i++){
      for(let j = i + 1; j < particles.length; j++){
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 130){
          ctx.strokeStyle = `rgba(${dim}, ${0.14 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for(const p of particles){
      ctx.fillStyle = `rgba(${accent}, 0.55)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if(!reduced) requestAnimationFrame(step);
  }
  step();
})();
