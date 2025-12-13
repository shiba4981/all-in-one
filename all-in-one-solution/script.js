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

});
