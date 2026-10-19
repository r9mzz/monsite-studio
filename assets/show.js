/* Mon Site Studio — vitrines de la page Créations (après app.js) : l'écran grandit, le téléphone monte */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap, ST = window.ScrollTrigger;
  if (!gsap || !ST || reduce) return;
  document.querySelectorAll('.show').forEach(function (show) {
    var frame = show.querySelector('.show-frame'), phone = show.querySelector('.show-phone');
    if (frame) {
      gsap.fromTo(frame, { scale: 0.8, y: 40, rotateX: 8, transformPerspective: 1600 }, { scale: 1, y: 0, rotateX: 0, ease: 'none',
        scrollTrigger: { trigger: show, start: 'top 90%', end: 'top 15%', scrub: 0.6 } });
    }
    if (phone) {
      gsap.fromTo(phone, { yPercent: 40, rotate: 6 }, { yPercent: -18, rotate: -2, ease: 'none',
        scrollTrigger: { trigger: show, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    }
  });
})();
