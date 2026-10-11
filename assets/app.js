/* Mon Site Studio — interactions communes à toutes les pages */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mini-sites dessinés en CSS ---------- */
  var MINIS = {
    sweet: {
      cls: 'm-sweet', url: 'sweetdelices.fr', brand: 'Sweet Délices',
      nav: ['La carte', 'Traiteur', 'Devis'], title: 'Pâtisserie & traiteur',
      text: 'Canette cakes, cookies et buffets faits maison, sur commande.', btn: 'Commander',
      art: '<img src="img/sd-cookie-redvelvet.jpg" alt="">'
    },
    nails: {
      cls: 'm-nails', url: 'ongleslina.fr', brand: 'Ongles Lina',
      nav: ['Prestations', 'Galerie', 'Réserver'], title: 'Des mains qui se remarquent.',
      text: 'Pose gel, nail art et soins des mains, sur rendez-vous.', btn: 'Prendre rendez-vous',
      art: '<span></span><span></span><span></span><span></span>'
    },
    barber: {
      cls: 'm-barber', url: 'kbarber.fr', brand: 'K. Barber',
      nav: ['Tarifs', 'Équipe', 'Réserver'], title: 'Coupe nette. Barbe propre.',
      text: 'Dégradés, contours et taille de barbe. Sans attente, sur réservation.', btn: 'Réserver ma place',
      art: ''
    },
    flowers: {
      cls: 'm-flowers', url: 'fleursdamel.fr', brand: 'Fleurs d’Amel',
      nav: ['Bouquets', 'Mariages', 'Livraison'], title: 'Des bouquets qui font sourire.',
      text: 'Fleurs de saison, bouquets sur mesure et livraison le jour même.', btn: 'Choisir un bouquet',
      art: '<b></b><b></b><b></b>'
    },
    bakery: {
      cls: 'm-bakery', url: 'fournilnour.fr', brand: 'Le Fournil de Nour',
      nav: ['Nos pains', 'Horaires', 'Commander'], title: 'Pain au levain, cuit ce matin.',
      text: 'Pains, viennoiseries et pâtisseries. Commande la veille, récupère le matin.', btn: 'Commander pour demain',
      art: '<span></span>'
    }
  };
  function miniHTML(k) {
    var m = MINIS[k];
    return '<div class="mini ' + m.cls + '" aria-hidden="true">' +
      '<div class="mini-nav"><span class="brand">' + m.brand + '</span><ul>' +
      m.nav.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul></div>' +
      '<div class="mini-body"><div><h4>' + m.title + '</h4><p>' + m.text + '</p><span class="mb">' + m.btn + '</span></div>' +
      '<div class="art">' + m.art + '</div></div></div>';
  }
  document.querySelectorAll('[data-mini]').forEach(function (el) { el.innerHTML = miniHTML(el.getAttribute('data-mini')); });

  /* ---------- Héro : le navigateur change de commerce ---------- */
  var machine = document.querySelector('.machine');
  if (machine) {
    var order = ['sweet', 'nails', 'barber', 'flowers', 'bakery'];
    var screen = machine.querySelector('.screen');
    var urlEl = machine.querySelector('.url b');
    var capEl = machine.querySelector('.machine-name');
    var dotsEl = machine.querySelector('.dots');
    screen.innerHTML = order.map(function (k, i) {
      return '<div class="slide' + (i === 0 ? ' is-on' : '') + '">' + miniHTML(k) + '</div>';
    }).join('');
    dotsEl.innerHTML = order.map(function (_, i) { return '<span' + (i === 0 ? ' class="on"' : '') + '></span>'; }).join('');
    var slides = screen.querySelectorAll('.slide'), dots = dotsEl.querySelectorAll('span'), cur = 0;
    function label(k) { return k === 'sweet' ? 'Sweet Délices · client' : MINIS[k].brand + ' · concept'; }
    urlEl.textContent = MINIS[order[0]].url; capEl.textContent = label(order[0]);
    function next() {
      var prev = cur; cur = (cur + 1) % order.length;
      slides.forEach(function (s) { s.classList.remove('is-off'); });
      slides[prev].classList.remove('is-on'); slides[prev].classList.add('is-off');
      slides[cur].classList.add('is-on');
      dots.forEach(function (d, i) { d.classList.toggle('on', i === cur); });
      // relance l'animation de la barre
      var d = dots[cur]; d.classList.remove('on'); void d.offsetWidth; d.classList.add('on');
      urlEl.textContent = MINIS[order[cur]].url; capEl.textContent = label(order[cur]);
    }
    if (!reduce) setInterval(next, 3600);
  }

  /* ---------- En-tête ---------- */
  var nav = document.querySelector('.nav');
  function onScrollNav() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScrollNav, { passive: true }); onScrollNav();

  /* ---------- Manifeste : mots qui s'allument ---------- */
  var mani = document.querySelector('.manifesto .big');
  var words = [];
  if (mani) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); words.push(s);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1) { walk(c); }
      });
    };
    walk(mani);
    var light = function () {
      var vh = window.innerHeight;
      words.forEach(function (w) { w.classList.toggle('lit', w.getBoundingClientRect().top < vh * 0.72); });
    };
    window.addEventListener('scroll', light, { passive: true }); window.addEventListener('resize', light); light();
  }

  /* ---------- Curseur ---------- */
  var cursor = document.querySelector('.cursor');
  if (cursor && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
    (function loop() { cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2; cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(loop); })();
    document.querySelectorAll('[data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.querySelector('span').textContent = el.getAttribute('data-cursor'); cursor.classList.add('big'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('big'); });
    });
  }

  /* ---------- Rideau entre les pages ---------- */
  var curtain = document.querySelector('.curtain');
  var store = { get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
                set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
                del: function (k) { try { sessionStorage.removeItem(k); } catch (e) {} } };
  var root = document.documentElement;
  if (curtain && !reduce && curtain.animate) {
    var la = curtain.querySelector('.c-a'), lb = curtain.querySelector('.c-b'),
        logo = curtain.querySelector('.c-logo'), bar = curtain.querySelector('.c-bar'), barIn = curtain.querySelector('.c-bar span');
    var EASE = 'cubic-bezier(.76,0,.24,1)';
    var keep = { fill: 'both' };
    var anim = function (el, kf, o) { return el.animate(kf, Object.assign({ easing: EASE }, keep, o)); };
    var clearAll = function () { [la, lb, logo, bar, barIn].forEach(function (el) { el.getAnimations().forEach(function (x) { x.cancel(); }); }); };

    // Arrivée : le rideau se lève et découvre la page
    if (store.get('ms-curtain') === '1' || root.classList.contains('arriving')) {
      store.del('ms-curtain'); window.__msArrive = 0.75;
      root.classList.add('arriving');
      var up = [{ transform: 'translateY(0)', borderRadius: '0 0 0 0/0 0 0 0' }, { transform: 'translateY(-105%)', borderRadius: '0 0 50% 50%/0 0 14% 14%' }];
      anim(logo, [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-24px)' }], { duration: 450, delay: 150, easing: 'cubic-bezier(.4,0,.2,1)' });
      anim(bar, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 150 });
      anim(lb, up, { duration: 1000, delay: 380 });
      var last = anim(la, up, { duration: 1000, delay: 480 });
      setTimeout(function () { root.classList.remove('arriving'); }, 420);
      last.onfinish = clearAll;
    }

    // Départ : le rideau monte, le logo apparaît, puis on change de page
    var leaving = false;
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || a.target === '_blank' || /^(https?:|mailto:|tel:)/.test(href)) return;
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || leaving) return;
        var here = location.pathname.split('/').pop() || 'index.html';
        var target = href.split('#')[0].replace('./', '') || 'index.html';
        if (target === here && href.indexOf('#') > -1) return;
        e.preventDefault(); leaving = true;
        store.set('ms-curtain', '1');
        clearAll();
        var cover = [{ transform: 'translateY(105%)', borderRadius: '50% 50% 0 0/14% 14% 0 0' }, { transform: 'translateY(0)', borderRadius: '0 0 0 0/0 0 0 0' }];
        anim(la, cover, { duration: 750 });
        anim(lb, cover, { duration: 750, delay: 110 });
        anim(logo, [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 500, delay: 520, easing: 'cubic-bezier(.22,1,.36,1)' });
        anim(bar, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 560 });
        var fill = anim(barIn, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 420, delay: 620, easing: 'cubic-bezier(.65,0,.35,1)' });
        fill.onfinish = function () { location.href = a.href; };
      });
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) { leaving = false; clearAll(); root.classList.remove('arriving'); } });
  } else {
    root.classList.remove('arriving');
  }

  /* ---------- Découpe en lettres ---------- */
  function splitChars(root) {
    var out = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          Array.from(c.textContent).forEach(function (ch) {
            if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; frag.appendChild(s); out.push(s);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'svg') { walk(c); }
      });
    })(root);
    return out;
  }
  document.querySelectorAll('.split-chars, .foot-word').forEach(function (el) { el._chars = splitChars(el); });

  /* ---------- Lumière du héro (canvas) ---------- */
  var aura = document.querySelector('.aura');
  if (aura && !reduce) {
    var ctx = aura.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 1.5), W = 0, H = 0, run = true, mx = .7, my = .4;
    var blobs = [
      { c: '185,168,255', a: .30, r: .42, x: .72, y: .35, sx: .00011, sy: .00017, p: 0 },
      { c: '255,164,132', a: .14, r: .34, x: .25, y: .75, sx: .00015, sy: .0001, p: 2 },
      { c: '110,205,190', a: .10, r: .30, x: .9, y: .85, sx: .00009, sy: .00013, p: 4 }
    ];
    var size = function () { var r = aura.getBoundingClientRect(); W = r.width; H = r.height; aura.width = W * dpr; aura.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); window.addEventListener('resize', size);
    aura.parentElement.addEventListener('mousemove', function (e) { var r = aura.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { run = en[0].isIntersecting; if (run) requestAnimationFrame(draw); }).observe(aura);
    function draw(t) {
      if (!run) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      blobs.forEach(function (b, i) {
        var x = (b.x + Math.sin(t * b.sx + b.p) * .12 + (mx - .5) * .06 * (i + 1)) * W;
        var y = (b.y + Math.cos(t * b.sy + b.p) * .12 + (my - .5) * .06 * (i + 1)) * H;
        var r = b.r * Math.max(W, H);
        var g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(' + b.c + ',' + b.a + ')'); g.addColorStop(1, 'rgba(' + b.c + ',0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      });
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ---------- Navigateur en 3D qui suit la souris ---------- */
  var tilt = document.querySelector('.tilt');
  if (tilt && !reduce && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var rx = 0, ry = 0, trx = 0, try_ = 0;
    document.querySelector('.hero').addEventListener('mousemove', function (e) {
      var r = tilt.getBoundingClientRect();
      try_ = ((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 16;
      trx = -((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * 12;
    });
    document.querySelector('.hero').addEventListener('mouseleave', function () { trx = 0; try_ = 0; });
    (function loopT() { rx += (trx - rx) * .08; ry += (try_ - ry) * .08; tilt.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)'; requestAnimationFrame(loopT); })();
  }

  /* ---------- Boutons aimantés ---------- */
  if (!reduce && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .3).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .4).toFixed(1) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------- Année ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Défilement fluide et animations (si les bibliothèques sont chargées) ---------- */
  if (reduce) return;
  var lenis = null;
  if (window.Lenis) {
    try {
      lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var t = document.querySelector(a.getAttribute('href'));
          if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -70 }); }
        });
      });
    } catch (e) { lenis = null; }
  }
  var gsap = window.gsap, ST = window.ScrollTrigger;
  if (gsap && ST) {
    gsap.registerPlugin(ST);
    if (lenis) { lenis.on('scroll', ST.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }

    // Entrée du titre : les lignes montent
    var d0 = window.__msArrive || 0;
    gsap.from('.reveal-lines .line > span', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.15 + d0 });
    gsap.from('.reveal-fade', { y: 24, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.55 + d0 });

    // Bande des styles : glisse sur le côté pendant qu'on descend, sans bloquer le défilement
    var mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', function () {
      var wrap = document.querySelector('.hscroll'), track = document.querySelector('.htrack');
      if (!wrap || !track) return;
      wrap.style.overflow = 'hidden';
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      gsap.fromTo(track, { x: 0 }, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: '.styles', start: 'top 85%', end: 'bottom 15%', scrub: 0.8, invalidateOnRefresh: true }
      });
      return function () { wrap.style.overflow = ''; gsap.set(track, { clearProps: 'transform' }); };
    });

    // Parallaxe légère des photos
    gsap.utils.toArray('[data-speed]').forEach(function (el) {
      gsap.to(el, { yPercent: parseFloat(el.getAttribute('data-speed')) * -20, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Grand mot du pied de page
    gsap.from('.foot-word', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    // Titre : trait sous « envie » et navigateur qui se pose
    gsap.fromTo('.swash path', { strokeDashoffset: 320 }, { strokeDashoffset: 0, duration: 1.4, ease: 'expo.inOut', delay: 1.0 + d0 });
    gsap.from('.tilt', { rotateX: 24, y: 70, duration: 1.8, ease: 'expo.out', delay: 0.4 + d0 });

    // Bande des métiers : accélère avec le défilement
    var mq = document.querySelector('.marquee-track');
    if (mq) {
      mq.style.animation = 'none';
      var mqx = 0, dir = 1, vel = 0;
      ST.create({ onUpdate: function (self) { vel = self.getVelocity(); if (self.direction) dir = self.direction; } });
      gsap.ticker.add(function () {
        var half = mq.scrollWidth / 2;
        vel *= 0.92;
        mqx -= (0.6 + Math.min(Math.abs(vel) / 220, 14)) * dir;
        if (mqx <= -half) mqx += half; if (mqx > 0) mqx -= half;
        mq.style.transform = 'translate3d(' + mqx + 'px,0,0)';
      });
    }

    // Cartes : légère inclinaison selon la vitesse
    var frames = gsap.utils.toArray('.htrack .frame');
    if (frames.length) {
      var skewTo = frames.map(function (f) { return gsap.quickTo(f, 'skewX', { duration: .5, ease: 'power3' }); });
      ST.create({ onUpdate: function (self) {
        var v = gsap.utils.clamp(-1.5, 1.5, self.getVelocity() / -1500);
        skewTo.forEach(function (fn) { fn(v); });
        gsap.delayedCall(.12, function () { skewTo.forEach(function (fn) { fn(0); }); });
      } });
    }

    // Trois colonnes : trait, icône dessinée, texte
    gsap.utils.toArray('.tri').forEach(function (el, i) {
      var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true }, delay: i * .12 });
      tl.fromTo(el, { '--line-x': 0 }, { '--line-x': 1, duration: 1.1, ease: 'expo.inOut' })
        .fromTo(el.querySelectorAll('.ico *'), { strokeDashoffset: 200 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out' }, '-=.8')
        .from(el.querySelectorAll('h3, p'), { y: 26, autoAlpha: 0, duration: .9, ease: 'expo.out', stagger: .08 }, '-=1.2');
    });

    // Étapes : la ligne se remplit
    if (document.querySelector('.steps-wrap')) {
      gsap.fromTo('.steps-wrap', { '--p': 0 }, { '--p': 1, ease: 'none', scrollTrigger: { trigger: '.steps-wrap', start: 'top 80%', end: 'bottom 60%', scrub: true } });
      gsap.from('.steps li', { y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: .14, scrollTrigger: { trigger: '.steps', start: 'top 82%', once: true } });
    }

    // Grand titre final : lettre par lettre
    document.querySelectorAll('.split-chars').forEach(function (el) {
      gsap.from(el._chars, { yPercent: 110, rotate: 8, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: .025, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });

    // Page Créations : apparitions en rideau
    gsap.utils.toArray('.case-cover, .shots > *, .concepts .card').forEach(function (el) {
      gsap.fromTo(el, { clipPath: 'inset(18% 0 0 0 round 18px)', y: 40 }, { clipPath: 'inset(0% 0 0 0 round 0px)', y: 0, duration: 1.3, ease: 'expo.out', clearProps: 'clipPath', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });

    window.addEventListener('load', function () { ST.refresh(); });
  } else if (lenis) {
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
  }
})();
