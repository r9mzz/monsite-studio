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
})();
