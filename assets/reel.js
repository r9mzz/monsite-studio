/* Créations : chaque site défile dans sa carte au rythme du défilement, puis laisse place au suivant */
(function () {
  var gsap = window.gsap, ST = window.ScrollTrigger;
  if (!gsap || !ST) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ST);
  ST.config({ ignoreMobileResize: true });

  // distance à parcourir pour montrer tout le site dans son écran
  function travel(screen) {
    var img = screen.querySelector('img');
    return function () { return -Math.max(0, img.offsetHeight - screen.clientHeight); };
  }

  document.querySelectorAll('.reel').forEach(function (reel) {
    var stage = reel.querySelector('.reel-stage');
    var cards = gsap.utils.toArray(reel.querySelectorAll('.rc'));
    var n = cards.length;
    reel.classList.add('reel-on');

    var prog = reel.querySelector('.reel-prog');
    cards.forEach(function () { var i = document.createElement('i'); i.appendChild(document.createElement('b')); prog.appendChild(i); });
    var bars = prog.querySelectorAll('b');
    var lab = document.createElement('span'); lab.className = 'mono'; lab.textContent = reel.getAttribute('data-label') || ''; prog.appendChild(lab);

    var info = cards.map(function (c) { return c.querySelector('.rc-info'); });
    var vis = cards.map(function (c) { return c.querySelector('.rc-vis'); });
    var below = function () { return stage.clientHeight; };

    gsap.set(cards, { visibility: 'visible' });
    gsap.set(info.slice(1), { autoAlpha: 0, y: 30 });
    gsap.set(vis.slice(1), { y: below });
    cards.forEach(function (c) { c.querySelectorAll('.rc-screen img').forEach(function (img) { img.loading = 'eager'; }); });

    var D = 1, T = 0.55;
    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: reel, start: 'top top', pin: true, scrub: 0.7, invalidateOnRefresh: true,
        end: function () { return '+=' + Math.round(innerHeight * n * 1.45); }
      }
    });

    var t = 0;
    cards.forEach(function (c, i) {
      var b = c.querySelector('.rc-browser .rc-screen'), p = c.querySelector('.rc-phone .rc-screen');
      tl.to(b.querySelector('img'), { y: travel(b), duration: D, ease: 'power1.inOut' }, t);
      tl.to(p.querySelector('img'), { y: travel(p), duration: D, ease: 'power1.inOut' }, t + 0.06);
      tl.fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: D + (i < n - 1 ? T : 0) }, t);
      if (i < n - 1) {
        var s = t + D;
        if (i > 0) tl.to(vis[i - 1], { autoAlpha: 0, duration: T * 0.6 }, s);
        tl.to(vis[i], { scale: 0.88, yPercent: -7, autoAlpha: 0.28, duration: T, ease: 'power1.in' }, s);
        tl.to(info[i], { autoAlpha: 0, y: -30, duration: T * 0.45, ease: 'power1.in' }, s);
        tl.to(vis[i + 1], { y: 0, duration: T, ease: 'power2.out' }, s);
        tl.to(info[i + 1], { autoAlpha: 1, y: 0, duration: T * 0.55, ease: 'power2.out' }, s + T * 0.45);
        t = s + T;
      } else {
        t += D;
      }
    });
    tl.to({}, { duration: 0.25 }, t);
  });

  addEventListener('load', function () { ST.refresh(); });
})();
