/* Mon Site Studio — animations de l'accueil (après app.js) */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap, ST = window.ScrollTrigger;

  /* ---------- Tarifs : mêmes prix que la page Devis ---------- */
  var pl = document.getElementById('price5');
  if (pl && typeof FORMULES !== 'undefined') {
    pl.innerHTML = FORMULES.filter(function (f) { return f.prix != null; }).map(function (f) {
      return '<article class="price5-card' + (f.populaire ? ' top' : '') + '">' + (f.populaire ? '<span class="pop5">Le plus choisi</span>' : '') + '<h3>' + f.nom + '</h3><b>' + (f.des ? '<small>dès</small>' : '') + f.prix + ' €</b><p>' + f.gain + '</p><a class="ulink" href="devis.html">Recevoir ma maquette gratuite</a></article>';
    }).join('');
  }

  /* ---------- Carrousels (téléphone), sur le modèle des galeries d'Apple ----------
     Cartes qu'on fait glisser, voisines visibles, flèches sous la galerie, rien ne défile tout seul. */
  var phone = window.matchMedia('(max-width: 760px)');
  document.querySelectorAll('.carrousel').forEach(function (car) {
    var cards = Array.prototype.slice.call(car.children);
    var nav = car.nextElementSibling && car.nextElementSibling.classList.contains('car-nav') ? car.nextElementSibling : null;
    var prev = nav && nav.querySelector('.car-prev'), next = nav && nav.querySelector('.car-next');
    var cur = -1;
    function centre(i) { var c = cards[i]; return c.offsetLeft + c.offsetWidth / 2 - car.clientWidth / 2; }
    function go(i) { i = Math.max(0, Math.min(cards.length - 1, i)); car.scrollTo({ left: centre(i), behavior: reduce ? 'auto' : 'smooth' }); }
    if (prev) prev.addEventListener('click', function () { go(cur - 1); });
    if (next) next.addEventListener('click', function () { go(cur + 1); });
    function mark() {
      var mid = car.scrollLeft + car.clientWidth / 2, best = 0, d = 1e9;
      cards.forEach(function (c, i) { var k = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (k < d) { d = k; best = i; } });
      if (best === cur) return; cur = best;
      cards.forEach(function (c, i) { c.classList.toggle('actif', i === best); });
      if (prev) prev.disabled = best === 0;
      if (next) next.disabled = best === cards.length - 1;
    }
    car.addEventListener('scroll', function () { requestAnimationFrame(mark); }, { passive: true });

    // La formule mise en avant (Sur mesure) démarre au centre
    function start() {
      var top = cards.findIndex(function (c) { return c.classList.contains('top'); });
      if (phone.matches && top > 0) car.scrollLeft = centre(top);
      cur = -1; mark();
    }
    start(); window.addEventListener('load', start);
    // après un changement de taille (rotation, barre d'adresse), on garde la même carte au centre
    window.addEventListener('resize', function () { if (cur >= 0) car.scrollLeft = centre(cur); });
  });

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
    var N = 36;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    var G = 6; // lignes regroupées par intensité : 6 tracés par image au lieu d'un par ligne
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var phone = W < 760;
      var amp = phone ? 34 : H * .09, step = phone ? 10 : 16;
      var lg = ctx.createLinearGradient(0, 0, W, 0);
      lg.addColorStop(0, 'rgba(185,168,255,0)'); lg.addColorStop(.25, 'rgba(185,168,255,1)');
      lg.addColorStop(.7, 'rgba(150,120,255,1)'); lg.addColorStop(1, 'rgba(185,168,255,0)');
      ctx.strokeStyle = lg; ctx.lineWidth = phone ? 1 : 1.2;
      // valeurs communes à toutes les lignes pour chaque x
      var xs = [], bs = [], sp = [], p1 = [], p2 = [];
      for (var x = -20; x <= W + 20; x += step) {
        var u = x / W;
        xs.push(x);
        bs.push(phone ? 120 + u * 40 : H * (.16 + u * .3) + my * 40);
        sp.push((Math.sin(u * 3.1 + T * .00035) * .55 + .7) * (phone ? 90 : H * .3));
        p1.push(u * 5.2 + T * .0006); p2.push(u * 2.3 - T * .00042);
      }
      for (var g = 0; g < G; g++) {
        ctx.beginPath();
        for (var i = 0; i < N; i++) {
          var k = i / (N - 1), c = 1 - Math.abs(k - .5) * 2;
          if (Math.min(G - 1, Math.floor(c * G)) !== g) continue;
          for (var j = 0; j < xs.length; j++) {
            var y = bs[j] + Math.sin(p1[j] + k * 1.1) * amp + Math.sin(p2[j] + k * .6) * amp * .8 + (k - .5) * sp[j];
            if (j === 0) ctx.moveTo(xs[j], y); else ctx.lineTo(xs[j], y);
          }
        }
        ctx.globalAlpha = .1 + ((g + .5) / G) * .6;
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

/* ---------- Calcul : ce que le site rapporte par an ---------- */
(function () {
  var nr = document.getElementById('c-nr'), pr = document.getElementById('c-pr');
  if (!nr || !pr) return;
  var SITE = 350; // prix du site sur mesure, pour dire en combien de temps il est rentabilisé
  var tot = document.getElementById('c-tot'), txt = document.getElementById('c-txt');
  var fmt = function (n) { return Math.round(n).toLocaleString('fr-FR').replace(/\s/g, ' ') + ' €'; };
  var shown = { v: 0 }, gsap = window.gsap;
  var fill = function (r) { r.style.setProperty('--v', ((r.value - r.min) / (r.max - r.min) * 100) + '%'); };
  function update(anim) {
    var n = +nr.value, p = +pr.value, year = n * p * 12, mois = Math.ceil(SITE / (n * p));
    document.getElementById('c-n').textContent = n;
    document.getElementById('c-p').textContent = p + ' €';
    fill(nr); fill(pr);
    txt.textContent = mois <= 1 ? 'Un site sur mesure est rentabilisé dès le premier mois.'
      : 'Un site sur mesure est rentabilisé en ' + mois + ' mois environ, puis tout le reste est pour vous.';
    if (gsap && anim !== false) gsap.to(shown, { v: year, duration: .6, ease: 'expo.out', onUpdate: function () { tot.textContent = fmt(shown.v); } });
    else { shown.v = year; tot.textContent = fmt(year); }
  }
  nr.addEventListener('input', update); pr.addEventListener('input', update);
  update(false);
  // le chiffre monte la première fois que le bloc apparaît
  if (gsap && window.ScrollTrigger && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var end = shown.v; shown.v = 0; tot.textContent = fmt(0);
    window.ScrollTrigger.create({ trigger: '#calc', start: 'top 75%', once: true, onEnter: function () {
      gsap.to(shown, { v: end, duration: 1.6, ease: 'expo.out', onUpdate: function () { tot.textContent = fmt(shown.v); } });
    } });
  }
})();
