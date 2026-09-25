/* Kashmir Travel with Ubaid — Site by Imaar Studio */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── header: transparent over the hero film, cream once past it ──── */
  var head = document.querySelector('.site-head');
  var hero = document.querySelector('.hero');
  if (head) {
    var onScroll = function () {
      // Flip just before the hero's bottom edge reaches the header, so the
      // bar is already solid by the time a light section is behind it.
      var trigger = hero ? hero.offsetHeight - head.offsetHeight - 8 : 8;
      head.classList.toggle('is-solid', window.scrollY > trigger);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* ── hero film ────────────────────────────────────────────────────────
     The markup ships with the <video> in place whether or not the files
     exist yet. Remove it when there is nothing to play, or when the viewer
     has asked for less motion — in both cases the still and then the
     gradient underneath take over on their own.
     -------------------------------------------------------------------- */
  var film = document.querySelector('.hero-film');
  if (film) {
    if (reduced) {
      film.remove();
    } else {
      var dropFilm = function () { if (film && film.parentNode) film.remove(); };

      /* Only fatal once every <source> has been tried and none resolved.
         Deliberately NOT a capture-phase listener: a 404 on the .webm fires
         an error from its own <source>, which in the capture phase passes
         through the <video> — treating that as fatal stripped the film
         before the .mp4 was ever attempted. */
      var failIfExhausted = function () {
        if (film.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) dropFilm();
      };
      film.addEventListener('error', failIfExhausted);
      Array.prototype.forEach.call(film.querySelectorAll('source'), function (src) {
        src.addEventListener('error', failIfExhausted);
      });

      /* Autoplay can still be refused (power saving, some mobile settings).
         Wait for `canplay` before asking: called any earlier, play() rejects
         with NotSupportedError while the browser is still walking the source
         list past the missing .webm, and that is not a real failure.
         No timeout here on purpose either — a slow connection is exactly when
         the film takes a while, and dropping it then wastes the bytes already
         spent. A stall simply rests on the poster frame. */
      film.addEventListener('canplay', function () {
        var attempt = film.play();
        if (attempt && typeof attempt['catch'] === 'function') attempt['catch'](dropFilm);
      });
    }
  }

  /* ── reveal on scroll ─────────────────────────────────────────────────
     Classes are added in JS so that with JS disabled, or if
     IntersectionObserver is missing, everything stays visible.
     ------------------------------------------------------------------ */
  if ('IntersectionObserver' in window && !reduced) {
    var targets = Array.prototype.slice.call(document.querySelectorAll(
      '.sec-head, .intro-copy, .intro-figure, .dest, .card, .season, ' +
      '.steps li, .rating, .quote, .loc-copy, .loc-map, .feature-copy, ' +
      '.feature-media, .grid-note, .how-cta'
    ));

    var show = function (el) {
      el.classList.add('is-in');
      el.style.transitionDelay = '';
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        show(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
      io.observe(el);
    });

    // Anything already in view on load reveals immediately, without waiting
    // for a scroll event.
    requestAnimationFrame(function () {
      targets.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) show(el);
      });
    });

    // Failsafe: content must never stay hidden. If the observer has not
    // fired for something within a few seconds — a jumped scroll position,
    // a restored session, an observer that never ran — reveal it anyway.
    setTimeout(function () {
      targets.forEach(show);
    }, 4000);
  }

  /* ── FAQ: one open at a time ─────────────────────────────────────── */
  var faqs = document.querySelectorAll('.faq details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      faqs.forEach(function (other) {
        if (other !== d) other.open = false;
      });
    });
  });

  /* ── mark the nav link for the section in view ───────────────────── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          // A class, not an inline colour: inline styles outrank the
          // light-on-film rules, so the active link used to turn dark green
          // and vanish into the video while the header was transparent.
          a.classList.toggle('is-current',
            a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { sio.observe(s); });
  }
})();
