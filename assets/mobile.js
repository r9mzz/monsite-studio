/* Mon Site Studio — version mobile : interactions (sans bibliothèque, défilement natif) */
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

  /* ---------- Appareil : le site change de commerce ---------- */
  var order = ['sweet', 'nails', 'barber', 'flowers', 'bakery'];
  var screen = document.getElementById('screen'), dotsEl = document.getElementById('dots');
  var urlEl = document.getElementById('dev-url'), capEl = document.getElementById('dev-cap');
  screen.innerHTML = order.map(function (k, i) { return '<div class="slide' + (i === 0 ? ' on' : '') + '">' + miniHTML(k) + '</div>'; }).join('');
  dotsEl.innerHTML = order.map(function (_, i) { return '<span' + (i === 0 ? ' class="on"' : '') + '></span>'; }).join('');
  var slides = screen.children, dots = dotsEl.children, cur = 0;
  function label(k) { return k === 'sweet' ? 'Sweet Délices · client' : MINIS[k].brand + ' · concept'; }
  function show(n) {
    slides[cur].classList.remove('on'); dots[cur].classList.remove('on');
    cur = (n + order.length) % order.length;
    slides[cur].classList.add('on');
    var d = dots[cur]; void d.offsetWidth; d.classList.add('on');
    urlEl.textContent = MINIS[order[cur]].url; capEl.textContent = label(order[cur]);
  }
  var timer = reduce ? null : setInterval(function () { show(cur + 1); }, 3600);
  // Glisser sur l'appareil pour changer
  var sx = null;
  screen.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  screen.addEventListener('touchend', function (e) {
    if (sx == null) return;
    var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) < 40) return;
    show(cur + (dx < 0 ? 1 : -1));
    if (timer) { clearInterval(timer); timer = setInterval(function () { show(cur + 1); }, 3600); }
  });

  /* ---------- Barre du haut ---------- */
  var top = document.getElementById('top');

  /* ---------- Apparitions ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  document.querySelectorAll('.rv, .clip').forEach(function (el) { io.observe(el); });

  /* ---------- Indicateurs des carrousels ---------- */
  document.querySelectorAll('.swipe-hint').forEach(function (h) {
    var sw = document.getElementById(h.getAttribute('data-for')), bar = h.querySelector('i');
    function upd() {
      var max = sw.scrollWidth - sw.clientWidth, r = sw.clientWidth / sw.scrollWidth;
      bar.style.width = (r * 100) + '%';
      bar.style.transform = 'translateX(' + (max > 0 ? (sw.scrollLeft / max) * ((1 - r) / r) * 100 : 0) + '%)';
    }
    sw.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
  });

  /* ---------- Onglet actif, méthode, parallaxe ---------- */
  var tabs = document.querySelectorAll('.tabbar a');
  var secs = ['accueil', 'creations', 'devis', 'contact'].map(function (id) { return document.getElementById(id); });
  var steps = document.getElementById('steps'), stepLis = steps.querySelectorAll('li'), prog = steps.querySelector('.prog');
  var cover = document.getElementById('sd-cover');
  var paybar = document.getElementById('paybar'), devis = document.getElementById('devis'), est = document.getElementById('est');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    top.classList.toggle('solid', y > 10);
    var act = 'accueil';
    secs.forEach(function (s) { if (s.getBoundingClientRect().top < vh * 0.45) act = s.id; });
    if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) act = 'contact';
    tabs.forEach(function (t) { t.classList.toggle('on', t.getAttribute('data-tab') === act); });
    // méthode : la ligne se remplit
    var r = steps.getBoundingClientRect(), p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
    prog.style.setProperty('--p', p);
    stepLis.forEach(function (li) { li.classList.toggle('lit', li.getBoundingClientRect().top < vh * 0.6); });
    // parallaxe douce sur la photo client
    if (!reduce) { var cr = cover.parentNode.getBoundingClientRect(); cover.style.transform = 'translateY(' + (-(cr.top / vh) * 8 - 6) + '%)'; }
    // barre de prix visible pendant le devis
    var er = est.getBoundingClientRect();
    var inDevis = er.top < vh * 0.7 && er.bottom > vh * 0.5;
    paybar.classList.toggle('show', inDevis);
    document.body.classList.toggle('in-devis', inDevis);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Devis (tarifs dans assets/tarifs.js) ---------- */
  var fmt = function (n) { return n.toLocaleString('fr-FR').replace(/ | /g, ' '); };
  var money = function (p) { return p == null ? 'Sur devis' : fmt(p) + ' €'; };
  var plus = function (p) { return p == null ? 'Sur devis' : '+ ' + fmt(p) + ' €'; };
  document.getElementById('formule').innerHTML = FORMULES.map(function (f) {
    return '<label class="tile"><input type="radio" name="formule" id="f-' + f.id + '" value="' + f.id + '"' + (f.id === DEFAULT_FORMULE ? ' checked' : '') + '>' +
      '<span class="in"><b>' + f.nom + '</b><em>' + money(f.prix) + '</em><small>' + f.desc + '</small></span></label>';
  }).join('');
  document.getElementById('options').innerHTML = OPTIONS.map(function (o) {
    return '<label class="opt"><input type="checkbox" name="opt" id="o-' + o.id + '" value="' + o.id + '">' +
      '<span class="in"><span class="box"></span><span><b>' + o.nom + '</b><small>' + o.desc + '</small></span><span class="p">' + plus(o.prix) + '</span></span></label>';
  }).join('');
  function state() {
    var fid = (est.querySelector('input[name="formule"]:checked') || {}).value || DEFAULT_FORMULE;
    var f = FORMULES.filter(function (x) { return x.id === fid; })[0];
    var opts = Array.prototype.map.call(est.querySelectorAll('input[name="opt"]:checked'), function (i) {
      return OPTIONS.filter(function (o) { return o.id === i.value; })[0];
    });
    var tot = f.prix, open = false;
    opts.forEach(function (o) { if (o.prix == null) open = true; else tot += o.prix; });
    return { f: f, opts: opts, tot: tot, open: open };
  }
  var priceEl = document.getElementById('price');
  function render() {
    var s = state();
    priceEl.innerHTML = money(s.tot) + (s.open ? '<small>+ options</small>' : '');
    priceEl.classList.remove('bump'); void priceEl.offsetWidth; priceEl.classList.add('bump');
  }
  est.addEventListener('change', render);
  render();

  var sheet = document.getElementById('sheet');
  function openSheet() { sheet.hidden = false; void sheet.offsetWidth; document.body.classList.add('sheet-open'); }
  function closeSheet() { document.body.classList.remove('sheet-open'); setTimeout(function () { sheet.hidden = true; }, 500); }
  document.getElementById('sheet-close').addEventListener('click', closeSheet);
  document.getElementById('sheet-bg').addEventListener('click', closeSheet);

  est.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = document.getElementById('err');
    var missing = ['prenom', 'commerce', 'contact'].filter(function (id) {
      var el = document.getElementById(id), bad = !el.value.trim();
      el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      return bad;
    });
    if (missing.length) {
      err.textContent = 'Il manque ton prénom, le nom de ton commerce ou ton contact.';
      var first = document.getElementById(missing[0]);
      first.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      setTimeout(function () { first.focus({ preventScroll: true }); }, 400);
      return;
    }
    err.textContent = '';
    var s = state();
    var metier = (est.querySelector('input[name="metier"]:checked') || {}).value || 'Non précisé';
    var quand = (est.querySelector('input[name="quand"]:checked') || {}).value;
    var v = function (id) { return document.getElementById(id).value.trim(); };
    var recap = 'Bonjour Mon Site Studio !\n' +
      'Je suis ' + v('prenom') + ', de ' + v('commerce') + ' (' + metier + ').\n' +
      'Site : ' + s.f.nom + '\n' +
      'Options : ' + (s.opts.length ? s.opts.map(function (o) { return o.nom; }).join(', ') : 'aucune') + '\n' +
      'Pour quand : ' + quand + '\n' +
      'Estimation : ' + money(s.tot) + (s.open ? ' + options sur devis' : '') + '\n' +
      'Contact : ' + v('contact') + (v('message') ? '\nMessage : ' + v('message') : '');
    document.getElementById('recap').textContent = recap;
    document.getElementById('done-name').textContent = v('prenom');
    var mail = document.getElementById('mail');
    if (MS_MAIL) {
      mail.href = 'mailto:' + MS_MAIL + '?subject=' + encodeURIComponent('Demande de devis · ' + v('commerce')) + '&body=' + encodeURIComponent(recap);
      mail.hidden = false;
      document.getElementById('via').textContent = 'en message sur Instagram ou par e-mail';
    }
    openSheet();
  });

  document.getElementById('copy').addEventListener('click', function () {
    var btn = this, txt = document.getElementById('recap');
    var ok = function (m) { btn.textContent = m; setTimeout(function () { btn.textContent = 'Copier le récap'; }, 2200); };
    var sel = function () { var r = document.createRange(); r.selectNodeContents(txt); var w = getSelection(); w.removeAllRanges(); w.addRange(r); ok('Texte sélectionné'); };
    try { navigator.clipboard.writeText(txt.textContent).then(function () { ok('Copié !'); }, sel); } catch (e) { sel(); }
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
