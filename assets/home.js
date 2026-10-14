/* Mon Site Studio — animations de l'accueil (après app.js) */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap, ST = window.ScrollTrigger;

  /* ---------- Mot qui change dans le titre ---------- */
  var rot = document.querySelector('.rot');
  if (rot) {
    var words = Array.prototype.slice.call(rot.querySelectorAll('.rot-w'));
    words.forEach(function (w) {
      var txt = w.textContent; w.textContent = '';
      Array.from(txt).forEach(function (ch, i) {
        var c = document.createElement('span'); c.className = 'c'; c.textContent = ch;
        c.style.transitionDelay = (i * 0.025) + 's'; w.appendChild(c);
      });
    });
    var cur = 0;
    var fit = function () { rot.style.width = words[cur].getBoundingClientRect().width + 'px'; };
    fit(); window.addEventListener('resize', fit);
    if (document.fonts) document.fonts.ready.then(fit);
    if (!reduce) setInterval(function () {
      var prev = words[cur]; cur = (cur + 1) % words.length; var next = words[cur];
      prev.classList.remove('on'); prev.classList.add('out');
      next.classList.add('on'); fit();
      setTimeout(function () {
        // remet le mot sorti en bas, sans animation, pour son prochain passage
        prev.querySelectorAll('.c').forEach(function (c) { c.style.transition = 'none'; });
        prev.classList.remove('out'); void prev.offsetWidth;
        prev.querySelectorAll('.c').forEach(function (c) { c.style.transition = ''; });
      }, 1100);
    }, 2600);
  }

  /* ---------- Titres de section : lignes qui montent ---------- */
  document.querySelectorAll('.split-lines').forEach(function (h) {
    var words = h.textContent.trim().split(/\s+/);
    h.innerHTML = words.map(function (w) { return '<span class="sw" style="display:inline-block">' + w + '</span>'; }).join(' ');
    var lines = [], top = null;
    h.querySelectorAll('.sw').forEach(function (s) {
      if (s.offsetTop !== top) { lines.push([]); top = s.offsetTop; }
      lines[lines.length - 1].push(s.textContent);
    });
    h.innerHTML = lines.map(function (l) { return '<span class="sl"><span>' + l.join(' ') + '</span></span>'; }).join('');
    if (gsap && ST && !reduce) {
      gsap.from(h.querySelectorAll('.sl > span'), { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
    }
  });

  /* ---------- Vitrine : l'écran grandit, le téléphone monte ---------- */
  if (gsap && ST && !reduce) {
    var frame = document.querySelector('.show-frame'), phone = document.querySelector('.show-phone');
    if (frame) {
      gsap.fromTo(frame, { scale: 0.8, y: 40, rotateX: 8, transformPerspective: 1600 }, { scale: 1, y: 0, rotateX: 0, ease: 'none',
        scrollTrigger: { trigger: '.show', start: 'top 90%', end: 'top 15%', scrub: 0.6 } });
    }
    if (phone) {
      gsap.fromTo(phone, { yPercent: 40, rotate: 6 }, { yPercent: -18, rotate: -2, ease: 'none',
        scrollTrigger: { trigger: '.show', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    }
  }

  /* ---------- Créations : l'aperçu suit la souris ---------- */
  var list = document.querySelector('.plist'), pv = document.querySelector('.ppv');
  if (list && pv && window.matchMedia('(hover:hover)').matches) {
    var slides = pv.querySelectorAll('.ppv-s');
    var mx = 0, my = 0, x = 0, y = 0, r = 0, raf = null;
    function loop() {
      var dx = mx - x; x += dx * 0.14; y += (my - y) * 0.14;
      r += (Math.max(-12, Math.min(12, dx * 0.12)) - r) * 0.1;
      pv.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%) rotate(' + r + 'deg)';
      raf = requestAnimationFrame(loop);
    }
    list.addEventListener('mouseenter', function (e) { x = mx = e.clientX; y = my = e.clientY; pv.classList.add('on'); if (!raf) loop(); });
    list.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    list.addEventListener('mouseleave', function () { pv.classList.remove('on'); cancelAnimationFrame(raf); raf = null; });
    list.querySelectorAll('a[data-pv]').forEach(function (a) {
      a.addEventListener('mouseenter', function () {
        var i = +a.getAttribute('data-pv');
        slides.forEach(function (s, k) { s.classList.toggle('on', k === i); s.style.zIndex = k === i ? 2 : 1; });
      });
    });
  }

  /* ---------- Vague violette du héro (couleur du point du logo) ---------- */
  var cv = document.querySelector('.h5-wave');
  if (cv && cv.getContext) {
    var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = 1, T = 0, last = 0, run = false;
    var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var my = 0, ty = 0, mx = .5, tx = .5;
    var N = 42;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var phone = W < 760;
      // halo qui se déplace sous la vague
      var gx = W * (.62 + Math.sin(T * .00021) * .16 + (mx - .5) * .08), gy = H * (.36 + Math.cos(T * .00017) * .08);
      var g = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(W, H) * .42);
      g.addColorStop(0, 'rgba(124,92,255,.20)'); g.addColorStop(.5, 'rgba(124,92,255,.06)'); g.addColorStop(1, 'rgba(124,92,255,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // ruban de lignes
      var amp = H * (phone ? .07 : .09), step = phone ? 8 : 10;
      var lg = ctx.createLinearGradient(0, 0, W, 0);
      lg.addColorStop(0, 'rgba(185,168,255,0)'); lg.addColorStop(.25, 'rgba(185,168,255,1)');
      lg.addColorStop(.7, 'rgba(150,120,255,1)'); lg.addColorStop(1, 'rgba(185,168,255,0)');
      ctx.strokeStyle = lg; ctx.lineWidth = phone ? 1 : 1.2;
      for (var i = 0; i < N; i++) {
        var k = i / (N - 1), c = 1 - Math.abs(k - .5) * 2;
        ctx.globalAlpha = .1 + c * .6;
        ctx.beginPath();
        for (var x = -20; x <= W + 20; x += step) {
          var u = x / W;
          var base = H * (.16 + u * .3) + my * 40;
          var spread = (Math.sin(u * 3.1 + T * .00035) * .55 + .7) * H * (phone ? .22 : .3);
          var y = base
            + Math.sin(u * 5.2 + T * .0006 + k * 1.1) * amp
            + Math.sin(u * 2.3 - T * .00042 + k * .6) * amp * .8
            + (k - .5) * spread;
          if (x < 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    function loop(now) {
      if (!run) return;
      T += Math.min(now - (last || now), 50); last = now;
      my += (ty - my) * .04; mx += (tx - mx) * .04;
      draw(); requestAnimationFrame(loop);
    }
    function start() { if (run || still) return; run = true; last = 0; requestAnimationFrame(loop); }
    size(); T = 4000; draw(); cv.classList.add('on');
    window.addEventListener('resize', function () { size(); draw(); });
    if (!still) {
      window.addEventListener('pointermove', function (e) { ty = (e.clientY / innerHeight - .5); tx = e.clientX / innerWidth; }, { passive: true });
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) start(); else run = false; }); }).observe(cv);
      document.addEventListener('visibilitychange', function () { if (document.hidden) run = false; else start(); });
    }
  }
})();
