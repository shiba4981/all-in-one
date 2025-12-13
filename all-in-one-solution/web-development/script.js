/* script.js
   Hooks expected in HTML:
   - header element with class "header"
   - mobile menu button with id "menuToggle" (optional)
   - nav container with class "nav"
   - elements with class "fade-in" to reveal on scroll
   - testimonials container with class "test-row" (auto-scroll)
   - contact form with id "contactForm" (AJAX) OR form element inside .card
   - Replace 'YOUR_FORMSPREE_ID' in the fetch URL if you want live email send.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Sticky header shadow on scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 8) header.style.boxShadow = '0 6px 18px rgba(2,6,23,0.25)';
    else header.style.boxShadow = 'none';
  });

  // Mobile menu toggle (if present)
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      // keep focus visible for a moment
      if (isOpen) nav.querySelector('a')?.focus();
    });
  }

  // Smooth internal link scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Scroll reveal for .fade-in
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Testimonials auto-scroll (simple)
  const testRow = document.querySelector('.test-row');
  if (testRow) {
    let scrollStep = 0;
    const maxScroll = testRow.scrollWidth - testRow.clientWidth;
    setInterval(() => {
      scrollStep += testRow.clientWidth;
      if (scrollStep > maxScroll) scrollStep = 0;
      testRow.scrollTo({ left: scrollStep, behavior: 'smooth' });
    }, 4500);
  }

  // Contact form submit (AJAX) - demo + Formspree option
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (status) status.textContent = 'Sending…';
      // small client-side validation
      const name = form.querySelector('#name')?.value.trim();
      const email = form.querySelector('#email')?.value.trim();
      const message = form.querySelector('#message')?.value.trim();
      if (!name || !email || !message) {
        if (status) status.textContent = 'Please complete name, email and message.';
        (form.querySelector('#name') || form.querySelector('#email') || form.querySelector('#message'))?.focus();
        return;
      }

      const data = new FormData(form);

      // DEMO MODE (no external service) - quick success simulation
      await new Promise(r => setTimeout(r, 700));
      if (status) status.textContent = 'Thanks — I will reply within 24–48 hours.';
      form.reset();

      // show toast confirmation if available
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = 'Request sent — thanks!';
        toast.setAttribute('aria-hidden', 'false');
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); toast.setAttribute('aria-hidden', 'true'); }, 4200);
      }
      return;

      /* To make live: uncomment and replace YOUR_FORMSPREE_ID with your Formspree ID
      try {
        const res = await fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          if (status) status.textContent = 'Thanks — I received your request.';
          form.reset();
        } else {
          const json = await res.json();
          if (status) status.textContent = json?.error || 'Error sending — try again';
        }
      } catch (err) {
        if (status) status.textContent = 'Network error — try again later';
        console.error(err);
      }
      */
    });
  }

  // small accessibility: keyboard skip to main if element exists
  const skipLink = document.querySelector('a[href="#main"]');
  if (skipLink) skipLink.addEventListener('click', (e) => {
    const target = document.getElementById('main');
    if (target) {
      e.preventDefault();
      target.tabIndex = -1;
      target.focus();
      window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    }
  });
});
// script.js
document.addEventListener('DOMContentLoaded', () => {
  // --- header shadow on scroll (keeps behaviour) ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 8) header.style.boxShadow = '0 6px 18px rgba(2,6,23,0.25)';
    else header.style.boxShadow = 'none';
  });

  // --- mobile menu toggle (if present) ---
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const shown = nav.style.display === 'flex';
      nav.style.display = shown ? '' : 'flex';
      menuToggle.setAttribute('aria-expanded', String(!shown));
    });
  }

  // --- smooth internal links ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- scroll reveal for .fade-in ---
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // --- testimonials auto-scroll ---
  const testRow = document.querySelector('.test-row');
  if (testRow) {
    let scrollStep = 0;
    const autoScroll = () => {
      const maxScroll = testRow.scrollWidth - testRow.clientWidth;
      scrollStep += testRow.clientWidth;
      if (scrollStep > maxScroll) scrollStep = 0;
      testRow.scrollTo({ left: scrollStep, behavior: 'smooth' });
    };
    setInterval(autoScroll, 4500);
  }

  // --- Contact form submit (demo mode) ---
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (status) status.textContent = 'Sending…';
      // small client-side validation
      const name = form.querySelector('#name')?.value.trim();
      const email = form.querySelector('#email')?.value.trim();
      const message = form.querySelector('#message')?.value.trim();
      if (!name || !email || !message) {
        if (status) status.textContent = 'Please complete name, email and message.';
        (form.querySelector('#name') || form.querySelector('#email') || form.querySelector('#message'))?.focus();
        return;
      }

      const data = new FormData(form);

      // Demo success (keeps existing demo behaviour)
      await new Promise(r => setTimeout(r, 700));
      if (status) status.textContent = 'Thanks — I will reply within 24–48 hours.';
      form.reset();

      // show toast confirmation if available
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = 'Request sent — thanks!';
        toast.setAttribute('aria-hidden', 'false');
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); toast.setAttribute('aria-hidden', 'true'); }, 4200);
      }
      return;

      /* To enable live: uncomment and replace YOUR_FORMSPREE_ID with your Formspree ID
      try {
        const res = await fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          if (status) status.textContent = 'Thanks — I received your request.';
          form.reset();
        } else {
          const json = await res.json();
          if (status) status.textContent = json?.error || 'Error sending — try again';
        }
      } catch (err) {
        if (status) status.textContent = 'Network error — try again later';
        console.error(err);
      }
      */
    });
  }

  // --- FAQ accordion behaviour ---
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // close all
      document.querySelectorAll('.faq-q').forEach(b => b.setAttribute('aria-expanded','false'));
      document.querySelectorAll('.faq-a').forEach(a => a.hidden = true);

      if (!expanded) {
        btn.setAttribute('aria-expanded','true');
        btn.nextElementSibling.hidden = false;
      }
    });
  });

  // --- small accessibility: skip to main if exists ---
  const skipLink = document.querySelector('a[href="#main"]');
  if (skipLink) skipLink.addEventListener('click', (e) => {
    const target = document.getElementById('main');
    if (target) {
      e.preventDefault();
      target.tabIndex = -1;
      target.focus();
      window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    }
  });

  // ---------------- Video adaptation ----------------
  const video = document.getElementById('bg-video');
  if (video) {
    // ensure sources with spaces are encoded (safety)
    const src = video.querySelector('source');
    if (src && src.src.includes(' ')) {
      src.src = src.src.split(' ').join('%20');
      video.load();
    }

    // function to adapt video visibility & playback to viewport size
    function adaptVideoToViewport() {
      const isSmall = window.matchMedia('(max-width: 780px)').matches;

      if (isSmall) {
        try { video.pause(); } catch(e){}
        video.style.display = 'none';
      } else {
        video.style.display = '';
        video.muted = true; // keep muted for autoplay
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            // Autoplay blocked — keep video muted and rely on poster/fallback
            console.warn('Video autoplay blocked:', err);
          });
        }
      }
    }

    adaptVideoToViewport();
    window.addEventListener('resize', adaptVideoToViewport);

    // resume when tab active (if appropriate)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && window.innerWidth > 780) {
        video.play().catch(()=>{});
      }
    });
  }

  // set year in footer if present
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Intro overlay behavior (VLSI intro video)
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('introOverlay');
  const video = document.getElementById('introVideo');
  const skipBtn = document.getElementById('skipIntro');
  const enterBtn = document.getElementById('enterSite');

  if (!overlay) return;

  // Do not persist 'intro seen' across reloads — play on every refresh.

  function hideOverlay() {
    overlay.classList.add('intro-hidden');
    overlay.setAttribute('aria-hidden','true');
  }

  // If on small screens, don't autoplay — show enter button instead
  const isSmall = window.matchMedia('(max-width: 780px)').matches;
  if (isSmall) {
    // show enter button (handled by CSS) and wire it
    enterBtn?.removeAttribute('hidden');
    enterBtn?.addEventListener('click', hideOverlay);
    skipBtn?.addEventListener('click', hideOverlay);
    return;
  }

  // Try to autoplay muted video; if autoplay blocked, reveal Enter button
  let skipTimeout;
  const showEnterFallback = () => {
    enterBtn?.removeAttribute('hidden');
    enterBtn?.addEventListener('click', hideOverlay);
    skipBtn?.removeEventListener('click', hideOverlay);
  };

  if (video) {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // video playing: show skip after 3 seconds
        skipTimeout = setTimeout(() => skipBtn?.removeAttribute('hidden'), 3000);
      }).catch(() => {
        // autoplay failed: show Enter fallback
        showEnterFallback();
      });
    } else {
      // older browsers: show skip after short delay
      skipTimeout = setTimeout(() => skipBtn?.removeAttribute('hidden'), 3000);
    }

    // end of video -> hide overlay
    video.addEventListener('ended', () => { hideOverlay(); });
  } else {
    // no video available: allow entering
    showEnterFallback();
  }

  // skip button always available after small delay
  skipBtn?.addEventListener('click', () => { if (skipTimeout) clearTimeout(skipTimeout); hideOverlay(); });

  // Allow scrolling (wheel) to skip the intro overlay
  function onWheel(e) {
    hideOverlay();
    window.removeEventListener('wheel', onWheel, { passive: true });
  }
  window.addEventListener('wheel', onWheel, { passive: true });
});

// Staggered reveal for sections marked `.stagger`
(function(){
  function applyStagger() {
    const containers = document.querySelectorAll('.stagger');
    containers.forEach(container => {
      const children = Array.from(container.children);
      children.forEach((child, i) => {
        child.style.setProperty('--delay', `${i * 120}ms`);
        child.classList.add('stagger-item');
      });

      const obs = new IntersectionObserver((entries, o) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            children.forEach((child, i) => {
              setTimeout(() => child.classList.add('visible'), i * 120);
            });
            o.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      obs.observe(container);
    });
  }

  // Run after DOM ready (ensures children in place)
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyStagger);
  else applyStagger();
})();
// optional: ensure links open in new tab with noopener
document.querySelectorAll('.tcard .social-btn').forEach(a => {
  a.addEventListener('click', (e) => {
    // default anchor with target=_blank already safe; this is just extra
    // we leave default behaviour — but prevent accidental navigation in SPA contexts
  });
});
