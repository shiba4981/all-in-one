document.addEventListener('DOMContentLoaded', () => {

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.nav');

  if(menuToggle){
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // On larger screens, ensure mobile menu is closed
  window.addEventListener('resize', () => {
    if(window.innerWidth > 780 && nav.classList.contains('open')){
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Set year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Reveal event/service/portfolio/testimonial/founder cards with staggered animation
  const revealTargets = document.querySelectorAll('.founder-card, .service-card, .portfolio-card, .testimonial');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealCard(card, delay = 0){
    if(prefersReducedMotion){
      card.classList.add('revealed');
      return;
    }
    setTimeout(() => card.classList.add('revealed'), delay);
  }

  if('IntersectionObserver' in window){
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const card = entry.target;
          const index = Array.from(revealTargets).indexOf(card);
          const delay = Math.min(320, index * 70);
          revealCard(card, delay);
          obs.unobserve(card);
        }
      });
    }, {threshold: 0.12});

    revealTargets.forEach(card => observer.observe(card));
  } else {
    // Fallback - reveal all on a small timeout
    revealTargets.forEach((card, i) => revealCard(card, i * 80));
  }

  // Portfolio modal preview
  const modal = document.getElementById('portfolioModal');
  const modalImg = modal ? modal.querySelector('.modal-inner img') : null;
  const modalClose = modal ? modal.querySelector('.modal-close') : null;

  function openModal(src, alt = ''){
    if(!modal || !modalImg) return;
    modalImg.src = src;
    modalImg.alt = alt;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    if(!modal || !modalImg) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    modalImg.alt = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.portfolio-card').forEach(card => {
    const btn = card.querySelector('.view-btn');
    const styleAttr = card.getAttribute('style') || '';
    // extract background image from inline style attribute
    let match = styleAttr.match(/url\(['"]?(.*?)['"]?\)/);
    let imageUrl = match ? match[1] : null;
    // fallback: get computed style backgroundImage if no inline style was present
    if(!imageUrl){
      const computed = window.getComputedStyle(card).backgroundImage || '';
      match = computed.match(/url\(['"]?(.*?)['"]?\)/);
      imageUrl = match ? match[1] : null;
    }
    const title = card.querySelector('.portfolio-title')?.textContent || '';
    if(btn && imageUrl){
      btn.addEventListener('click', () => openModal(imageUrl, title));
    }
    card.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        if(imageUrl) openModal(imageUrl, title);
      }
    });
    card.addEventListener('click', (e) => {
      // if click is not on CTA/button, open modal
      if(e.target.closest('.view-btn')) return;
      if(imageUrl) openModal(imageUrl, title);
    });
  });

  if(modal){
    modalClose && modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });
  }

  // Make pricing cards accessible: trigger CTA on Enter/Space
  document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        const link = card.querySelector('a');
        if(link) link.click();
      }
    });
  });

  // === Founders renderer: fetch centralized JSON and render unique founder cards ===
  async function renderFounders(){
    const dataUrl = '/assets/data/founders.json';
    try{
      const res = await fetch(dataUrl);
      if(!res.ok) throw new Error('Failed to fetch founders data');
      const founders = await res.json();
      // Deduplicate by name
      const map = new Map();
      founders.forEach(f => map.set(f.name.trim(), f));
      const unique = Array.from(map.values());

      document.querySelectorAll('.founders-grid').forEach(grid => {
        grid.setAttribute('role','list');
        const featured = grid.getAttribute('data-featured') || '';
        grid.innerHTML = '';
        unique.forEach(f => {
          const card = document.createElement('div');
          card.className = 'founder-card';
          if(featured && f.name.toLowerCase().includes(featured.toLowerCase())){
            card.classList.add('featured');
          }
          card.setAttribute('tabindex', '0');
          card.setAttribute('role','listitem');
          card.innerHTML = `
            <div class="founder-avatar"><img src="${f.avatar}" alt="${f.name}" loading="lazy"></div>
            <div class="founder-info">
              <div class="founder-name">${f.name}</div>
              <div class="founder-role">${f.role}</div>
              <div class="founder-team">${f.team}</div>
              <div class="founder-bio">${f.bio}</div>
              <div class="founder-actions">
                <a href="${f.instagram}" aria-label="${f.name} on Instagram" target="_blank" rel="noopener">Instagram</a>
                <a href="${f.linkedin}" aria-label="${f.name} on LinkedIn" target="_blank" rel="noopener">LinkedIn</a>
              </div>
            </div>
          `;
          // keyboard: open details (future) or focus
          card.addEventListener('keydown', (e) => {
            if(e.key === 'Enter' || e.key === ' '){
              e.preventDefault();
              // Future: open modal with profile or details
              card.classList.toggle('active');
            }
          });
          grid.appendChild(card);
        });
      });
    }catch(err){
      // fail silently – keep any static markup present as fallback
      console.warn('Founders load failed', err);
    }
  }
  renderFounders();

  // === Page-level background video controller (Event page) ===
  (function manageEventBackgroundVideo(){
    const video = document.getElementById('event-bg-video');
    if(!video) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsVideo = !!(video.play && video.addEventListener);
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;

    function shouldAutoplay(){
      if(prefersReducedMotion) return false;
      if(!supportsVideo) return false;
      if(connection){
        // effectiveType can be 'slow-2g', '2g', '3g', '4g'
        const type = connection.effectiveType || '';
        if(connection.saveData || type.includes('2g')) return false;
      }
      // Mobile screen optimization: don't autoplay on small screens
      if(window.innerWidth <= 780) return false;
      return true;
    }

    function fadeIn(){
      video.classList.remove('paused');
      video.classList.add('playing');
      // remove fallback / background image visually
      document.body.classList.add('event-video-playing');
    }
    function fadeOut(){
      video.classList.remove('playing');
      video.classList.add('paused');
      document.body.classList.remove('event-video-playing');
    }

    // When it's ready, fade in the video
    video.addEventListener('canplaythrough', () => {
      fadeIn();
    }, {once:true});

    // Pause/play based on page visibility
    document.addEventListener('visibilitychange', () => {
      if(document.hidden){
        fadeOut();
        try{ video.pause(); } catch(e){}
      } else {
        if(shouldAutoplay()){
          video.play().then(() => fadeIn()).catch(() => fadeOut());
        }
      }
    });

    // Initiate play/pause based on network and device
    if(shouldAutoplay()){
      // Attempt to play
      video.play().then(()=>{
        fadeIn();
      }).catch(()=>{
        // show poster (fallback) - keep it hidden by default but ensure we do not show a black screen
        fadeOut();
      });
    } else {
      // Ensure the video is not playing
      try{ video.pause() } catch(e){}
      fadeOut();
    }
  })();

});
