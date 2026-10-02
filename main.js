(() => {
  const d = document, root = d.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const yr = d.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  // nav state (IO on hero, no scroll listener)
  const nav = d.getElementById('nav'), hero = d.querySelector('.hero');
  if (nav && hero) new IntersectionObserver(([e]) => { nav.classList.toggle('is-scrolled', !e.isIntersecting); d.body.classList.toggle('past-hero', !e.isIntersecting); }, { rootMargin: '-80px 0px 0px 0px' }).observe(hero);

  // mobile menu
  const burger = d.querySelector('.nav__burger'), menu = d.getElementById('menu');
  const setMenu = open => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); d.body.style.overflow = 'hidden'; }
    else { menu.classList.remove('is-open'); d.body.style.overflow = ''; setTimeout(() => { if (burger.getAttribute('aria-expanded') === 'false') menu.hidden = true; }, 400); }
  };
  burger?.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  d.addEventListener('keydown', e => { if (e.key === 'Escape' && burger?.getAttribute('aria-expanded') === 'true') setMenu(false); });

  // reveal with per-group stagger
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const sibs = [...e.target.parentElement.children].filter(n => n.classList.contains('reveal'));
      e.target.style.transitionDelay = Math.min(sibs.indexOf(e.target), 6) * 70 + 'ms';
      e.target.classList.add('in'); io.unobserve(e.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  d.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // manifesto words
  const man = d.querySelector('[data-words]');
  if (man) {
    const hl = new Set(['confianza.', 'barato,']);
    man.innerHTML = man.textContent.trim().split(/\s+/).map((w, i) =>
      `<span class="w${hl.has(w) ? ' hl' : ''}" style="--i:${i}">${w}</span>`).join(' ');
  }

  // services hover image follow
  const float = d.querySelector('.svc__float'), fimg = float?.querySelector('img');
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (float && fine && !reduce) {
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0, active = false;
    const tick = () => {
      cx += (x - cx) * .14; cy += (y - cy) * .14;
      float.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%) rotate(${(x - cx) * .03}deg)`;
      raf = active || Math.abs(x - cx) > .5 ? requestAnimationFrame(tick) : 0;
    };
    d.querySelectorAll('.svc__row').forEach(row => {
      row.addEventListener('pointerenter', e => {
        fimg.src = row.dataset.img; active = true; float.classList.add('on');
        if (!raf) { cx = x = e.clientX; cy = y = e.clientY; raf = requestAnimationFrame(tick); }
      });
      row.addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; });
      row.addEventListener('pointerleave', () => { active = false; float.classList.remove('on'); });
    });
  }

  // gallery: buttons + drag
  const gal = d.querySelector('.gallery');
  if (gal) {
    d.querySelectorAll('.gallery__ctrl .round').forEach(b => b.addEventListener('click', () => {
      const card = gal.querySelector('.case');
      gal.scrollBy({ left: (+b.dataset.dir) * (card.offsetWidth + 18), behavior: reduce ? 'auto' : 'smooth' });
    }));
    let down = false, sx = 0, sl = 0, moved = false;
    gal.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = gal.scrollLeft; });
    window.addEventListener('pointermove', e => {
      if (!down) return; const dx = e.clientX - sx;
      if (Math.abs(dx) > 4) { moved = true; gal.classList.add('dragging'); }
      gal.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', () => { down = false; gal.classList.remove('dragging'); });
    gal.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); gal.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * 320, behavior: 'smooth' }); }
    });
  }

  // only one FAQ open at a time
  d.querySelectorAll('.faq details').forEach(dt => dt.addEventListener('toggle', () => {
    if (dt.open) d.querySelectorAll('.faq details[open]').forEach(o => o !== dt && (o.open = false));
  }));
})();
